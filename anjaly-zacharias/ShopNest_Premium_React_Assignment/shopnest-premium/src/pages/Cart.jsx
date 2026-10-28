import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, tax, total, clearCart } = useCart();
  const { showToast } = useToast();

  const handleRemove = (id) => { removeFromCart(id); showToast("Item removed from your bag"); };

  if (!cartItems.length) return (
    <section className="container section-space cart-page">
      <div className="page-title-block"><span className="eyebrow">YOUR SELECTION</span><h1>Your bag.</h1><p>A good choice is worth taking your time over.</p></div>
      <div className="empty-cart"><div className="empty-cart-icon"><i className="bi bi-bag"></i></div><h2>Your bag is taking a little break.</h2><p>Explore the collection and add something considered.</p><Link to="/products" className="btn btn-dark rounded-pill px-4 py-2">Explore products <i className="bi bi-arrow-up-right ms-2"></i></Link></div>
    </section>
  );

  return (
    <section className="container section-space cart-page">
      <div className="page-title-block"><span className="eyebrow">YOUR SELECTION</span><h1>Your bag<span className="title-count"> ({cartItems.length})</span></h1><p>Review your selection before moving ahead.</p></div>
      <div className="row g-5 align-items-start">
        <div className="col-lg-8">
          <div className="cart-list-header"><span>PRODUCT</span><span>AMOUNT</span></div>
          <div className="cart-list">{cartItems.map((item) => <CartItem key={item.id} item={item} onQuantityChange={updateQuantity} onRemove={handleRemove} />)}</div>
          <div className="d-flex flex-wrap justify-content-between gap-3 mt-4"><Link to="/products" className="back-link"><i className="bi bi-arrow-left me-2"></i>Continue shopping</Link><button className="remove-link" onClick={() => { clearCart(); showToast("Your bag has been cleared"); }}>Clear bag</button></div>
        </div>
        <div className="col-lg-4"><aside className="order-summary">
          <span className="eyebrow">ORDER SUMMARY</span><h2>At a glance.</h2>
          <div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <div className="summary-line"><span>Estimated tax <small>(5%)</small></span><strong>{money(tax)}</strong></div>
          <div className="summary-line shipping-line"><span>Shipping</span><strong>Calculated later</strong></div>
          <div className="summary-total"><span>Estimated total</span><strong>{money(total)}</strong></div>
          <p className="summary-disclaimer">Tax is an illustrative estimate for this demo. Shipping and payment are not connected.</p>
          <button className="btn btn-dark btn-lg rounded-pill w-100 mt-3" onClick={() => showToast("Checkout is a demo feature — no payment was taken.", "success")}>Continue to checkout <i className="bi bi-arrow-right ms-2"></i></button>
          <div className="secure-note"><i className="bi bi-shield-check"></i> A clear, considered checkout experience</div>
        </aside></div>
      </div>
    </section>
  );
}