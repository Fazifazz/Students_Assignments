import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar({ appointmentCount = 0 }) {
  const { user, logout } = useAuth()
  const dashboardPath = user?.role === 'doctor' ? '/doctor' : user?.role === 'admin' ? '/admin' : '/patient'

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="MediBook home">
          <span className="brand-mark" aria-hidden="true">+</span>
          <span>Medi<span>Book</span></span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/doctors">Find a doctor</NavLink>
          {user?.role === 'patient' && <NavLink to="/appointments">
            My appointments{appointmentCount > 0 && <span className="nav-count">{appointmentCount}</span>}
          </NavLink>}
          {user && <NavLink to={dashboardPath}>Dashboard</NavLink>}
          {user?.role === 'doctor' && <NavLink to="/doctor/appointments">My schedule</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/doctors">Manage</NavLink>}
        </div>
        {user
          ? <button className="button button-small nav-cta" type="button" onClick={logout}>Log out</button>
          : <Link className="button button-small nav-cta" to="/login">Sign in</Link>}
      </nav>
    </header>
  )
}
