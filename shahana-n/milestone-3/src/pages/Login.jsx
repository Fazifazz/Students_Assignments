import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { demoCredentials } from '../data/demoUsers.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, isAuthenticated, storageError } = useAuth()
  const [values, setValues] = useState({ email: '', password: '', role: 'patient' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const requestedPath = searchParams.get('next')
  const safeNext = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') && !requestedPath.includes('://')

  if (isAuthenticated) return <Navigate to={safeNext ? requestedPath : '/dashboard'} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!values.email.trim() || !values.password) {
      setError('Enter your email and password.')
      return
    }
    setSubmitting(true)
    try {
      const result = await login(values.email, values.password, values.role)
      if (!result.ok) {
        setError(result.error)
        return
      }
      navigate(safeNext ? requestedPath : values.role === 'patient' ? '/patient' : `/${values.role}`, { replace: true })
    } catch (submitError) {
      console.error('Demo login failed.', submitError)
      setError('Unable to sign in right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in to MediBook.</h1>
        <p className="auth-intro">Choose your demo account type and continue.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field"><span>Account type</span>
            <select value={values.role} onChange={(event) => setValues((current) => ({ ...current, role: event.target.value, email: '' }))}>
              <option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option>
            </select>
          </label>
          <label className="form-field"><span>Email address</span>
            <input type="email" autoComplete="username" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <label className="form-field"><span>Password</span>
            <div className="password-control"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={values.password} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} /><button className="text-button" type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Hide' : 'Show'}</button></div>
          </label>
          {searchParams.get('registered') === '1' && <p className="success-banner" role="status">Your patient account was created. Sign in to continue.</p>}
          {(error || storageError) && <p className="form-submit-error" role="alert">{error || storageError}</p>}
          <button className="button submit-button" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span></button>
        </form>
        {values.role === 'patient' ? <p className="auth-switch">New to MediBook? <Link to={`/register${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next'))}` : ''}`}>Create a patient account</Link></p> : (
          <div className="demo-credential-note"><strong>Demo credentials</strong><br />{values.role === 'doctor' ? 'Any fictional doctor email (for example, sarah@medibook.demo)' : `Email: ${demoCredentials[values.role].email}`}<br />Password: {demoCredentials[values.role].password}</div>
        )}
        <p className="auth-disclaimer">Demo-only authentication. Browser role checks are not secure and do not replace server authorization.</p>
      </section>
    </main>
  )
}
