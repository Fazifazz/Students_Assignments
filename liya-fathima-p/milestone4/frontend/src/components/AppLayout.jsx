import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, ChevronDown, ClipboardList, LayoutDashboard, LogOut, Menu, Plus,
  ShieldCheck, Users, Building2, BarChart3, CircleHelp,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const currentYear = new Date().getFullYear()

const userLinks = [
  { to: '/user/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/user/complaints', label: 'My complaints', icon: ClipboardList },
  { to: '/user/submit-complaint', label: 'Submit a complaint', icon: Plus },
  { to: '/user/notifications', label: 'Notifications', icon: Bell },
]
const adminLinks = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/complaints', label: 'Complaints', icon: ClipboardList },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

export default function AppLayout({ role }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const admin = role === 'admin'
  const links = admin ? adminLinks : userLinks
  const title = links.find((link) => location.pathname === link.to)?.label || (location.pathname.includes('/complaints/') ? 'Complaint details' : 'ResolveIt')
  const initials = (user?.name || user?.email || 'R').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  return (
    <div className="app-shell">
      {menuOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <NavLink to={admin ? '/admin/dashboard' : '/user/dashboard'} className="brand">
          <span className="brand-mark"><ShieldCheck size={20} /></span>
          <span>resolve<span className="brand-accent">it</span><small>ISSUE TRACKING</small></span>
        </NavLink>
        <div className="sidebar-label">{admin ? 'WORKSPACE' : 'YOUR SPACE'}</div>
        <nav className="side-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to.endsWith('dashboard')} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><CircleHelp size={18} /><div><strong>Need a hand?</strong><span>We’re here to help.</span></div></div>
          <button className="profile-link" onClick={() => navigate(admin ? '/admin/dashboard' : '/user/profile')}>
            <span className="avatar">{initials}</span>
            <span className="profile-copy"><strong>{user?.name || 'ResolveIt member'}</strong><small>{admin ? 'Administrator' : 'Resident'}</small></span>
            <ChevronDown size={16} />
          </button>
          <button className="signout-link" onClick={() => logout()}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>{admin ? 'Admin workspace' : 'My workspace'}</span><b>/</b><strong>{title}</strong></div>
          <div className="topbar-actions">
            {!admin && <button className="icon-button" aria-label="Notifications" onClick={() => navigate('/user/notifications')}><Bell size={19} /></button>}
            <span className="topbar-divider" />
            <div className="top-user"><span className="avatar avatar-small">{initials}</span><span>{user?.name || 'Account'}</span><ChevronDown size={14} /></div>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
        <footer className="app-footer">© {currentYear} ResolveIt <span>•</span> Better communities, together.</footer>
      </div>
    </div>
  )
}
