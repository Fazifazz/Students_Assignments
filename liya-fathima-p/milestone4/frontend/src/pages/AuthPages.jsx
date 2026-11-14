import { Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth, userRole } from '../context/AuthContext.jsx'
import { getErrorMessage } from '../services/api.js'
import { Notice } from '../components/Shared.jsx'

const currentYear = new Date().getFullYear()

function AuthFrame({ children }) {
  return <main className="auth-page"><section className="auth-aside"><Link to="/" className="brand auth-brand"><span className="brand-mark"><ShieldCheck size={20} /></span><span>resolve<span className="brand-accent">it</span><small>ISSUE TRACKING</small></span></Link>
    <div className="auth-aside-copy"><span className="eyebrow eyebrow-light">YOUR VOICE MATTERS</span><h2>Real issues.<br /><em>Real follow-through.</em></h2><p>Track every concern from the moment you report it to the moment it’s resolved.</p><div className="auth-aside-stats"><span><strong>One place</strong> for every update</span><span><strong>One clear path</strong> to resolution</span></div></div>
    <div className="auth-aside-footer">© {currentYear} ResolveIt</div></section>
    <section className="auth-main"><Link to="/" className="back-home"><ArrowLeft size={15} /> Back to home</Link><div className="auth-card"><div className="auth-mobile-brand"><ShieldCheck size={20} /> resolveit</div>{children}</div>
      <p className="auth-legal">By continuing, you agree to use ResolveIt respectfully and responsibly.</p></section></main>
}

export function Login() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (!loading && user) return <Navigate to={userRole(user) === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError('Enter a valid email address.')
    if (!values.password) return setError('Enter your password.')
    setBusy(true)
    try {
      const signedInUser = await login({ email: values.email.trim(), password: values.password })
      navigate(userRole(signedInUser) === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to log in. Please check your details.'))
    } finally { setBusy(false) }
  }
  return <AuthFrame><div className="auth-intro"><span className="eyebrow">WELCOME BACK</span><h1>Good to see you.</h1><p>Your workspace is assigned automatically based on your account role.</p></div>
    <Notice>{error}</Notice><form className="form-stack" onSubmit={submit} noValidate>
      <label className="field"><span>Email address</span><input type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /></label>
      <label className="field"><span>Password</span><span className="password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
      <button className="button button-primary button-full" disabled={busy}>{busy ? <span className="spinner spinner-small" /> : <>Sign in <ArrowRight size={16} /></>}</button>
    </form><p className="auth-switch">New to ResolveIt? <Link to="/register">Create an account</Link></p>
  </AuthFrame>
}

export function Register() {
  const { user, loading, register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (!loading && user) return <Navigate to={userRole(user) === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (values.name.trim().length < 2) return setError('Enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError('Enter a valid email address.')
    if (values.password.length < 8) return setError('Your password must be at least 8 characters.')
    if (values.password !== values.confirmPassword) return setError('Your passwords don’t match.')
    setBusy(true)
    try {
      const signedInUser = await register({ name: values.name.trim(), email: values.email.trim(), password: values.password })
      navigate(userRole(signedInUser) === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to create your account. Please try again.'))
    } finally { setBusy(false) }
  }
  return <AuthFrame><div className="auth-intro"><span className="eyebrow">GET STARTED</span><h1>Make your voice count.</h1><p>Create a resident account. Administrator access is provisioned separately.</p></div>
    <Notice>{error}</Notice><form className="form-stack" onSubmit={submit} noValidate>
      <label className="field"><span>Full name</span><input autoComplete="name" placeholder="Your name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} required /></label>
      <label className="field"><span>Email address</span><input type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /></label>
      <label className="field"><span>Password</span><span className="password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
      <label className="field"><span>Confirm password</span><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Enter your password again" value={values.confirmPassword} onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })} required /></label>
      <button className="button button-primary button-full" disabled={busy}>{busy ? <span className="spinner spinner-small" /> : <>Create account <ArrowRight size={16} /></>}</button>
    </form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </AuthFrame>
}
