import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <NavLink to="/" className="brand">
            <img src="./src/assets/tastebite-logo.png" />
          </NavLink>
          <p>Discover something delicious every day.</p>
          <span>© 2026 Tastebite</span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
