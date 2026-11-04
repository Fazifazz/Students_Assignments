function Hero() {
  return (
    <section id="hero-section">
      <div className="hero-shape" aria-hidden="true"></div>

      <div className="container col-xxl-10 px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">

          <div className="col-md-6">
            <div className="hero-media">
              <div className="hero-media__backdrop" aria-hidden="true"></div>

              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85"
                className="hero-media__img"
                alt="Fashion model wearing a stylish outfit"
              />

              <div className="hero-tag" aria-hidden="true">
                <span className="hero-tag__line1">New</span>
                <span className="hero-tag__line2">Drop</span>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <aside className="hero-aside">
              <span>NEW ARRIVAL</span>
              <p>Fresh styles just landed</p>
            </aside>

            <h1 className="hero-title">
              Find Your<br />Perfect Look
            </h1>

            <p className="hero-lead">
              Trendy styles, everyday essentials, and everything in between.
            </p>

            <div className="hero-actions">
              <a href="#products-section" className="btn-hero btn-hero--primary">
                Shop Now
              </a>

              <a href="#categories-section" className="btn-hero btn-hero--ghost">
                View Categories
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;