import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Footer() {
  const { user } = useAuth()
  const appointmentsPath = user?.role === 'patient'
    ? ['/appointments', 'My appointments']
    : user?.role === 'doctor'
      ? ['/doctor/appointments', 'My schedule']
      : user?.role === 'admin'
        ? ['/admin/appointments', 'Manage appointments']
        : ['/login', 'Patient sign in']

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark" aria-hidden="true">+</span>
            <span>Medi<span>Book</span></span>
          </Link>
          <p>Thoughtful care, made easier to find.</p>
        </div>
        <div className="footer-links">
          <Link to="/doctors">Find a doctor</Link>
          <Link to={appointmentsPath[0]}>{appointmentsPath[1]}</Link>
          <a href="mailto:hello@medibook.example">hello@medibook.example</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} MediBook. A frontend demo.</span>
        <span>Fictional doctors · No real medical services</span>
      </div>
    </footer>
  )
}
