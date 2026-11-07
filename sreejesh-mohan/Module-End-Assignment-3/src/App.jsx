import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import { AlertCircle, ArrowLeft } from 'lucide-react';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// 404 Page Component
function NotFoundPage() {
  return (
    <div className="not-found-page section-padding">
      <div className="container text-center">
        <div className="not-found-icon-box">
          <AlertCircle size={56} />
        </div>
        <h1 className="not-found-title">404 - Page Not Found</h1>
        <p className="not-found-text">
          Sorry, the page you are looking for doesn't exist or may have been relocated.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary-cta">
            <ArrowLeft size={16} />
            <span>Return to Homepage</span>
          </Link>
          <Link to="/products" className="btn-secondary-cta">
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-root">
      <ScrollToTop />
      <Navbar />
      <CartDrawer />
      <WishlistDrawer />
      <main className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
