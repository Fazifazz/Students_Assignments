import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '▦', end: true },
  { to: '/books', label: 'All books', icon: '▤' }
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="BookVault home">
          <span className="brand-mark">B</span>
          <span>book<span className="brand-light">vault</span></span>
        </NavLink>

        <div className="nav-caption">LIBRARY</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="note-icon">✦</span>
          <strong>A little more reading</strong>
          <p>Every book opens a new world. Keep your collection growing.</p>
        </div>

        <div className="sidebar-footer">
          <span className="online-dot" />
          Your library is online
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>BookVault</span>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current">{getPageLabel(location.pathname)}</span>
          </div>
          <NavLink className="button button-primary topbar-action" to="/books/new">
            <span aria-hidden="true">＋</span> Add a book
          </NavLink>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function getPageLabel(pathname) {
  if (pathname === '/') return 'Dashboard';
  if (pathname === '/books/new') return 'Add a book';
  if (pathname.endsWith('/edit')) return 'Edit book';
  if (/^\/books\/[^/]+$/.test(pathname)) return 'Book details';
  if (pathname.startsWith('/books')) return 'All books';
  return 'Page not found';
}
