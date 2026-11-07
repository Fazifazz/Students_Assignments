import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductReviews from '../components/ProductReviews';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    let isMounted = true;
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/products.json');
        if (isMounted) {
          setAllProducts(response.data);
          const found = response.data.find(
            (item) => String(item.id) === String(id)
          );
          if (found) {
            setProduct(found);
          } else {
            setError(`Product with ID "${id}" could not be found.`);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load product details:', err);
          setError('Failed to load product details. Please try again later.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Compute Related Products from the same category
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter(
        (item) =>
          item.category.toLowerCase() === product.category.toLowerCase() &&
          String(item.id) !== String(product.id)
      )
      .slice(0, 4);
  }, [product, allProducts]);

  const handleDecreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => (product && prev < (product.stock || 20) ? prev + 1 : prev));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  if (loading) {
    return (
      <div className="detail-loading-state section-padding">
        <div className="container text-center">
          <Loader2 size={42} className="spinner-icon" />
          <h2>Loading Product Details...</h2>
          <p>Please wait while we prepare the item information.</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-error-state section-padding">
        <div className="container text-center">
          <div className="error-icon-box">
            <AlertCircle size={44} />
          </div>
          <h2>Product Not Found</h2>
          <p>{error || "We couldn't locate the product you requested."}</p>
          <div className="error-actions">
            <Link to="/products" className="btn-primary-cta">
              <ArrowLeft size={16} />
              <span>Back to Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="product-detail-page section-padding">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="crumb-separator">/</span>
          <Link to="/products">Products</Link>
          <span className="crumb-separator">/</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <span className="crumb-separator">/</span>
          <span className="current-crumb">{product.name}</span>
        </nav>

        {/* Back Link */}
        <button
          type="button"
          className="btn-back-link"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>

        {/* Main Product Layout */}
        <div className="product-detail-layout">
          {/* Left Column: Image Showcase */}
          <div className="detail-media-column">
            <div className="detail-image-card">
              <span className="detail-category-tag">{product.category}</span>
              {discountPercent && (
                <span className="detail-discount-tag">Save {discountPercent}%</span>
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="detail-main-image"
              />
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="detail-info-column">
            <span className="detail-brand-name">
              {product.brand || 'ShopNest Signature'}
            </span>

            <h1 className="detail-title">{product.name}</h1>

            {/* Ratings & Stock Status */}
            <div className="detail-rating-row">
              <div className="star-rating-pill">
                <Star size={16} className="star-filled" />
                <span className="rating-score">{product.rating}</span>
                <span className="rating-out-of">/ 5.0</span>
              </div>
              <span className="rating-reviews-count">
                ({product.reviewsCount || 120} verified customer reviews)
              </span>
              <span className="stock-pill in-stock">
                <CheckCircle2 size={14} />
                <span>In Stock ({product.stock || 15} units left)</span>
              </span>
            </div>

            {/* Pricing Details */}
            <div className="detail-pricing-box">
              <div className="price-stack">
                <span className="detail-current-price">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="detail-original-price">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {discountPercent && (
                <span className="detail-savings-badge">
                  You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({discountPercent}% OFF)
                </span>
              )}
            </div>

            {/* Product Description */}
            <div className="detail-description-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Features Checklist */}
            {product.features && product.features.length > 0 && (
              <div className="detail-features-section">
                <h3>Highlights & Features</h3>
                <ul className="features-checklist">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector, Add to Cart, and Wishlist Buttons */}
            <div className="detail-actions-section">
              <div className="quantity-selection-wrapper">
                <label className="qty-label">Quantity:</label>
                <div className="qty-picker">
                  <button
                    type="button"
                    className="qty-picker-btn"
                    onClick={handleDecreaseQty}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-picker-val">{quantity}</span>
                  <button
                    type="button"
                    className="qty-picker-btn"
                    onClick={handleIncreaseQty}
                    disabled={quantity >= (product.stock || 20)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="detail-buttons-row">
                <button
                  type="button"
                  className={`btn-add-to-cart-large ${addedAnimation ? 'added-success' : ''}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} />
                  <span>{addedAnimation ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  className={`btn-detail-wishlist ${isWishlisted ? 'wishlist-active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart size={20} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="detail-trust-badges">
              <div className="trust-badge-item">
                <Truck size={18} />
                <span>Free delivery on this item</span>
              </div>
              <div className="trust-badge-item">
                <ShieldCheck size={18} />
                <span>1-Year Official Warranty</span>
              </div>
              <div className="trust-badge-item">
                <RotateCcw size={18} />
                <span>14-Day Easy Return Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Ratings Breakdown */}
        <ProductReviews product={product} />

        {/* Related Products ("You May Also Like") */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="related-section-header">
              <div className="related-pill-eyebrow">
                <Sparkles size={14} />
                <span>Related Picks</span>
              </div>
              <h2 className="related-main-title">You May Also Like</h2>
              <p className="related-sub-title">
                Handpicked recommendations in {product.category} based on your viewing history
              </p>
            </div>

            <div className="related-products-grid">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
