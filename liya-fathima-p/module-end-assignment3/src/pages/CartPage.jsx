
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

function CartPage() {
  const { cart, subtotal, tax, total } = useCart();

  return (
    <section className="container py-5">

      <div className="section-heading">
        <p className="section-eyebrow">YOUR SHOPPING BAG</p>
        <h2>
          Your <span className="head-span">Cart</span>
        </h2>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart text-center py-5">
          <i className="bi bi-bag-x"></i>
          <h3>Your cart is empty</h3>
          <p>Explore our products and add your favourites.</p>

          <Link to="/products" className="add-cart-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">

          <div className="col-lg-8">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}
          </div>

          <div className="col-lg-4">
            <div className="cart-summary">

              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" type="button">
                Proceed to Checkout
              </button>

            </div>
          </div>

        </div>
      )}

    </section>
  );
}

export default CartPage;
