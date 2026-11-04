function Newsletter() {
  return (
    <section className="newsletter">
      <div className="container newsletter-container">

        <div className="section-heading">
          <h2>
            Join Our Newsletter{" "}
            <span className="head-span">To Stay Up</span>
          </h2>
        </div>

        <div className="newsletter-input-box">
          <input
            type="email"
            placeholder="Enter Your Email"
            aria-label="Email address"
          />

          <button type="button" className="btn">
            Subscribe
          </button>
        </div>

        <p>
          Your privacy matters. We safeguard your information
          for a secure and confidential experience.
        </p>

      </div>
    </section>
  );
}

export default Newsletter;