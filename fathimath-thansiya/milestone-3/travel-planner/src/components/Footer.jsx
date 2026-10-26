import { Camera, Compass, MapPinned, Mail, Plane } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <div className="brand-mark">
              <Plane size={18} />
            </div>
            <span>Nomadica</span>
          </div>
          <p className="footer-copy">
            Crafted for curious travellers who want to explore beautifully and
            plan with confidence.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/destinations">Destinations</Link>
            </li>
            <li>
              <Link to="/trips">Upcoming trips</Link>
            </li>
            <li>
              <Link to="/favourites">Saved favourites</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Planner</h4>
          <ul>
            <li>
              <Link to="/trips/new">Create trip</Link>
            </li>
            <li>
              <Link to="/destinations">Budget ideas</Link>
            </li>
            <li>
              <Link to="/destinations">Travel guides</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Connect</h4>
          <ul className="meta-list">
            <li>
              <Compass size={15} /> Travel journal
            </li>
            <li>
              <MapPinned size={15} /> Global itineraries
            </li>
            <li>
              <Camera size={15} /> @nomadicatravel
            </li>
            <li>
              <Mail size={15} />
              hello@nomadica.travel
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Nomadica</span>
        <span>Designed for modern explorers</span>
      </div>
    </footer>
  );
}
