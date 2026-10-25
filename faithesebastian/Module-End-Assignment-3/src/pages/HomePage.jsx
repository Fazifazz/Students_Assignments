import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";
import { useProducts } from "../context/ProductsContext.jsx";

export default function HomePage() {
  const { products, loading, error } = useProducts();

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="eyebrow">Fresh picks for every lifestyle</span>
            <h1>Find your next favourite</h1>
            <p>
              Discover everyday essentials, thoughtful gifts, and great finds
              chosen for you.
            </p>
            <div className="hero-actions">
              <Link className="btn-shop" to="/products">Shop products</Link>
              <Link className="btn-secondary" to="/contact">Get in touch</Link>
            </div>
            <ul className="hero-metrics" aria-label="Store highlights">
              <li><strong>Curated</strong><span>Everyday essentials</span></li>
              <li><strong>Simple</strong><span>Easy shopping</span></li>
              <li><strong>Secure</strong><span>Cart saved on this device</span></li>
            </ul>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-highlight">
              <i className="bi bi-bag-heart" />
              <span>Good finds, all in one nest.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog">
        <div className="container">
          <h2 className="section-title">Shop Our Products</h2>
          <p className="section-subtitle">Find your next favourite product</p>
          <ProductGrid
            products={products.slice(0, 8)}
            loading={loading}
            error={error}
          />
          {!loading && !error && products.length > 0 && (
            <div className="catalog-action">
              <Link className="button button-primary" to="/products">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
