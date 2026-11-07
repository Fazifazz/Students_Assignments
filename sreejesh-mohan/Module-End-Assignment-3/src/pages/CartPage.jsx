import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  ShieldCheck,
  Tag,
  CheckCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { cart, cartCount, subtotal, tax, total, clearCart } = useCart();

  // Coupon code state
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  // Checkout modal / confirmation state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Apply promo code logic
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'SHOPNEST10' || code === 'SAVE10') {
      setDiscountPercent(10);
      setPromoMessage({ type: 'success', text: '10% discount applied successfully!' });
    } else if (code === 'ENTRI20') {
      setDiscountPercent(20);
      setPromoMessage({ type: 'success', text: '20% Entri special discount applied!' });
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid promo code. Try "SHOPNEST10"' });
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, total - discountAmount);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="cart-page section-padding">
        <div className="container">
          <div className="empty-cart-view">
            <div className="empty-cart-illustration">
              <ShoppingBag size={56} />
            </div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>
              Looks like you haven't added anything to your cart yet. Discover our latest
              electronics, clothing, footwear, and books!
            </p>
            <Link to="/products" className="btn-primary-cta">
              <span>Start Shopping</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="cart-page section-padding">
        <div className="container">
          <div className="order-success-card">
            <div className="success-icon-wrap">
              <CheckCircle size={56} className="success-check" />
            </div>
            <h2>Order Confirmed!</h2>
            <p className="order-number">
              Order Reference: #SN-{Math.floor(100000 + Math.random() * 900000)}
            </p>
            <p className="order-success-text">
              Thank you for shopping with ShopNest. We have received your order and are
              preparing it for express delivery. A confirmation has been sent to your email.
            </p>
            <div className="order-next-actions">
              <Link to="/products" className="btn-primary-cta">
                <span>Continue Shopping</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page section-padding">
      <div className="container">
        {/* Cart Header */}
        <div className="cart-title-row">
          <div>
            <h1 className="page-heading">Shopping Cart</h1>
            <p className="cart-subtitle">
              You have <strong>{cartCount}</strong> {cartCount === 1 ? 'item' : 'items'} in
              your cart.
            </p>
          </div>

          <button
            type="button"
            className="btn-clear-cart"
            onClick={clearCart}
            title="Clear all items from cart"
          >
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Two-Column Cart Layout */}
        <div className="cart-page-layout">
          {/* Left Column: Cart Items List */}
          <div className="cart-items-column">
            <div className="cart-items-list">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="cart-navigation-row">
              <Link to="/products" className="btn-continue-shopping">
                &larr; <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="cart-summary-column">
            <div className="order-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="promo-code-form">
                <div className="promo-input-group">
                  <Tag size={16} className="tag-icon" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. SHOPNEST10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="promo-input"
                  />
                  <button type="submit" className="btn-apply-promo">
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`promo-alert ${promoMessage.type}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Financial Calculation Breakdown */}
              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span className="row-amount">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="breakdown-row discount-row">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="row-amount discount-amount">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="breakdown-row">
                  <span>Estimated Tax (5% GST)</span>
                  <span className="row-amount">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="breakdown-row">
                  <span>Shipping & Delivery</span>
                  <span className="free-shipping-tag">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="breakdown-row total-row">
                  <span>Order Total</span>
                  <span className="final-total-amount">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                type="button"
                className="btn-proceed-checkout"
                onClick={() => setCheckoutModalOpen(true)}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              {/* Trust Guarantee */}
              <div className="summary-security-guarantee">
                <ShieldCheck size={18} className="shield-icon" />
                <span>256-Bit SSL Encrypted Checkout Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div className="checkout-modal-backdrop" onClick={() => setCheckoutModalOpen(false)}>
          <div
            className="checkout-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Fast & Secure Checkout</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setCheckoutModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              <div className="form-group-row">
                <div className="form-field">
                  <label>Full Name</label>
                  <input type="text" required placeholder="e.g. Sreejesh Mohan" defaultValue="Sreejesh Mohan" />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input type="tel" required placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
                </div>
              </div>

              <div className="form-field">
                <label>Shipping Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, apartment, or suite"
                  defaultValue="42 Tech Park Avenue, Kozhikode"
                />
              </div>

              <div className="form-group-row">
                <div className="form-field">
                  <label>City / State</label>
                  <input type="text" required defaultValue="Kerala, India" />
                </div>
                <div className="form-field">
                  <label>Postal Code</label>
                  <input type="text" required defaultValue="673001" />
                </div>
              </div>

              <div className="checkout-summary-mini">
                <div className="mini-row">
                  <span>Total Payable:</span>
                  <strong>₹{finalTotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="mini-row payment-mode">
                  <span>Payment Method:</span>
                  <span className="pay-tag">Cash on Delivery / UPI</span>
                </div>
              </div>

              <button type="submit" className="btn-confirm-order">
                Complete Order (₹{finalTotal.toLocaleString('en-IN')})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
