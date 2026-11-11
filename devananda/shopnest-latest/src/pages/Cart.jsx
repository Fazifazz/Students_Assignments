
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem.jsx';

export default function Cart() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const totalInRupees = cartTotal;
  const subtotal = totalInRupees;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <main className="page-container">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products" className="button">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

         
           <div className="cart-summary">
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>Estimated Tax (5%): ₹{tax.toFixed(2)}</p>
              <h2>Total: ₹{total.toFixed(2)}</h2>
              <p>Checkout is not connected to a payment service.</p>
              <Link to="/products" className="button secondary">Continue Shopping</Link>
            </div>
        </>
      )}
    </main>
  );
}