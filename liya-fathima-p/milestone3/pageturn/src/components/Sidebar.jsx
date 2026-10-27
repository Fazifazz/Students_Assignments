
import { NavLink, Link } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  BookMarked,
  Bookmark,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/library", label: "My Library", icon: Library },
  { to: "/reading", label: "Currently Reading", icon: BookOpen },
  { to: "/wishlist", label: "Want to Read", icon: Bookmark },
  { to: "/completed", label: "Completed", icon: CheckCircle2 },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  return (
    <>
      {open && (
        <button
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <BookMarked size={23} />
          </div>

          <div>
            <h2>PageTurn</h2>
            <span>YOUR PERSONAL LIBRARY</span>
          </div>

          <button
            className="mobile-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>
        </div>

        <p className="nav-label">MENU</p>

        <nav className="nav-links">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="reading-note">
            <BookOpen size={21} />
            <p>One chapter at a time, one journey at a time.</p>
          </div>

          <Link
            to="/add-book"
            onClick={onClose}
            className="button button-light sidebar-add"
          >
            <Plus size={17} />
            Add a Book
          </Link>
        </div>
      </aside>
    </>
  );
}
