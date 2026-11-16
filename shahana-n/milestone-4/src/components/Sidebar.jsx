import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navigation = [
  { label: 'Dashboard', to: '/', icon: '⌂' },
  { label: 'My Library', to: '/library', icon: '▤' },
  { label: 'Continue Reading', to: '/continue', icon: '◷' },
  { label: 'Wishlist', to: '/wishlist', icon: '♡' },
  { label: 'Bookmarks', to: '/bookmarks', icon: '⚑' },
  { label: 'Favourites', to: '/favourites', icon: '☆' },
  { label: 'Reading Goals', to: '/goals', icon: '◎' },
];

export default function Sidebar({ open, onClose }) {
  const bookCount = useSelector((state) => state.books.items.length);
  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">r<span>.</span></div>
          <div className="brand-name">readtrack<span>YOUR READING LIFE</span></div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={onClose}>×</button>
        </div>
        <div className="side-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'My Library' && <span className="nav-count">{String(bookCount).padStart(2, '0')}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="quote-card">
            <span className="quote-mark">“</span>
            <p>A reader lives a thousand lives before he dies.</p>
            <span className="quote-by">— George R. R. Martin</span>
          </div>
          <div className="profile">
            <div className="avatar">R</div>
            <div><strong>Reader</strong><span>Personal space</span></div>
            <span className="profile-more">···</span>
          </div>
        </div>
      </aside>
    </>
  );
}
