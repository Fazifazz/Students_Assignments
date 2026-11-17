import { Link, useLocation } from 'react-router-dom';

const pageNames = {
  '/': 'Dashboard',
  '/library': 'My Library',
  '/continue': 'Continue Reading',
  '/wishlist': 'Wishlist',
  '/bookmarks': 'Bookmarks',
  '/favourites': 'Favourites',
  '/goals': 'Reading Goals',
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const dateLabel = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  const isForm = pathname === '/books/new' || pathname.endsWith('/edit');
  const isDetail = pathname.startsWith('/books/');
  const pageTitle = isForm ? (pathname.endsWith('/edit') ? 'Edit Book' : 'Add a Book') : isDetail ? 'Book Details' : pageNames[pathname] || 'ReadTrack';

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-button menu-button" aria-label="Open navigation" onClick={onMenuClick}>☰</button>
        <div>
          <span className="eyebrow">{dateLabel}</span>
          <h1>{pageTitle}</h1>
        </div>
      </div>
      <div className="topbar-actions">
        <button className="icon-button notification-button" aria-label="Notifications">♧<i /></button>
        <Link className="button button-primary header-add" to="/books/new"><span>＋</span> Add a book</Link>
      </div>
    </header>
  );
}
