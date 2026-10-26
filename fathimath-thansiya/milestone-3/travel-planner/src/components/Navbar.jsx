import { Menu, Plane, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/destinations", label: "Explore" },
    { to: "/trips", label: "My Trips" },
    { to: "/favourites", label: "Favourites" },
  ];

  const handlePrimaryAction = () => {
    navigate("/destinations");
    setIsOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link to="/" className="brand" aria-label="Nomadica home">
          <div className="brand-mark">
            <Plane size={18} />
          </div>
          <span>Nomadica</span>
        </Link>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => navigate("/destinations")}
          >
            <Search size={16} />
            <span>Discover</span>
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={handlePrimaryAction}
          >
            Plan a trip
          </button>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
