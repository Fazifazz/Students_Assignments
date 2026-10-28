import type { Invoice } from '../features/invoices/invoiceSlice'
import { getEffectiveInvoiceStatus, getInvoiceTotal } from '../features/invoices/invoiceSlice'

type SummaryCardsProps = {
  invoices: Invoice[]
}

function formatCurrencyTotals(invoices: Invoice[]) {
  const totals = invoices.reduce<Record<string, number>>((groups, invoice) => {
    groups[invoice.currency] = (groups[invoice.currency] ?? 0) + getInvoiceTotal(invoice)
    return groups
  }, {})

  const formatted = Object.entries(totals).map(([currency, amount]) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount),
  )
  return formatted.length > 0
    ? formatted.join(' · ')
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(0)
}

export function SummaryCards({ invoices }: SummaryCardsProps) {
  const paid = invoices.filter((invoice) => getEffectiveInvoiceStatus(invoice) === 'Paid')
  const outstanding = invoices.filter((invoice) => ['Sent', 'Overdue'].includes(getEffectiveInvoiceStatus(invoice)))
  const overdue = invoices.filter((invoice) => getEffectiveInvoiceStatus(invoice) === 'Overdue')
  const metrics = [
    { label: 'Total collected', value: formatCurrencyTotals(paid), note: `${paid.length} paid invoice${paid.length === 1 ? '' : 's'}`, icon: '↗', tone: 'green' },
    { label: 'Outstanding', value: formatCurrencyTotals(outstanding), note: `${outstanding.length} awaiting payment`, icon: '◷', tone: 'blue' },
    { label: 'Overdue', value: formatCurrencyTotals(overdue), note: `${overdue.length} need attention`, icon: '!', tone: 'amber' },
    { label: 'Invoices created', value: String(invoices.length), note: 'All time', icon: '▤', tone: 'purple' },
  ]

  return (
    <section className="summary-grid" aria-label="Invoice summary">
      {metrics.map((metric) => (
        <article className="summary-card" key={metric.label}>
          <div className="summary-top"><span>{metric.label}</span><span className={`summary-icon ${metric.tone}`}>{metric.icon}</span></div>
          <strong className={`summary-value${metric.label !== 'Invoices created' ? ' currency-totals' : ''}`}>{metric.value}</strong>
          <span className="summary-note">{metric.note}</span>
        </article>
      ))}
    </section>
  )
}
