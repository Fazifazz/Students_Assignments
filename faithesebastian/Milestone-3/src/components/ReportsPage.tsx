import { useMemo } from 'react'
import type { Invoice, InvoiceStatus } from '../features/invoices/invoiceSlice'
import { getEffectiveInvoiceStatus, getInvoiceTotal } from '../features/invoices/invoiceSlice'

type ReportsPageProps = {
  invoices: Invoice[]
}

const statuses: InvoiceStatus[] = ['Paid', 'Sent', 'Overdue', 'Draft']

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function ReportsPage({ invoices }: ReportsPageProps) {
  const report = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date()
      date.setDate(1)
      date.setMonth(date.getMonth() - (5 - index))
      return {
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: new Intl.DateTimeFormat(undefined, { month: 'short' }).format(date),
      }
    })
    const currencies = [...new Set(invoices.map((invoice) => invoice.currency))].sort()
    const monthly = currencies.map((currency) => {
      const values = months.map((month) => invoices
        .filter((invoice) => invoice.currency === currency && invoice.issueDate.startsWith(month.key))
        .reduce((sum, invoice) => sum + getInvoiceTotal(invoice), 0))
      return { currency, values, max: Math.max(...values, 1) }
    })
    const byStatus = statuses.map((status) => {
      const matching = invoices.filter((invoice) => getEffectiveInvoiceStatus(invoice) === status)
      return {
        status,
        count: matching.length,
        currencies: matching.reduce<Record<string, number>>((totals, invoice) => {
          totals[invoice.currency] = (totals[invoice.currency] ?? 0) + getInvoiceTotal(invoice)
          return totals
        }, {}),
      }
    })
    return { months, monthly, byStatus }
  }, [invoices])

  return (
    <>
      <section className="report-toolbar">
        <div><span>REPORTING PERIOD</span><strong>Last 6 months</strong></div>
        <button className="secondary-button" onClick={() => window.print()}><span>⎙</span> Print reports</button>
      </section>

      <section className="report-panel" aria-labelledby="monthly-report">
        <div className="panel-heading"><div><h2 id="monthly-report">Invoice volume</h2><p>Invoice totals by issue month. Currencies are shown separately.</p></div><span className="report-legend"><i /> Invoiced</span></div>
        {report.monthly.length ? (
          <div className="monthly-reports">
            {report.monthly.map(({ currency, values, max }) => (
              <div className="monthly-currency" key={currency}>
                <h3>{currency}</h3>
                <div className="chart">
                  {report.months.map((month, index) => {
                    const value = values[index]
                    const height = value > 0 ? Math.max(5, (value / max) * 100) : 0
                    return (
                      <div className="chart-column" key={month.key} title={`${month.label}: ${formatCurrency(value, currency)}`}>
                        <span className="chart-value">{value > 0 ? formatCurrency(value, currency) : ''}</span>
                        <div className="chart-track"><i style={{ height: `${height}%` }} /></div>
                        <span className="chart-month">{month.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            {report.monthly.length === 0 && <p className="report-empty">Invoice totals will appear here when you create invoices.</p>}
          </div>
        ) : (
          <div className="report-empty"><span className="empty-icon">▥</span><strong>No invoice data yet</strong><p>Create invoices to see monthly billing activity.</p></div>
        )}
      </section>

      <section className="report-panel status-report" aria-labelledby="status-report">
        <div className="panel-heading"><div><h2 id="status-report">Invoice status</h2><p>Current payment progress across all invoices.</p></div><span className="status-total">{invoices.length} total</span></div>
        {invoices.length > 0 ? (
          <div className="status-report-list">
            {report.byStatus.map(({ status, count, currencies }) => {
              const percentage = (count / invoices.length) * 100
              return (
                <div className="status-report-row" key={status}>
                  <div className="status-report-label"><span className={`status-pill ${status.toLowerCase()}`}><i />{status}</span><strong>{count}</strong></div>
                  <div className="status-progress"><i className={status.toLowerCase()} style={{ width: `${percentage}%` }} /></div>
                  <div className="status-report-amount">{Object.keys(currencies).length ? Object.entries(currencies).map(([currency, total]) => formatCurrency(total, currency)).join(' · ') : '—'}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="report-empty"><p>Status breakdown appears when invoices are added.</p></div>
        )}
      </section>
    </>
  )
}
