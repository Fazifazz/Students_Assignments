import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

const TAX_RATE = 0.05;

export default function CartPage() {
  const { items, subtotal } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  function startCheckout() {
    setCheckoutMessage(
      "Checkout isn’t connected yet. Your cart is saved, and no order has been placed.",
    );
  }

  return (
    <section className="container page-section cart-page">
      <h1 className="section-title">Your Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="empty-cart">
          <i className="bi bi-cart-x" aria-hidden="true" />
          <h2>Your cart is empty</h2>
          <p>Explore the collection and add something you love.</p>
          <Link className="button button-primary" to="/products">Start shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          <aside className="cart-summary" aria-label="Order summary">
            <h2>Order Summary</h2>
            <div className="summary-line">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Tax estimate (5%)</span><span>{formatCurrency(tax)}</span>
            </div>
            <div className="summary-line summary-total">
              <strong>Total</strong><strong>{formatCurrency(total)}</strong>
            </div>
            <p className="tax-note">Tax is an estimate and may vary at checkout.</p>
            <div className="cart-actions">
              <Link className="button button-secondary checkout-button" to="/products">
              Continue shopping
              </Link>
              <button
                className="button button-primary checkout-button"
                type="button"
                onClick={startCheckout}
              >
                <i className="bi bi-bag-check" aria-hidden="true" />
                Buy Now
              </button>
            </div>
            <p className="checkout-message" role="status" aria-live="polite">
              {checkoutMessage}
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
