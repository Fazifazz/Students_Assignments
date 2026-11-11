
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Categories from './pages/Categories.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Contact from './pages/Contact.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Favorites from './pages/Favorites.jsx';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h3>About ShopNest</h3>
          <p>Your one-stop destination for quality products at great prices.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h3>Contact</h3>
          <p>support@shopnest.com</p>
          <p>+91 9876212916</p>
          <p>Haripad, Kerala</p>
        </div>

        <div className="social-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://instagram.com/" target="_blank" rel="noreferrer">
              Instagram <i className="fab fa-instagram"></i>
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noreferrer">
              Facebook <i className="fab fa-facebook"></i>
            </a>
            <a href="https://youtube.com/" target="_blank" rel="noreferrer">
              YouTube <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <p className="copyright">
        © 2026 ShopNest. All rights reserved.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route
          path="*"
          element={
            <main className="page-container">
              <h1>Page not found</h1>
              <Link to="/">Go Home</Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </CartProvider>
  );
}
