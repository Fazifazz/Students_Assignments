import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function ProductDetail({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => String(item.id) === id);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  if (!product) return <section className="container section-space text-center"><div className="empty-state"><i className="bi bi-box-seam"></i><h1>Product not found</h1><p>This item may no longer be available.</p><Link className="btn btn-dark rounded-pill px-4" to="/products">Return to products</Link></div></section>;

  const saved = wishlist.includes(product.id);
  const handleAdd = () => { addToCart(product); showToast("Added to your bag"); };

  return (
    <section className="container section-space detail-page">
      <nav aria-label="breadcrumb"><ol className="breadcrumb small"><li className="breadcrumb-item"><Link to="/">Home</Link></li><li className="breadcrumb-item"><Link to="/products">Products</Link></li><li className="breadcrumb-item active" aria-current="page">{product.category}</li></ol></nav>
      <div className="row g-5 align-items-start mt-1">
        <div className="col-lg-6"><div className="detail-image-frame"><img src={product.image} alt={product.title} /></div></div>
        <div className="col-lg-6 detail-copy">
          <span className="eyebrow">{product.category.toUpperCase()}</span>
          <h1>{product.title}</h1>
          <div className="detail-rating"><span className="stars">★★★★★</span><strong>{product.rating.toFixed(1)}</strong><span className="text-muted">({product.reviews} sample ratings)</span></div>
          <div className="detail-price">{money(product.price)}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-divider"></div>
          <h2 className="detail-section-label">Product highlights</h2>
          <div className="feature-list">{product.features.map((feature) => <div key={feature}><i className="bi bi-check2-circle"></i><span>{feature}</span></div>)}</div>
          <div className="spec-grid">
            <div><span>Category</span><strong>{product.category}</strong></div>
            <div><span>Colour / finish</span><strong>{product.color}</strong></div>
            <div><span>Material</span><strong>{product.material}</strong></div>
            <div><span>Availability</span><strong className="availability"><i className="bi bi-circle-fill"></i> Demo catalogue</strong></div>
          </div>
          <div className="detail-actions">
            <button className="btn btn-dark btn-lg rounded-pill flex-grow-1" onClick={handleAdd}><i className="bi bi-bag-plus me-2"></i>Add to bag</button>
            <button className={`detail-wishlist ${saved ? "saved" : ""}`} onClick={() => { toggleWishlist(product.id); showToast(saved ? "Removed from wishlist" : "Saved to wishlist"); }} aria-label="Toggle wishlist"><i className={`bi ${saved ? "bi-heart-fill" : "bi-heart"}`}></i></button>
          </div>
          <div className="detail-note"><i className="bi bi-info-circle"></i><span>Ratings and reviews are illustrative sample data for this assignment demo.</span></div>
          <button className="back-link mt-4" onClick={() => navigate(-1)}><i className="bi bi-arrow-left me-2"></i>Back to browsing</button>
        </div>
      </div>
    </section>
  );
}