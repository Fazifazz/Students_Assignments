import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Calculate discount percentage if originalPrice exists
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-media">
        <span className="product-badge">{product.category}</span>
        {discountPercent && (
          <span className="discount-badge">-{discountPercent}%</span>
        )}
        <button
          type="button"
          className={`btn-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} />
        </button>
        <div className="product-image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </div>
        <div className="product-card-hover-overlay">
          <span className="view-details-pill">
            <Eye size={15} /> View Details
          </span>
        </div>
      </Link>

      <div className="product-card-body">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand || product.category}</span>
          <div className="product-rating">
            <Star size={14} className="star-icon" />
            <span>{product.rating}</span>
            {product.reviewsCount && (
              <span className="review-count">({product.reviewsCount})</span>
            )}
          </div>
        </div>

        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="product-price-row">
          <div className="prices-group">
            <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="original-price">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn-add-to-cart"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
}
