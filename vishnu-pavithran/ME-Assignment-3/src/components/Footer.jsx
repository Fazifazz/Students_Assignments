import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="about" className="site-footer pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          <section className="col-sm-6 col-lg-3">
            <h2 id="footer-about-title" className="h5">
              About
            </h2>
            <p className="text-white-50">
              3rd Floor, Prestige Towers, <br />
              Brigade Road, Ashok Nagar,
              <br />
              Bengaluru, Karnataka, India.
              <br />
            </p>
          </section>
          <section className="col-sm-6 col-lg-3">
            <h2 id="footer-links-title" className="h5">
              Quick Links
            </h2>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Shop</Link>
              </li>
              <li>
                <Link to="/#categories">Categories</Link>
              </li>
              <li>
                <Link to="/#deals">Deals</Link>
              </li>
            </ul>
          </section>
          <section className="col-sm-6 col-lg-3">
            <h2 id="footer-contact-title" className="h5">
              Contact
            </h2>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>email@shopnest.com
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>+91 1234567890
              </li>
            </ul>
          </section>
          <section className="col-sm-6 col-lg-3">
            <h2 id="footer-social-title" className="h5">
              Social Media
            </h2>
            <div className="social-links d-flex gap-3">
              <a href="#facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#x">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#pinterest">
                <i className="bi bi-pinterest"></i>
              </a>
            </div>
          </section>
        </div>
        <hr className="border-secondary my-4" />
        <p className="small text-white-50 mb-0 text-center">
          &copy; 2026 ShopNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
