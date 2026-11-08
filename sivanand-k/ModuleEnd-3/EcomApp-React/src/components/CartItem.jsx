import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="cart-item">

      <img
        src={item.imageUrl}
        alt={item.name}
        width="100"
      />

      <div>
        <h3>{item.name}</h3>

        <p>₹{item.price}</p>

        <div>
          <button onClick={() => decreaseQuantity(item.id)}>
            -
          </button>

          <span>{item.quantity}</span>

          <button onClick={() => increaseQuantity(item.id)}>
            +
          </button>
        </div>

        <p>
          Subtotal: ₹{item.price * item.quantity}
        </p>

        <button onClick={() => removeFromCart(item.id)}>
          Remove
        </button>
      </div>

    </div>
  );
}

export default CartItem;