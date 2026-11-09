
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Home products error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    {
      name: "Electronics",
      description: "Technology for everyday life",
      icon: "⌚",
    },
    {
      name: "Footwear",
      description: "Comfort in every step",
      icon: "👟",
    },
    {
      name: "Clothing",
      description: "Style your everyday",
      icon: "👜",
    },
    {
      name: "Books",
      description: "Discover something new",
      icon: "📚",
    },
  ];

  return (
    <main className="home-page">

      {/* Hero Section */}

      <section className="hero-section">
        <div className="hero-content">

          <span className="hero-label">
            WELCOME TO SHOPNEST
          </span>

          <h1>
            Find What You Love.
            <br />
            <span>Shop What You Need.</span>
          </h1>

          <p>
            Discover quality products across electronics,
            fashion, footwear and more. Everything you need,
            all in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="hero-primary-btn">
              Explore Products →
            </Link>

            <Link to="/contact" className="hero-secondary-btn">
              Contact Us
            </Link>
          </div>

          <div className="hero-note">
            <span>✓</span> Simple Shopping
            <span>✓</span> Great Choices
            <span>✓</span> Everyday Essentials
          </div>

        </div>

        <div className="hero-visual">
          <div className="hero-image-card">
            <img
              src="/images/hero.png"
              alt="ShopNest featured collection"
            />
            <div className="hero-image-caption">
              <span>Explore our collection</span>
              <strong>Everyday Essentials</strong>
            </div>
          </div>

          <div className="hero-small-card">
            <span>SHOP SMART</span>
            <strong>Live Better.</strong>
          </div>
        </div>
      </section>

      {/* Brand Introduction */}

      <section className="brand-section">
        <div className="brand-content">
          <span className="section-label">ABOUT SHOPNEST</span>

          <h2>
            Shopping made simple.
          </h2>

          <p>
            ShopNest brings together products for your everyday
            needs. From useful technology to personal style and
            daily essentials, discover a convenient way to shop.
          </p>
        </div>

        <div className="brand-highlight">
          <h3>One Place.</h3>
          <h3>More Choices.</h3>
          <h3>Better Shopping.</h3>
        </div>
      </section>

      {/* Categories */}

      <section className="home-category-section">

        <div className="home-section-heading">
          <div>
            <span className="section-label">EXPLORE COLLECTIONS</span>
            <h2>Shop by Category</h2>
            <p>Find something that fits your everyday needs.</p>
          </div>

          <Link to="/products" className="view-all-link">
            View All Products →
          </Link>
        </div>

        <div className="home-category-grid">

          {categories.map((category) => (
            <Link
              to="/products"
              className="home-category-card"
              key={category.name}
            >
              <span className="category-icon">
                {category.icon}
              </span>

              <h3>{category.name}</h3>

              <p>{category.description}</p>

              <span className="category-explore">
                Explore →
              </span>
            </Link>
          ))}

        </div>
      </section>

      {/* Featured Products */}

      <section className="featured-section">

        <div className="home-section-heading">
          <div>
            <span className="section-label">OUR COLLECTION</span>
            <h2>Featured Products</h2>
            <p>A few picks from our ShopNest collection.</p>
          </div>

          <Link to="/products" className="view-all-link">
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="home-loading">Loading featured products...</p>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="home-loading">
            Featured products are currently unavailable.
          </p>
        )}

      </section>

      {/* Shopping Benefits */}

      <section className="benefits-section">

        <div className="benefit-item">
          <span>01</span>
          <div>
            <h3>Easy Browsing</h3>
            <p>Explore products with simple navigation.</p>
          </div>
        </div>

        <div className="benefit-item">
          <span>02</span>
          <div>
            <h3>More Choices</h3>
            <p>Discover products across different categories.</p>
          </div>
        </div>

        <div className="benefit-item">
          <span>03</span>
          <div>
            <h3>Simple Shopping</h3>
            <p>Add your favourites and manage your cart easily.</p>
          </div>
        </div>

      </section>

      {/* Call to Action */}

      <section className="home-cta">
        <div>
          <span>YOUR NEXT FIND IS HERE</span>
          <h2>Ready to explore ShopNest?</h2>
          <p>Browse our collection and find what you need.</p>
        </div>

        <Link to="/products">
          Start Shopping →
        </Link>
      </section>

      {/* Footer */}

      <footer className="home-footer">

        <div className="footer-main">

          <div className="footer-brand">
            <h2>ShopNest</h2>
            <p>
              Your one-stop shopping destination.
              Discover everyday essentials with ease.
            </p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-links">
            <h3>Categories</h3>
            {categories.map((category) => (
              <Link to="/products" key={category.name}>
                {category.name}
              </Link>
            ))}
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
          <p>Simple Shopping. Everyday Essentials.</p>
        </div>

      </footer>

    </main>
  );
}

export default Home;
