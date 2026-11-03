import "../App.css";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner3.png";
import ProductGrid from "../components/ProductGrid";
import useProducts from "../hooks/useProducts";

function HomePage() {
  const { data: products, loading, error, retry } = useProducts();
  const featuredProducts = useMemo(() => {
    const hasFeaturedField = products.some((product) =>
      Object.prototype.hasOwnProperty.call(product, "featured"),
    );

    if (hasFeaturedField) {
      return products.filter(
        (product) =>
          product.featured === true ||
          product.featured === 1 ||
          product.featured === "true",
      );
    }

    return products.slice(6, 12);
  }, [products]);

  return (
    <main>
      {/* Hero Carousel section */}
      <section id="home">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={banner1} className="d-block" alt="..." />
              <div className="carousel-caption hero-slide-content text-start">
                <h2 className="display-3 fw-bold">Everything you need</h2>
                <p className="lead mb-4">
                  Electroics, Clothing, Footwear, Books and more.
                </p>
                <div className="hero-actions d-flex flex-wrap-md gap-3">
                  <Link className="btn btn-primary btn-lg" to="/products">
                    Shop Now
                  </Link>
                  <Link className="btn btn-outline-light btn-lg" to="/#deals">
                    View Deals
                  </Link>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src={banner2} className="d-block" alt="..." />
              <div className="carousel-caption hero-slide-content text-start">
                <h2 className="display-3 fw-bold">Big Deals, Better Prices</h2>
                <p className="lead mb-4">
                  Save more on your favorite products with ShopNest.
                </p>
                <div className="hero-actions d-flex flex-wrap-md gap-3">
                  <Link className="btn btn-primary btn-lg" to="/products">
                    Shop Now
                  </Link>
                  <Link className="btn btn-outline-light btn-lg" to="/#deals">
                    View Deals
                  </Link>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src={banner3} className="d-block" alt="..." />
              <div className="carousel-caption hero-slide-content text-start">
                <h2 className="display-3 fw-bold">Discover your style</h2>
                <p className="lead mb-4">
                  Explore the latest products at exclusive prices.
                </p>
                <div className="hero-actions d-flex flex-wrap-md gap-3">
                  <Link className="btn btn-primary btn-lg" to="/products">
                    Shop Now
                  </Link>
                  <Link className="btn btn-outline-light btn-lg" to="/#deals">
                    View Deals
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="py-5">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            {/* Heading */}
            <div>
              <p className="section-eyebrow mb-1">Handpicked for you</p>
              <h2 id="featured-title" className="section-title mb-0">
                Featured Products
              </h2>
            </div>

            {/* Search */}
          </div>
          <section id="cart-section" className="cart-overlay">
            <div className="cart-container py-5">
              <div className="cart-header">
                <h2 className="section-title mb-4">Shopping Cart</h2>
                <span className="cart-close">
                  {" "}
                  <img src="images/close.png" />
                </span>
              </div>

              <div id="cart-list"></div>

              <div className="cart-summary text-end mt-4">
                <h4>
                  Total:
                  <strong id="cart-total">₹0</strong>
                </h4>
              </div>
            </div>
          </section>
          {loading ? (
            <div className="d-flex align-items-center gap-3 py-4" role="status">
              <span
                className="spinner-border text-primary"
                aria-hidden="true"
              ></span>
              <span>Loading featured products...</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              <p className="mb-3">{error}</p>
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={retry}
              >
                Retry
              </button>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
          {/* <div className="row g-4">
            <article className="col-sm-6 col-lg-4">
              <div className="card product-card h-100">
                <img
                  src="images/electronics.jpg"
                  className="card-img-top"
                  alt="Black wireless headphones"
                />
                <div className="card-body d-flex flex-column">
                  <p className="small text-muted mb-1">Electronics</p>
                  <h3 className="h5 card-title">Wireless Headphones</h3>
                  <p className="rating mb-2">
                    <i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-half"></i>
                    <span className="text-muted small">(1288)</span>
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-between"
                  >
                    <p className="mb-0">
                      <span className="old-price text-muted">899</span>
                      <strong className="text-primary">599</strong>
                    </p>
                    <button
                      className="btn btn-outline-primary mt-auto"
                      type="button"
                    >
                      <i className="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="col-sm-6 col-lg-4">
              <div className="card product-card h-100">
                <img
                  src="images/cloth.jpg"
                  className="card-img-top"
                  alt="Folded white cotton t-shirt"
                />
                <div className="card-body d-flex flex-column">
                  <p className="small text-muted mb-1">Clothing</p>
                  <h3 className="h5 card-title">Classic Cotton T-Shirt</h3>
                  <p className="rating mb-2" aria-label="4 out of 5 stars">
                    <i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i><i className="bi bi-star"></i>
                    <span className="text-muted small">(1186)</span>
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-between"
                  >
                    <p className="mb-0">
                      <span className="old-price text-muted">799</span
                      ><strong className="text-primary">499</strong>
                    </p>
                    <button
                      className="btn btn-outline-primary mt-auto"
                      type="button"
                    >
                      <i className="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="col-sm-6 col-lg-4">
              <div className="card product-card h-100">
                <img
                  src="images/footware.jpg"
                  className="card-img-top"
                  alt="Red running shoe"
                />
                <div className="card-body d-flex flex-column">
                  <p className="small text-muted mb-1">Footwear</p>
                  <h3 className="h5 card-title">Everyday Running Shoes</h3>
                  <p className="rating mb-2" aria-label="5 out of 5 stars">
                    <i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i>
                    <span className="text-muted small">(2214)</span>
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-between"
                  >
                    <p className="mb-0">
                      <span className="old-price text-muted">3999</span
                      ><strong className="text-primary">1999</strong>
                    </p>
                    <button
                      className="btn btn-outline-primary mt-auto"
                      type="button"
                    >
                      <i className="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="col-sm-6 col-lg-4">
              <div className="card product-card h-100">
                <img
                  src="images/books.jpg"
                  className="card-img-top"
                  alt="Book on a table"
                />
                <div className="card-body d-flex flex-column">
                  <p className="small text-muted mb-1">Books</p>
                  <h3 className="h5 card-title">The Creative Mind</h3>
                  <p className="rating mb-2" aria-label="4.5 out of 5 stars">
                    <i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-half"></i>
                    <span className="text-muted small">(504)</span>
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-between"
                  >
                    <p className="mb-0">
                      <span className="old-price text-muted">499</span
                      ><strong className="text-primary">399</strong>
                    </p>
                    <button
                      className="btn btn-outline-primary mt-auto"
                      type="button"
                    >
                      <i className="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="col-sm-6 col-lg-4">
              <div className="card product-card h-100">
                <img
                  src="images/beauty_care.jpg"
                  className="card-img-top"
                  alt="Skincare products"
                />
                <div className="card-body d-flex flex-column">
                  <p className="small text-muted mb-1">Beauty</p>
                  <h3 className="h5 card-title">Daily Care Set</h3>
                  <p className="rating mb-2" aria-label="4 out of 5 stars">
                    <i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i><i className="bi bi-star"></i>
                    <span className="text-muted small">(978)</span>
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-between"
                  >
                    <p className="mb-0">
                      <span className="old-price text-muted">999</span
                      ><strong className="text-primary">799</strong>
                    </p>
                    <button
                      className="btn btn-outline-primary mt-auto"
                      type="button"
                    >
                      <i className="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
            <article className="col-sm-6 col-lg-4">
              <div className="card product-card h-100">
                <img
                  src="images/smartwatch.jpg"
                  className="card-img-top"
                  alt="Minimal wristwatch with leather strap"
                />
                <div className="card-body d-flex flex-column">
                  <p className="small text-muted mb-1">Accessories</p>
                  <h3 className="h5 card-title">Smart Watch</h3>
                  <p className="rating mb-2" aria-label="4.5 out of 5 stars">
                    <i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-fill"></i
                    ><i className="bi bi-star-half"></i>
                    <span className="text-muted small">(451)</span>
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-between"
                  >
                    <p className="mb-0">
                      <span className="old-price text-muted">1499</span>
                      <strong className="text-primary">999</strong>
                    </p>
                    <button
                      className="btn btn-outline-primary mt-auto"
                      type="button"
                    >
                      <i className="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div> */}
        </div>
      </section>

      {/* Product Categories */}
      <section id="categories" className="category-section py-5">
        <div className="container">
          <div className="mb-4">
            <p className="section-eyebrow mb-1">Find your next favorite</p>
            <h2 id="categories-title" className="section-title">
              Shop by Category
            </h2>
          </div>
          <div className="row g-4">
            <div className="col-6 col-lg-3">
              <Link
                className="category-box category-electronics"
                to="/#featured-products"
              >
                <span>Electronics</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="col-6 col-lg-3">
              <Link
                className="category-box category-clothing"
                to="/#featured-products"
              >
                <span>Clothing</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="col-6 col-lg-3">
              <Link
                className="category-box category-footwear"
                to="/#featured-products"
              >
                <span>Footwear</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="col-6 col-lg-3">
              <Link
                className="category-box category-books"
                to="/#featured-products"
              >
                <span>Books</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter-section py-5">
        <div className="container">
          <aside className="newsletter-box text-center">
            <h2 id="newsletter-title">Stay in the loop</h2>
            <p className="mb-4">
              Get fresh arrivals, useful finds, and exclusive offers in your
              inbox.
            </p>
            <form className="row g-2 justify-content-center">
              <div className="col-12 col-md-7 col-lg-5">
                <label className="visually-hidden" for="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email address"
                  required
                />
              </div>
              <div className="col-12 col-md-auto">
                <button className="btn btn-dark btn-lg w-100" type="submit">
                  Subscribe
                </button>
              </div>
            </form>
          </aside>
        </div>
        <div className="msg-iemadded">Item added to Cart</div>
      </section>
    </main>
  );
}

export default HomePage;
