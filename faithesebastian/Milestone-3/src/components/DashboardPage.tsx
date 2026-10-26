import type { Invoice } from '../features/invoices/invoiceSlice'
import { getEffectiveInvoiceStatus, getInvoiceTotal } from '../features/invoices/invoiceSlice'
import { InvoiceTable } from './InvoiceTable'

type DashboardPageProps = {
  invoices: Invoice[]
  onCreate: () => void
  onOpenInvoices: () => void
  onEdit: (invoice: Invoice) => void
  onMarkPaid: (id: string) => void
  onMarkSent: (id: string) => void
  onDelete: (id: string) => void
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function DashboardPage({
  invoices,
  onCreate,
  onOpenInvoices,
  onEdit,
  onMarkPaid,
  onMarkSent,
  onDelete,
}: DashboardPageProps) {
  const recentInvoices = [...invoices]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 5)
  const overdueInvoices = invoices.filter((invoice) => getEffectiveInvoiceStatus(invoice) === 'Overdue')
  const outstanding = overdueInvoices.reduce<Record<string, number>>((groups, invoice) => {
    groups[invoice.currency] = (groups[invoice.currency] ?? 0) + getInvoiceTotal(invoice)
    return groups
  }, {})

  return (
    <div className="dashboard-grid">
      <section className="dashboard-panel recent-panel">
        <div className="panel-heading">
          <div><h2>Recent invoices</h2><p>Your latest billing activity.</p></div>
          <button className="text-button" type="button" onClick={onOpenInvoices}>View all ↗</button>
        </div>
        {recentInvoices.length > 0 ? (
          <InvoiceTable
            invoices={recentInvoices}
            onMarkPaid={onMarkPaid}
            onMarkSent={onMarkSent}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreate={onCreate}
          />
        ) : (
          <div className="dashboard-empty">
            <span className="empty-icon">▤</span>
            <strong>Your dashboard is ready</strong>
            <p>Create an invoice and track its progress here.</p>
            <button className="secondary-button" onClick={onCreate}>＋ Create your first invoice</button>
          </div>
        )}
      </section>

      <aside className="dashboard-panel attention-panel">
        <div className="panel-heading">
          <div><h2>Needs attention</h2><p>Overdue invoices to follow up.</p></div>
          <span className="attention-count">{overdueInvoices.length}</span>
        </div>
        {overdueInvoices.length > 0 ? (
          <>
            <ul className="attention-list">
              {overdueInvoices.slice(0, 5).map((invoice) => (
                <li key={invoice.id}>
                  <span className="attention-avatar">{invoice.customerName.charAt(0).toUpperCase()}</span>
                  <span className="attention-customer">{invoice.customerName}<small>{invoice.invoiceNumber} · due {invoice.dueDate}</small></span>
                  <strong>{formatCurrency(getInvoiceTotal(invoice), invoice.currency)}</strong>
                </li>
              ))}
            </ul>
            <div className="attention-total">
              {Object.entries(outstanding).map(([currency, total]) => (
                <span key={currency}>{formatCurrency(total, currency)} <small>{currency} overdue</small></span>
              ))}
            </div>
          </>
        ) : (
          <div className="all-clear"><span>✓</span><strong>All caught up</strong><p>No overdue invoices right now.</p></div>
        )}
        <button className="secondary-button full-button" onClick={onOpenInvoices}>Review invoices</button>
      </aside>
    </div>
  )
}
