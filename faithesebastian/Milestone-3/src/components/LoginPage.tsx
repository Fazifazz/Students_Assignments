import { useState, type FormEvent } from 'react'
import { clearAuthError, loginAttempt } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ThemeToggle } from './ThemeToggle'

type LoginPageProps = {
  isDark: boolean
  onToggleTheme: () => void
  themeStorageError: string | null
}

export function LoginPage({ isDark, onToggleTheme, themeStorageError }: LoginPageProps) {
  const dispatch = useAppDispatch()
  const authError = useAppSelector((state) => state.auth.error)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(loginAttempt({ username, password }))
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <a className="login-brand" href="#" aria-label="Ledgerly home">
          <span className="brand-symbol">L</span>
          <span>ledgerly<span className="brand-dot">.</span></span>
        </a>
        <div className="login-brand-copy">
          <span className="login-eyebrow"><i /> YOUR BUSINESS, IN BALANCE</span>
          <h1>Good work<br />deserves <em>great books.</em></h1>
          <p>One calm place to manage invoices, customers, and the little details that keep business moving.</p>
        </div>
        <div className="login-quote">
          <span>“</span>
          <p>Simple tools make room for your best work.</p>
          <small>LEDGERLY · BILLING, MADE SIMPLER</small>
        </div>
        <div className="login-orb login-orb-one" />
        <div className="login-orb login-orb-two" />
      </section>

      <section className="login-form-panel">
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        <div className="login-form-wrap">
          <div className="mobile-login-brand">
            <span className="brand-symbol">L</span><span>ledgerly<span className="brand-dot">.</span></span>
          </div>
          <div className="login-heading">
            <span className="section-kicker">WELCOME BACK</span>
            <h2>Sign in to your workspace</h2>
            <p>Enter your details to continue to Ledgerly.</p>
          </div>
          <form className="login-form" onSubmit={submit}>
            <label className="login-field">
              <span>Username</span>
              <span className="login-input-wrap"><span aria-hidden="true">♙</span><input autoComplete="username" autoFocus value={username} onChange={(event) => { setUsername(event.target.value); if (authError) dispatch(clearAuthError()) }} placeholder="Enter your username" required /></span>
            </label>
            <label className="login-field">
              <span>Password</span>
              <span className="login-input-wrap"><span aria-hidden="true">▣</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); if (authError) dispatch(clearAuthError()) }} placeholder="Enter your password" required /></span>
            </label>
            {authError && <p className="login-error" role="alert">{authError}</p>}
            <button className="login-submit" type="submit">Sign in <span aria-hidden="true">↗</span></button>
          </form>
          <div className="demo-credentials">
            <span>DEMO ACCESS</span>
            <p>Username <strong>faith</strong><i /> Password <strong>123</strong></p>
          </div>
          <p className="login-disclaimer">Demo sign-in only. This does not provide production authentication or protect billing data.</p>
          {themeStorageError && <p className="theme-storage-error" role="alert">{themeStorageError}</p>}
        </div>
        <footer className="login-footer"><span>© {new Date().getFullYear()} Ledgerly</span><span>Made for independent work.</span></footer>
      </section>
    </main>
  )
}
