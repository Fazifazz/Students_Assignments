import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink className="brand" to="/" aria-label="FitTrack Lite home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M6 8v8M3.5 10v4M18 8v8m2.5-6v4M6 12h12" />
            </svg>
          </span>
          <span className="brand-name">FitTrack <span>Lite</span></span>
        </NavLink>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end>Overview</NavLink>
          <NavLink to="/workouts">Workouts</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
        <NavLink className="nav-cta" to="/workouts">
          <span aria-hidden="true">+</span> Add workout
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;
