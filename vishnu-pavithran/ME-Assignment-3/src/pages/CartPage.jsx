import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import useCart from "../hooks/useCart";

const TAX_RATE = 0.05;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function CartPage() {
  const {
    items,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );
  const estimatedTax = subtotal * TAX_RATE;
  const grandTotal = subtotal + estimatedTax;

  return (
    <main className="container py-5">
      <h1 className="section-title mb-4">Shopping Cart</h1>
      {items.length === 0 ? (
        <section className="cart-empty text-center py-5">
          <i
            className="bi bi-cart3 display-4 text-muted"
            aria-hidden="true"
          ></i>
          <h2 className="h4 mt-3">Your Cart is Empty</h2>
          <p className="text-muted">
            Browse products and add something you like.
          </p>
          <Link className="btn btn-primary" to="/products">
            Continue Shopping
          </Link>
        </section>
      ) : (
        <div className="row g-4">
          <section className="col-12 col-lg-8" aria-label="Cart items">
            {items.map((item) => (
              <CartItem
                key={item.id ?? item._id}
                product={item}
                quantity={item.quantity}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </section>
          <aside className="col-12 col-lg-4">
            <section className="cart-summary-card">
              <h2 className="h5 mb-4">Order Summary</h2>
              <dl className="cart-totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{currencyFormatter.format(subtotal)}</dd>
                </div>
                <div>
                  <dt>Estimated tax (5%)</dt>
                  <dd>{currencyFormatter.format(estimatedTax)}</dd>
                </div>
                <div className="cart-grand-total">
                  <dt>Grand total</dt>
                  <dd>{currencyFormatter.format(grandTotal)}</dd>
                </div>
              </dl>
              <div className="cart-summary-actions">
                <button className="btn btn-primary w-100" type="button">
                  Checkout
                </button>
                <button
                  className="btn btn-outline-secondary w-100"
                  type="button"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </section>
          </aside>
        </div>
      )}
    </main>
  );
}

export default CartPage;
