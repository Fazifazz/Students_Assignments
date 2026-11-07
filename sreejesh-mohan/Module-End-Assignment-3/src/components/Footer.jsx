import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Service Highlights Bar */}
      <div className="footer-highlights">
        <div className="container highlights-grid">
          <div className="highlight-item">
            <Truck className="highlight-icon" size={24} />
            <div>
              <h4>Free Fast Delivery</h4>
              <p>On all domestic orders over ₹999</p>
            </div>
          </div>
          <div className="highlight-item">
            <ShieldCheck className="highlight-icon" size={24} />
            <div>
              <h4>Secure Payments</h4>
              <p>100% encrypted & verified transactions</p>
            </div>
          </div>
          <div className="highlight-item">
            <RotateCcw className="highlight-icon" size={24} />
            <div>
              <h4>Easy 14-Day Returns</h4>
              <p>No questions asked return policy</p>
            </div>
          </div>
          <div className="highlight-item">
            <Headphones className="highlight-icon" size={24} />
            <div>
              <h4>24/7 Premium Support</h4>
              <p>Dedicated round-the-clock helpdesk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container footer-main">
        <div className="footer-column brand-col">
          <Link to="/" className="brand-logo footer-logo">
            <BrandLogo size={26} />
          </Link>
          <p className="brand-tagline">
            Your destination for modern lifestyle essentials. Premium quality, curated electronics, apparel, footwear, and literature.
          </p>
          <div className="footer-social-links" aria-label="Social Media Links">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn instagram"
              aria-label="ShopNest on Instagram"
              title="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn facebook"
              aria-label="ShopNest on Facebook"
              title="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn twitter"
              aria-label="ShopNest on X (Twitter)"
              title="X (Twitter)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn youtube"
              aria-label="ShopNest on YouTube"
              title="YouTube"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn linkedin"
              aria-label="ShopNest on LinkedIn"
              title="LinkedIn"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Browse All Products</Link></li>
            <li><Link to="/cart">My Shopping Cart</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=Electronics">Electronics & Audio</Link></li>
            <li><Link to="/products?category=Clothing">Apparel & Outerwear</Link></li>
            <li><Link to="/products?category=Footwear">Footwear & Sneakers</Link></li>
            <li><Link to="/products?category=Books">Books & Literature</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-col-title">Contact & Help</h4>
          <ul className="footer-links">
            <li><span>Email: support@shopnest.store</span></li>
            <li><span>Phone: +91 (800) 456-7890</span></li>
            <li><span>Mon - Sat: 9:00 AM - 8:00 PM IST</span></li>
            <li><Link to="/contact" className="contact-link-accent">Send us a message &rarr;</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>&copy; {new Date().getFullYear()} ShopNest E-Commerce. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span className="bullet-sep">&bull;</span>
            <span>Terms of Service</span>
            <span className="bullet-sep">&bull;</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
