function Features() {
  return (
    <section id="features">
      <div className="container">
        <div className="row g-4 row-cols-1 row-cols-lg-3">

          <div className="feature col text-center">
            <div className="feature-icon">
              <i className="bi bi-truck"></i>
            </div>
            <h3>Free Shipping</h3>
            <p>On orders above ₹500</p>
          </div>

          <div className="feature col text-center">
            <div className="feature-icon">
              <i className="bi bi-arrow-return-left"></i>
            </div>
            <h3>Easy Return</h3>
            <p>Easy return policy</p>
          </div>

          <div className="feature col text-center">
            <div className="feature-icon">
              <i className="bi bi-shield-lock"></i>
            </div>
            <h3>Secure Payment</h3>
            <p>100% secure payment</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Features;