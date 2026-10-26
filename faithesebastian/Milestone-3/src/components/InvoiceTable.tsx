import type { Invoice } from '../features/invoices/invoiceSlice'
import { getEffectiveInvoiceStatus, getInvoiceTotal } from '../features/invoices/invoiceSlice'

type InvoiceTableProps = {
  invoices: Invoice[]
  onMarkPaid: (id: string) => void
  onMarkSent: (id: string) => void
  onEdit: (invoice: Invoice) => void
  onDelete: (id: string) => void
  onCreate: () => void
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

export function InvoiceTable({ invoices, onMarkPaid, onMarkSent, onEdit, onDelete, onCreate }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">▤</span>
        <h3>No invoices to show</h3>
        <p>Create your first invoice to start keeping track of billing.</p>
        <button className="secondary-button" onClick={onCreate}>＋ Create an invoice</button>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="invoice-table">
        <thead>
          <tr>
            <th scope="col">INVOICE</th>
            <th scope="col">CUSTOMER</th>
            <th scope="col">ISSUED</th>
            <th scope="col">DUE DATE</th>
            <th scope="col">AMOUNT</th>
            <th scope="col">STATUS</th>
            <th scope="col"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            const status = getEffectiveInvoiceStatus(invoice)
            return (
              <tr key={invoice.id}>
                <td><span className="invoice-number">{invoice.invoiceNumber}</span></td>
                <td>
                  <span className="customer-cell"><span className="customer-avatar">{invoice.customerName.charAt(0).toUpperCase()}</span><span>{invoice.customerName}<small>{invoice.customerEmail}</small></span></span>
                </td>
                <td>{formatDate(invoice.issueDate)}</td>
                <td>{formatDate(invoice.dueDate)}</td>
                <td className="amount-cell">{formatMoney(getInvoiceTotal(invoice), invoice.currency)}</td>
                <td><span className={`status-pill ${status.toLowerCase()}`}><i />{status}</span></td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => onEdit(invoice)} aria-label={`Edit ${invoice.invoiceNumber}`} title="Edit invoice">Edit</button>
                    {status === 'Draft' && <button onClick={() => onMarkSent(invoice.id)} aria-label={`Mark ${invoice.invoiceNumber} as sent`} title="Mark as sent">Send</button>}
                    {(status === 'Sent' || status === 'Overdue') && <button onClick={() => onMarkPaid(invoice.id)} aria-label={`Mark ${invoice.invoiceNumber} as paid`} title="Mark as paid">Paid</button>}
                    <button className="delete-action" onClick={() => onDelete(invoice.id)} aria-label={`Delete ${invoice.invoiceNumber}`} title="Delete invoice">×</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
