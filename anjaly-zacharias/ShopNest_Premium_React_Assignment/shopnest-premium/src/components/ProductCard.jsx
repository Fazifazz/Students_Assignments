import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const saved = wishlist.includes(product.id);

  const handleAdd = () => {
    addToCart(product);
    showToast(`${product.title} added to your bag`);
  };

  return (
    <article className="product-card h-100">
      <div className="product-image-wrap">
        <Link to={`/products/${product.id}`} className="product-image-link" aria-label={`View ${product.title}`}>
          <img src={product.image} alt={product.title} className="product-image" loading="lazy" />
        </Link>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className={`wishlist-btn ${saved ? "saved" : ""}`} onClick={() => { toggleWishlist(product.id); showToast(saved ? "Removed from wishlist" : "Saved to wishlist"); }} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}>
          <i className={`bi ${saved ? "bi-heart-fill" : "bi-heart"}`}></i>
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-category">{product.category}</div>
        <h3 className="product-title"><Link to={`/products/${product.id}`}>{product.title}</Link></h3>
        <div className="rating-line"><span className="stars" aria-label={`${product.rating} out of 5 stars`}>★</span><span className="rating-value">{product.rating.toFixed(1)}</span><span className="review-count">({product.reviews})</span></div>
        <div className="product-card-footer">
          <span className="product-price">{money(product.price)}</span>
          <button className="quick-add" onClick={handleAdd} aria-label={`Add ${product.title} to cart`}><i className="bi bi-plus-lg"></i></button>
        </div>
      </div>
    </article>
  );
}