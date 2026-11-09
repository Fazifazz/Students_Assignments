import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

function Cart() {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Estimated tax: 5%
  const tax = subtotal * 0.05;

  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Shopping Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <h1>Your Shopping Cart</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="cart-summary">

        <h2>Order Summary</h2>

        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>

        <p>Estimated Tax (5%): ₹{tax.toFixed(2)}</p>

        <h3>Total: ₹{total.toFixed(2)}</h3>

      </div>

    </div>
  );
}

export default Cart;