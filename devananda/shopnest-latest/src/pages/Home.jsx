import ProductCard from '../components/ProductCard.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import productsUrl from '../products.json?url';
export default function Home() {
  

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  axios.get(productsUrl)
    .then((response) => {
      setProducts(response.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError('Failed to load products.');
      setLoading(false);
    });
}, []);

  return (
    <main>
    {loading && <p>Loading products...</p>}
{error && <p>{error}</p>}
   
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
          <span className="hero-badge">Welcome to ShopNest</span>
          <h1>Discover Something You’ll Love</h1>
          <p>
            Explore great products, exciting deals, and everyday
            essentials at ShopNest.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="button">Shop Now</Link>
            <a href="#featured" className="button secondary">Explore Products</a>
          </div>
        </div>

        <div className="hero-image">
          <img src="/assets/hero.jpg" alt="ShopNest collection" />
        </div>
        </div>
      </section>

      <section className="section">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          <Link to="/products?category=Electronics" className="category-card">
            <img src="/assets/electronics.jpg" alt="Electronics" />
            <h3>Electronics</h3>
          </Link>

          <Link to="/products?category=Clothing" className="category-card">
            <img src="/assets/clothing-set.avif" alt="Clothing" />
            <h3>Clothing</h3>
          </Link>

          <Link to="/products?category=Footwear" className="category-card">
            <img src="/assets/footwear.jpg" alt="Footwear" />
            <h3>Footwear</h3>
          </Link>

          <Link to="/products?category=Books" className="category-card">
            <img src="/assets/books.jpg" alt="Books" />
            <h3>Books</h3>
          </Link>
        </div>
      </section>

      <section id="featured" className="section">
        <h2>Featured Products</h2>
       
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  }}
>{products.map((product) => (
  <ProductCard key={product.id} product={product} />
))}
</div>
      </section>

      <section className="section benefits">
        <h2>Why Choose ShopNest?</h2>
        <div className="benefit-grid">
          <article>
            <h3>Quality Products</h3>
            <p>Carefully selected products for everyday needs.</p>
          </article>
          <article>
            <h3>Easy Shopping</h3>
            <p>A simple and convenient shopping experience.</p>
          </article>
          <article>
            <h3>Fast Delivery</h3>
            <p>Your favourite products delivered to your doorstep.</p>
          </article>
        </div>
      </section>

      <aside className="offer-section">
        <h2>Special Offer</h2>
        <p>Discover exciting deals and everyday essentials.</p>
        <Link to="/products" className="button">View Products</Link>
      </aside>

      <Newsletter />
    </main>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) return;

    setMessage('Thank you for subscribing!');
    setEmail('');
  }

  return (
    <section className="section newsletter">
      <h2>Subscribe to Our Newsletter</h2>
      <p>Get the latest updates, deals, and new arrivals.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button className="button" type="submit">Subscribe</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}