import { useMemo, useState } from 'react'
import type { Invoice } from '../features/invoices/invoiceSlice'
import { getEffectiveInvoiceStatus, getInvoiceTotal } from '../features/invoices/invoiceSlice'
import { CustomerEditForm } from './CustomerEditForm'

type CustomersPageProps = {
  invoices: Invoice[]
  onCreate: () => void
  onUpdateCustomer: (customerKey: string, name: string, email: string) => void
}

type CustomerRecord = {
  key: string
  name: string
  email: string
  invoiceCount: number
  latestInvoice: string
  statuses: string[]
  totals: Record<string, number>
}

function getCustomers(invoices: Invoice[]): CustomerRecord[] {
  const customers = new Map<string, CustomerRecord>()
  for (const invoice of invoices) {
    const key = invoice.customerEmail.trim().toLowerCase() || invoice.customerName.trim().toLowerCase()
    const existing = customers.get(key)
    if (!existing) {
      customers.set(key, {
        key,
        name: invoice.customerName,
        email: invoice.customerEmail,
        invoiceCount: 1,
        latestInvoice: invoice.issueDate,
        statuses: [getEffectiveInvoiceStatus(invoice)],
        totals: { [invoice.currency]: getInvoiceTotal(invoice) },
      })
      continue
    }
    existing.invoiceCount += 1
    existing.latestInvoice = existing.latestInvoice > invoice.issueDate ? existing.latestInvoice : invoice.issueDate
    existing.statuses.push(getEffectiveInvoiceStatus(invoice))
    existing.totals[invoice.currency] = (existing.totals[invoice.currency] ?? 0) + getInvoiceTotal(invoice)
  }
  return [...customers.values()].sort((left, right) => left.name.localeCompare(right.name))
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date(`${value}T00:00:00`))
}

function formatTotals(totals: Record<string, number>) {
  return Object.entries(totals).map(([currency, amount]) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount),
  ).join(' · ')
}

function customerStatus(statuses: string[]) {
  if (statuses.includes('Overdue')) return 'Overdue'
  if (statuses.includes('Sent')) return 'Awaiting payment'
  if (statuses.includes('Paid')) return 'Paid'
  return 'Draft'
}

export function CustomersPage({ invoices, onCreate, onUpdateCustomer }: CustomersPageProps) {
  const [search, setSearch] = useState('')
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null)
  const customers = useMemo(() => getCustomers(invoices), [invoices])
  const filteredCustomers = customers.filter((customer) => {
    const query = search.trim().toLowerCase()
    return !query || customer.name.toLowerCase().includes(query) || customer.email.toLowerCase().includes(query)
  })
  const billedByCurrency = customers.reduce<Record<string, number>>((groups, customer) => {
    for (const [currency, total] of Object.entries(customer.totals)) {
      groups[currency] = (groups[currency] ?? 0) + total
    }
    return groups
  }, {})

  return (
    <>
      <section className="customer-stats" aria-label="Customer summary">
        <article><span>Total customers</span><strong>{customers.length}</strong><small>Unique billing contacts</small></article>
        <article><span>Invoices sent</span><strong>{invoices.filter((invoice) => invoice.status !== 'Draft').length}</strong><small>Across all customers</small></article>
        <article><span>Total billed</span><strong>{Object.keys(billedByCurrency).length ? formatTotals(billedByCurrency) : '—'}</strong><small>Grouped by invoice currency</small></article>
      </section>
      <section className="invoice-section customer-section" aria-labelledby="customers-heading">
        <div className="section-heading">
          <div><h2 id="customers-heading">All customers</h2><p>Customers are added when you create their first invoice.</p></div>
          <button className="primary-button" onClick={onCreate}><span>＋</span> Create invoice</button>
        </div>
        <div className="table-toolbar customer-toolbar">
          <span className="customer-result-count">{customers.length} customer{customers.length === 1 ? '' : 's'}</span>
          <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers..." aria-label="Search customers" /></label>
        </div>
        {filteredCustomers.length ? (
          <div className="table-scroll">
            <table className="invoice-table customer-table">
              <thead><tr><th scope="col">CUSTOMER</th><th scope="col">INVOICES</th><th scope="col">TOTAL BILLED</th><th scope="col">LATEST INVOICE</th><th scope="col">PAYMENT STATUS</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr></thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const status = customerStatus(customer.statuses)
                  return (
                    <tr key={customer.key}>
                      <td><span className="customer-cell"><span className="customer-avatar">{customer.name.charAt(0).toUpperCase()}</span><span>{customer.name}<small>{customer.email || 'No email provided'}</small></span></span></td>
                      <td>{customer.invoiceCount}</td>
                      <td className="amount-cell">{formatTotals(customer.totals)}</td>
                      <td>{formatDate(customer.latestInvoice)}</td>
                      <td><span className={`status-pill ${status === 'Awaiting payment' ? 'sent' : status.toLowerCase()}`}><i />{status}</span></td>
                      <td><button className="customer-edit-button" type="button" onClick={() => setEditingCustomer(customer)} aria-label={`Edit ${customer.name}`}>Edit</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state"><span className="empty-icon">♙</span><h3>{search ? 'No matching customers' : 'No customers yet'}</h3><p>{search ? 'Try another name or email.' : 'Create an invoice to add your first customer.'}</p>{!search && <button className="secondary-button" onClick={onCreate}>＋ Create an invoice</button>}</div>
        )}
        <div className="table-footer"><span>Showing <strong>{filteredCustomers.length}</strong> of <strong>{customers.length}</strong> customers</span><span>Derived from saved invoices</span></div>
      </section>
      {editingCustomer && (
        <CustomerEditForm
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={(name, email) => {
            onUpdateCustomer(editingCustomer.key, name, email)
            setEditingCustomer(null)
          }}
        />
      )}
    </>
  )
}
