import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { registerPatient, isAuthenticated, storageError } = useAuth()
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!/^\+?[\d\s().-]{7,20}$/.test(values.phone.trim()) || values.phone.replace(/\D/g, '').length < 7 || values.phone.replace(/\D/g, '').length > 15) nextErrors.phone = 'Enter a valid phone number.'
    if (values.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (values.confirmPassword !== values.password) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      const result = await registerPatient(values)
      if (!result.ok) {
        setErrors({ email: result.error })
        return
      }
      const next = searchParams.get('next')
      navigate(`/login?registered=1${next ? `&next=${encodeURIComponent(next)}` : ''}`)
    } catch (error) {
      console.error('Patient registration failed.', error)
      setErrors({ form: 'Could not create your demo account. Check browser storage and try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const field = (name, label, type = 'text', autoComplete) => (
    <label className="form-field" key={name}><span>{label}</span>
      <input type={type} autoComplete={autoComplete} value={values[name]} aria-invalid={Boolean(errors[name])} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))} />
      {errors[name] && <span className="field-error" role="alert">{errors[name]}</span>}
    </label>
  )

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-wide">
        <p className="eyebrow">YOUR CARE JOURNEY</p><h1>Create an account.</h1><p className="auth-intro">Register as a patient to manage demo bookings.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form-grid">
            {field('name', 'Full name', 'text', 'name')}
            {field('email', 'Email address', 'email', 'email')}
            {field('phone', 'Phone number', 'tel', 'tel')}
            {field('password', 'Password', 'password', 'new-password')}
            {field('confirmPassword', 'Confirm password', 'password', 'new-password')}
          </div>
          {(errors.form || storageError) && <p className="form-submit-error" role="alert">{errors.form || storageError}</p>}
          <button className="button submit-button" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create patient account'} <span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-switch">Already registered? <Link to={`/login${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next'))}` : ''}`}>Sign in</Link></p>
        <p className="auth-disclaimer">This demo stores account data only in this browser. Do not use a real password or sensitive health information.</p>
      </section>
    </main>
  )
}
