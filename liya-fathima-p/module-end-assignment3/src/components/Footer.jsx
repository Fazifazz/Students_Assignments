function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="container">

        <div className="row py-5">

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <h4>ShopNest</h4>
            <p>
              Discover your favorite products and enjoy a simple,
              convenient shopping experience.
            </p>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#hero-section">Home</a></li>
              <li><a href="#products-section">Products</a></li>
              <li><a href="#categories-section">Categories</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <h5>Contact</h5>
            <p><i className="bi bi-envelope"></i> support@shopnest.com</p>
            <p><i className="bi bi-telephone"></i> +91 12345 67890</p>
            <p><i className="bi bi-geo-alt"></i> Kerala, India</p>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <h5>Follow Us</h5>
            <div className="social-links">
              <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

        </div>

        <div className="row border-top pt-3">
          <div className="col text-center">
            <p>© 2026 ShopNest. All Rights Reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;