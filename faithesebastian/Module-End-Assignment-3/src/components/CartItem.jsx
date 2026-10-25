import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function CartItem({ item }) {
  const { product, quantity } = item;
  const { setQuantity, removeItem } = useCart();

  return (
    <article className="cart-row">
      <img
        className="cart-row-image"
        src={product.imageUrl || "/product-placeholder.svg"}
        alt=""
      />
      <div className="cart-row-details">
        <span className="product-category">{product.category}</span>
        <h2>{product.name}</h2>
        <p>{formatCurrency(product.price)} each</p>
      </div>
      <div className="quantity-controls" aria-label={`Quantity for ${product.name}`}>
        <button
          type="button"
          aria-label={`Decrease ${product.name} quantity`}
          disabled={quantity <= 1}
          onClick={() => setQuantity(product.id, quantity - 1)}
        >
          −
        </button>
        <span aria-live="polite">{quantity}</span>
        <button
          type="button"
          aria-label={`Increase ${product.name} quantity`}
          disabled={quantity >= 10}
          onClick={() => setQuantity(product.id, quantity + 1)}
        >
          +
        </button>
      </div>
      <strong className="cart-row-total">
        {formatCurrency(product.price * quantity)}
      </strong>
      <button
        className="remove-item"
        type="button"
        onClick={() => removeItem(product.id)}
        aria-label={`Remove ${product.name} from cart`}
      >
        Remove
      </button>
    </article>
  );
}
