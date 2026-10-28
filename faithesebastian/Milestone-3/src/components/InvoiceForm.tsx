import { useEffect, useState, type FormEvent } from 'react'
import type { CatalogProduct } from '../api/products'
import { ProductPicker } from './ProductPicker'
import { addInvoice, updateInvoice, type Invoice, type InvoiceItem, type InvoiceStatus } from '../features/invoices/invoiceSlice'
import { useProducts } from '../hooks/useProducts'
import { useAppDispatch } from '../hooks/reduxHooks'

type InvoiceFormProps = {
  onClose: () => void
  invoice?: Invoice
}

function toDateInputValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

const today = toDateInputValue(new Date())
const defaultDueDate = toDateInputValue(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))

export function InvoiceForm({ onClose, invoice }: InvoiceFormProps) {
  const dispatch = useAppDispatch()
  const [customerName, setCustomerName] = useState(invoice?.customerName ?? '')
  const [customerEmail, setCustomerEmail] = useState(invoice?.customerEmail ?? '')
  const [issueDate, setIssueDate] = useState(invoice?.issueDate ?? today)
  const [dueDate, setDueDate] = useState(invoice?.dueDate ?? defaultDueDate)
  const [taxPercent, setTaxPercent] = useState(String(invoice?.taxPercent ?? 0))
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items ?? [{ description: '', quantity: 1, rate: 0 }])
  const currency = invoice?.currency ?? 'INR'
  const [status, setStatus] = useState<InvoiceStatus>(invoice?.status === 'Overdue' ? 'Sent' : invoice?.status ?? 'Draft')
  const [error, setError] = useState<string | null>(null)
  const { products, usdToInrRate, rateDate, loading, error: catalogError, retry } = useProducts()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const updateItem = (index: number, change: Partial<InvoiceItem>) => {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...change } : item))
  }

  const addProduct = (product: CatalogProduct) => {
    setItems((current) => {
      const emptyRow = current.findIndex((item) => item.description.trim() === '' && item.rate === 0)
      if (emptyRow === -1) return [...current, { description: product.title, quantity: 1, rate: product.priceInr }]
      return current.map((item, index) =>
        index === emptyRow ? { description: product.title, quantity: 1, rate: product.priceInr } : item,
      )
    })
    setError(null)
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const tax = subtotal * (Number(taxPercent) / 100)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (customerName.trim() === '') {
      setError('Enter the customer name.')
      return
    }
    if (issueDate === '' || dueDate === '' || dueDate < issueDate) {
      setError('Choose a due date on or after the issue date.')
      return
    }
    if (!Number.isFinite(Number(taxPercent)) || Number(taxPercent) < 0 || Number(taxPercent) > 100) {
      setError('Tax must be between 0% and 100%.')
      return
    }
    if (items.length === 0 || items.some((item) => item.description.trim() === '' || item.quantity <= 0 || item.rate < 0 || !Number.isFinite(item.quantity) || !Number.isFinite(item.rate))) {
      setError('Add a description, positive quantity, and valid rate for every line item.')
      return
    }

    const details = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      issueDate,
      dueDate,
      currency,
      taxPercent: Number(taxPercent),
      items: items.map((item) => ({ ...item, description: item.description.trim() })),
      status,
    }
    if (invoice) {
      dispatch(updateInvoice({ ...details, id: invoice.id }))
    } else {
      dispatch(addInvoice(details))
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="invoice-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <header className="modal-header">
          <div><span className="section-kicker">{invoice ? 'UPDATE BILLING RECORD' : 'NEW BILLING RECORD'}</span><h2 id="form-title">{invoice ? `Edit ${invoice.invoiceNumber}` : 'Create invoice'}</h2><p>{invoice ? 'Update customer, payment, or line item details.' : 'Add customer and line item details.'}</p></div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        </header>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="form-field"><span>Customer name <b>*</b></span><input autoFocus value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="e.g. Alex Morgan" /></label>
            <label className="form-field"><span>Email address</span><input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="alex@example.com" /></label>
            <label className="form-field"><span>Issue date <b>*</b></span><input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} required /></label>
            <label className="form-field"><span>Due date <b>*</b></span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required /></label>
          </div>

          {currency === 'INR' ? (
            <ProductPicker
              products={products}
              usdToInrRate={usdToInrRate}
              rateDate={rateDate}
              loading={loading}
              error={catalogError}
              onRetry={retry}
              onSelect={addProduct}
            />
          ) : (
            <p className="legacy-currency-note">This saved USD invoice is kept unchanged. New invoices use INR; update this invoice's amounts manually if needed.</p>
          )}

          <div className="line-items-heading">
            <div><h3>Line items</h3><p>Amounts use the selected invoice currency.</p></div>
            <button className="text-button" type="button" onClick={() => setItems((current) => [...current, { description: '', quantity: 1, rate: 0 }])}>＋ Add item</button>
          </div>
          <div className="line-item-labels"><span>DESCRIPTION</span><span>QTY</span><span>RATE ({currency})</span><span>TOTAL</span><span /></div>
          <div className="line-item-list">
            {items.map((item, index) => (
              <div className="line-item-row" key={index}>
                <input value={item.description} onChange={(event) => updateItem(index, { description: event.target.value })} placeholder="Design work" aria-label={`Item ${index + 1} description`} />
                <input type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })} aria-label={`Item ${index + 1} quantity`} />
                <span className="rate-input-group">
                  <input type="number" min="0" step="0.01" value={item.rate || ''} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} placeholder="0.00" aria-label={`Item ${index + 1} rate`} />
                  {currency === 'INR' && item.rate > 0 && usdToInrRate !== null && usdToInrRate > 0 && (
                    <small>≈ {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.rate / usdToInrRate)}</small>
                  )}
                </span>
                <span className="line-total">{new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(item.quantity * item.rate)}</span>
                <button className="remove-line" type="button" disabled={items.length === 1} onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove item ${index + 1}`}>×</button>
              </div>
            ))}
          </div>

          <div className="invoice-totals">
            <div className="tax-currency-fields">
              <label className="tax-field"><span>Tax rate</span><span className="percent-input"><input type="number" min="0" max="100" step="0.1" value={taxPercent} onChange={(event) => setTaxPercent(event.target.value)} /><i>%</i></span></label>
              <div className="tax-field"><span>Currency</span><strong className="invoice-currency-label">{currency === 'INR' ? 'INR ₹' : 'USD $ · saved invoice'}</strong></div>
            </div>
            <div className="totals-list"><span>Subtotal <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(subtotal)}</strong></span><span>Tax <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(tax)}</strong></span><span className="grand-total">Total due <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(subtotal + tax)}</strong></span></div>
          </div>

          <div className="form-bottom">
            <label className="form-field status-field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as InvoiceStatus)}><option value="Draft">Draft</option><option value="Sent">Sent</option><option value="Paid">Paid</option></select></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{invoice ? 'Save changes' : 'Create invoice'} <span>↗</span></button></div>
          </div>
        </form>
      </section>
    </div>
  )
}
