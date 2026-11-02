import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones as SupportIcon,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import ProductGrid from '../components/ProductGrid';

// Store Products Hero Banners (Electronics, Clothing, Footwear, Books)
const PRODUCT_HERO_BANNERS = [
  {
    id: 'electronics',
    category: 'Electronics',
    tag: '⚡ Flagship Tech & Audio · Up to 35% Off',
    headline: 'We bring next-gen tech to your door',
    description:
      'Immerse in industry-leading Sony noise-cancelling headphones, Apple Watch Series 9, and M2 MacBooks with exclusive same-day shipping.',
    ctaText: 'Shop Electronics',
    ctaLink: '/products?category=Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    badge: '4.9 ★ Flagship Audio',
    accentColor: '#38bdf8',
  },
  {
    id: 'clothing',
    category: 'Clothing',
    tag: '✨ Curated Wardrobe · New Season',
    headline: 'Elevate your daily style with iconic fits',
    description:
      "Discover genuine Levi's denim cuts, cozy Nike Sportswear Club fleece hoodies, and timeless Ralph Lauren essentials for every occasion.",
    ctaText: 'Shop Clothing',
    ctaLink: '/products?category=Clothing',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
    badge: '4.8 ★ Curated Fashion',
    accentColor: '#fbbf24',
  },
  {
    id: 'footwear',
    category: 'Footwear',
    tag: '👟 Streetwear & Athletics · Peak Performance',
    headline: 'Step ahead in unmatched speed & comfort',
    description:
      'Engineered for endurance and street fashion — Nike Air Zoom Pegasus 40, Adidas Ultraboost Light, and classic Converse kicks.',
    ctaText: 'Shop Footwear',
    ctaLink: '/products?category=Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    badge: '4.9 ★ Streetwear Sneakers',
    accentColor: '#a3e635',
  },
  {
    id: 'books',
    category: 'Books',
    tag: '📚 Knowledge & Growth · Bestseller Vault',
    headline: 'Feed your mind with world-class books',
    description:
      'From Atomic Habits and The Psychology of Money to Sapiens and Deep Work — build habits and life-changing perspective.',
    ctaText: 'Shop Books',
    ctaLink: '/products?category=Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    badge: '4.9 ★ Bestseller Vault',
    accentColor: '#c084fc',
  },
];

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Fetch all products
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/products.json');
        if (isMounted) {
          setAllProducts(response.data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          setError('Could not load products. Please check your connection.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-slide hero product banners every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PRODUCT_HERO_BANNERS.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + PRODUCT_HERO_BANNERS.length) % PRODUCT_HERO_BANNERS.length
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % PRODUCT_HERO_BANNERS.length);
  };

  const currentBanner = PRODUCT_HERO_BANNERS[currentSlide];

  // Filter products by category for section showcases
  const electronicsProducts = allProducts.filter((p) => p.category === 'Electronics');
  const clothingProducts = allProducts.filter((p) => p.category === 'Clothing');
  const footwearProducts = allProducts.filter((p) => p.category === 'Footwear');
  const booksProducts = allProducts.filter((p) => p.category === 'Books');

  return (
    <div className="home-page">
      {/* ========================================================
          PRODUCTS HERO BANNER (No boxes below, clean layout)
          ======================================================== */}
      <section
        className="laptop-hero-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container container-wide">
          {/* Main Dark Forest Green Hero Canvas */}
          <div className="laptop-hero-canvas">
            {/* Background Pattern Watermarks */}
            <div className="hero-pattern-bg"></div>

            <div className="hero-split-grid" key={currentBanner.id}>
              {/* Left Column: Heading, Subtitle & Lime Button */}
              <div className="hero-left-column">
                <div
                  className="hero-tag-pill"
                  style={{
                    color: currentBanner.accentColor,
                    borderColor: currentBanner.accentColor,
                  }}
                >
                  <Zap size={14} />
                  <span>{currentBanner.tag}</span>
                </div>

                <h1 className="hero-bold-title">{currentBanner.headline}</h1>

                <p className="hero-lead-text">{currentBanner.description}</p>

                <div className="hero-cta-wrapper">
                  <Link to={currentBanner.ctaLink} className="btn-shop-now-lime">
                    <span>{currentBanner.ctaText}</span>
                    <ArrowRight size={18} />
                  </Link>

                  <Link to="/products" className="btn-hero-secondary">
                    <span>Explore All Products</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Real E-Commerce Product Visual */}
              <div className="hero-right-column">
                <div className="hero-product-media-card">
                  <div className="product-media-badge">
                    <Tag size={13} />
                    <span>{currentBanner.badge}</span>
                  </div>

                  <img
                    src={currentBanner.image}
                    alt={`${currentBanner.category} Banner`}
                    className="hero-product-img"
                  />
                </div>
              </div>
            </div>

            {/* Slider Navigation Dots & Controls */}
            <div className="hero-banner-controls">
              <button
                type="button"
                className="btn-banner-nav"
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="hero-dots-row">
                {PRODUCT_HERO_BANNERS.map((banner, idx) => (
                  <button
                    key={banner.id}
                    type="button"
                    className={`hero-dot-btn ${currentSlide === idx ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <span className="dot-category">{banner.category}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn-banner-nav"
                onClick={handleNextSlide}
                aria-label="Next Slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Concave bottom curve SVG */}
            <div className="hero-concave-curve">
              <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
                <path
                  d="M0 0C380 45 1060 45 1440 0V60H0V0Z"
                  fill="#f8fafc"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Strip (Clean transition directly below curve) */}
      <section className="features-strip">
        <div className="container container-wide features-grid">
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Truck size={22} />
            </div>
            <div>
              <h3>Express Shipping</h3>
              <p>Lightning-fast delivery across India</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3>100% Authentic</h3>
              <p>Direct manufacturer guarantees</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <RotateCcw size={22} />
            </div>
            <div>
              <h3>Hassle-Free Returns</h3>
              <p>14-day replacement or full refund</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <SupportIcon size={22} />
            </div>
            <div>
              <h3>Expert Support</h3>
              <p>Round-the-clock live chat & hotline</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CURATED PRODUCT CATEGORY SECTIONS
          ======================================================== */}
      {loading ? (
        <section className="section-padding text-center">
          <div className="container">
            <div className="loading-state">
              <Loader2 size={36} className="spinner-icon" />
              <p>Loading curated products...</p>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="section-padding text-center">
          <div className="container">
            <div className="error-state">
              <AlertCircle size={32} />
              <p>{error}</p>
            </div>
          </div>
        </section>
      ) : (
        <div className="product-sections-container">
          {/* 1. Electronics Section */}
          <section className="category-section-block section-padding bg-subtle">
            <div className="container container-wide">
              <div className="category-promo-banner electronics-banner">
                <div className="promo-banner-content">
                  <div className="promo-pill">⚡ Audio & Tech</div>
                  <h2 className="promo-banner-title">Electronics Showcase</h2>
                  <p className="promo-banner-desc">
                    High-fidelity noise cancellation, crystal-clear 4K visual immersion, and high-performance computing.
                  </p>
                  <Link to="/products?category=Electronics" className="promo-banner-cta">
                    <span>View All Electronics</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="section-products-shelf">
                <ProductGrid products={electronicsProducts.slice(0, 4)} />
              </div>
            </div>
          </section>

          {/* 2. Clothing Section */}
          <section className="category-section-block section-padding">
            <div className="container container-wide">
              <div className="category-promo-banner clothing-banner">
                <div className="promo-banner-content">
                  <div className="promo-pill">✨ Style & Wardrobe</div>
                  <h2 className="promo-banner-title">Fashion & Apparel Collection</h2>
                  <p className="promo-banner-desc">
                    Authentic Levi's denim cuts, cozy Nike sportswear fleece, and modern everyday essentials.
                  </p>
                  <Link to="/products?category=Clothing" className="promo-banner-cta">
                    <span>View All Clothing</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="section-products-shelf">
                <ProductGrid products={clothingProducts.slice(0, 4)} />
              </div>
            </div>
          </section>

          {/* 3. Footwear Section */}
          <section className="category-section-block section-padding bg-subtle">
            <div className="container container-wide">
              <div className="category-promo-banner footwear-banner">
                <div className="promo-banner-content">
                  <div className="promo-pill">👟 Streetwear & Motion</div>
                  <h2 className="promo-banner-title">Footwear & Sneakers Hub</h2>
                  <p className="promo-banner-desc">
                    Engineered for endurance and street fashion — Nike Pegasus, Adidas Ultraboost, and classic Converse.
                  </p>
                  <Link to="/products?category=Footwear" className="promo-banner-cta">
                    <span>View All Footwear</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="section-products-shelf">
                <ProductGrid products={footwearProducts.slice(0, 4)} />
              </div>
            </div>
          </section>

          {/* 4. Books Section */}
          <section className="category-section-block section-padding">
            <div className="container container-wide">
              <div className="category-promo-banner books-banner">
                <div className="promo-banner-content">
                  <div className="promo-pill">📚 Mind & Wisdom</div>
                  <h2 className="promo-banner-title">Books & Literature Vault</h2>
                  <p className="promo-banner-desc">
                    Master habits, master money, and understand civilization with our curated non-fiction bestsellers.
                  </p>
                  <Link to="/products?category=Books" className="promo-banner-cta">
                    <span>View All Books</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="section-products-shelf">
                <ProductGrid products={booksProducts.slice(0, 4)} />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Promotional Mega Banner */}
      <section className="promo-banner-section section-padding">
        <div className="container container-wide">
          <div className="promo-banner-card">
            <div className="promo-content">
              <span className="promo-tag">Special Weekend Deal</span>
              <h2>Upgrade Your Setup with Up to 25% Off</h2>
              <p>
                From audiophile headphones to productivity classics, get complimentary
                delivery on every purchase this week with code <strong>SHOPNEST25</strong>.
              </p>
              <Link to="/products" className="btn-promo">
                Shop The Sale Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
