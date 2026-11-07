import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    subtotal,
    updateQuantity,
    removeFromCart,
    isCartDrawerOpen,
    closeCartDrawer,
  } = useCart();

  const navigate = useNavigate();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 999;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleGoToCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  const handleBrowseCatalog = () => {
    closeCartDrawer();
    navigate('/products');
  };

  return (
    <div className="drawer-overlay" onClick={closeCartDrawer} role="dialog" aria-modal="true">
      <div
        className="drawer-panel cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} className="drawer-title-icon" />
            <h3>Your Shopping Cart</h3>
            <span className="drawer-badge">{cartCount}</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={closeCartDrawer}
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="free-shipping-meter">
          <div className="meter-label">
            <Truck size={15} />
            {remainingForFree === 0 ? (
              <span>
                <strong>🎉 You've unlocked FREE Express Shipping!</strong>
              </span>
            ) : (
              <span>
                Add <strong>₹{remainingForFree.toLocaleString('en-IN')}</strong> more for Free Delivery
              </span>
            )}
          </div>
          <div className="meter-track">
            <div
              className={`meter-fill ${remainingForFree === 0 ? 'completed' : ''}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Drawer Item List */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-cart-circle">
                <ShoppingBag size={40} />
              </div>
              <h4>Your cart is currently empty</h4>
              <p>Explore our best-sellers in tech, fashion, sneakers and books.</p>
              <button
                type="button"
                className="btn-start-shopping"
                onClick={handleBrowseCatalog}
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="drawer-items-list">
              {cart.map((item) => (
                <div key={item.id} className="drawer-item-row">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="drawer-item-img"
                  />
                  <div className="drawer-item-info">
                    <span className="drawer-item-category">{item.category}</span>
                    <h5 className="drawer-item-name">
                      <Link to={`/products/${item.id}`} onClick={closeCartDrawer}>
                        {item.name}
                      </Link>
                    </h5>
                    <div className="drawer-item-price">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>

                    {/* Quantity Picker & Trash */}
                    <div className="drawer-item-actions">
                      <div className="drawer-qty-selector">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="drawer-item-remove"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
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

        {/* Drawer Footer Summary & CTAs */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal-row">
              <span>Estimated Subtotal</span>
              <span className="drawer-subtotal-val">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="drawer-taxes-note">
              Taxes & coupons calculated at final checkout
            </p>

            <div className="drawer-buttons-stack">
              <button
                type="button"
                className="btn-drawer-checkout"
                onClick={handleGoToCart}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="btn-drawer-view-cart"
                onClick={handleGoToCart}
              >
                <span>View Full Cart & Coupons</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
