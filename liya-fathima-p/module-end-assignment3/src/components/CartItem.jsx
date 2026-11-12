
import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">

      <img
        src={item.imageUrl}
        alt={item.name}
        className="cart-item-image"
      />

      <div className="flex-grow-1">

        <p className="cart-item-name">{item.name}</p>

        <span className="cart-item-price">
          ₹{Number(item.price).toFixed(2)}
        </span>

        <div className="quantity-controls">

          <button
            className="quantity-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            -
          </button>

          <span className="quantity-value">
            {item.quantity}
          </span>

          <button
            className="quantity-btn"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>

          <button
            className="remove-btn"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>

        </div>
      </div>

    </div>
  );
}

export default CartItem;
