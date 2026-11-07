import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item-card">
      {/* Product Image */}
      <Link to={`/products/${item.id}`} className="cart-item-img-link">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="cart-item-img"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="cart-item-info">
        <span className="cart-item-category">{item.category}</span>
        <h3 className="cart-item-name">
          <Link to={`/products/${item.id}`}>{item.name}</Link>
        </h3>
        <p className="cart-item-unit-price">
          ₹{item.price.toLocaleString('en-IN')} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-qty-wrap">
        <div className="qty-stepper">
          <button
            type="button"
            className="qty-btn"
            onClick={handleDecrease}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <Minus size={14} />
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={handleIncrease}
            aria-label={`Increase quantity of ${item.name}`}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Total for this item */}
      <div className="cart-item-total-price">
        <span className="total-label">Subtotal:</span>
        <span className="price-val">₹{itemTotal.toLocaleString('en-IN')}</span>
      </div>

      {/* Remove Button */}
      <div className="cart-item-delete">
        <button
          type="button"
          className="btn-remove-item"
          onClick={handleRemove}
          title="Remove from cart"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
