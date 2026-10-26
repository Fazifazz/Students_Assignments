import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link className="logo footer-logo" to="/">
            Shop<span>Nest</span>
          </Link>
          <p>
            Your everyday destination for premium products, trending
            essentials, and great finds.
          </p>
          <div className="social-links" aria-label="Contact ShopNest">
            <Link to="/contact" aria-label="Contact ShopNest">
              <i className="bi bi-envelope" aria-hidden="true" />
            </Link>
            <Link to="/contact" aria-label="Send ShopNest a message">
              <i className="bi bi-chat-dots" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/products?category=Deals">Deals</Link></li>
            <li><Link to="/products?category=New%20Arrivals">New Arrivals</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Customer Care</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/cart">Your Cart</Link></li>
          </ul>
        </div>
        <div className="footer-column footer-newsletter">
          <h3>Stay Updated</h3>
          <p>Questions or feedback? Send our team a message.</p>
          <Link className="footer-contact-link" to="/contact">
            Contact ShopNest <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
