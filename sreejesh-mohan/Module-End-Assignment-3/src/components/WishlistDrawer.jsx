import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistDrawer() {
  const {
    wishlist,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
    isWishlistDrawerOpen,
    closeWishlistDrawer,
  } = useWishlist();

  const { addToCart, openCartDrawer } = useCart();
  const navigate = useNavigate();

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWishlistDrawerOpen) {
        closeWishlistDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWishlistDrawerOpen, closeWishlistDrawer]);

  // Lock body scroll
  useEffect(() => {
    if (isWishlistDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWishlistDrawerOpen]);

  if (!isWishlistDrawerOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product, 1, false); // Add to cart
    removeFromWishlist(product.id); // Remove from wishlist
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1, false);
    });
    clearWishlist();
    closeWishlistDrawer();
    openCartDrawer();
  };

  const handleBrowseCatalog = () => {
    closeWishlistDrawer();
    navigate('/products');
  };

  return (
    <div className="drawer-overlay" onClick={closeWishlistDrawer} role="dialog" aria-modal="true">
      <div
        className="drawer-panel wishlist-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Heart size={20} className="drawer-title-icon heart-red" />
            <h3>Your Saved Wishlist</h3>
            <span className="drawer-badge wishlist-badge-count">{wishlistCount}</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={closeWishlistDrawer}
            aria-label="Close wishlist drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-cart-circle empty-heart-circle">
                <Heart size={40} />
              </div>
              <h4>Your wishlist is empty</h4>
              <p>
                Tap the heart icon on any product card or detail page to save your favorite
                items for later.
              </p>
              <button
                type="button"
                className="btn-start-shopping"
                onClick={handleBrowseCatalog}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="drawer-items-list">
              {wishlist.map((item) => (
                <div key={item.id} className="drawer-item-row">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="drawer-item-img"
                  />
                  <div className="drawer-item-info">
                    <span className="drawer-item-category">{item.category}</span>
                    <h5 className="drawer-item-name">
                      <Link to={`/products/${item.id}`} onClick={closeWishlistDrawer}>
                        {item.name}
                      </Link>
                    </h5>
                    <div className="drawer-item-price">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>

                    <div className="drawer-wishlist-actions">
                      <button
                        type="button"
                        className="btn-move-to-cart"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingCart size={14} />
                        <span>Move to Cart</span>
                      </button>
                      <button
                        type="button"
                        className="drawer-item-remove"
                        onClick={() => removeFromWishlist(item.id)}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {wishlist.length > 0 && (
          <div className="drawer-footer">
            <button
              type="button"
              className="btn-drawer-checkout"
              onClick={handleMoveAllToCart}
            >
              <ShoppingCart size={17} />
              <span>Move All to Cart</span>
            </button>
            <button
              type="button"
              className="btn-drawer-clear-wishlist"
              onClick={clearWishlist}
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
