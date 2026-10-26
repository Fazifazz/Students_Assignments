import { useEffect, useState, type FormEvent } from 'react'

type CustomerEditFormProps = {
  customer: {
    name: string
    email: string
  }
  onClose: () => void
  onSave: (name: string, email: string) => void
}

export function CustomerEditForm({ customer, onClose, onSave }: CustomerEditFormProps) {
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    if (!normalizedName) {
      setError('Customer name is required.')
      return
    }
    onSave(normalizedName, email.trim())
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="invoice-modal customer-modal" role="dialog" aria-modal="true" aria-labelledby="customer-form-title">
        <header className="modal-header">
          <div><span className="section-kicker">CUSTOMER DETAILS</span><h2 id="customer-form-title">Edit customer</h2><p>Changes update this customer across their invoices.</p></div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        </header>
        <form onSubmit={submit}>
          <label className="form-field customer-edit-field">
            <span>Customer name <b>*</b></span>
            <input autoFocus value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="form-field customer-edit-field">
            <span>Email address</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="customer@example.com" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions customer-edit-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit">Save customer <span>↗</span></button>
          </div>
        </form>
      </section>
    </div>
  )
}
