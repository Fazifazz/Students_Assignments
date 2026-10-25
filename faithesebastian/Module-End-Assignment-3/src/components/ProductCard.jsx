import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { showCartAddedToast, showCartLimitToast } from "../utils/cartAlerts.js";

export default function ProductCard({ product }) {
  const location = useLocation();
  const { addItem, items } = useCart();
  const quantity = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const atLimit = quantity >= 10;
  const returnTo =
    location.pathname === "/products"
      ? `${location.pathname}${location.search}`
      : `/products?category=${encodeURIComponent(product.category)}`;

  function handleAddToCart() {
    if (atLimit) {
      showCartLimitToast();
      return;
    }
    addItem(product);
    showCartAddedToast(product.name);
  }

  return (
    <article className="product-card">
      <Link
        className="product-card-link"
        to={`/products/${encodeURIComponent(product.id)}`}
        state={{ returnTo }}
        aria-label={`View ${product.name}`}
      >
        <div className="product-image">
          <img
            src={product.imageUrl || "/product-placeholder.svg"}
            alt={product.name}
            loading="lazy"
          />
        </div>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          {product.rating != null && (
            <span className="rating" aria-label={`Rating ${product.rating} out of 5`}>
              ★ {product.rating}
            </span>
          )}
          <div className="price">
            {product.originalPrice != null && product.originalPrice > product.price && (
              <span className="old-price">{formatCurrency(product.originalPrice)}</span>
            )}
            <span className="new-price">{formatCurrency(product.price)}</span>
          </div>
        </div>
      </Link>
      <button
        className="add-cart"
        type="button"
        onClick={handleAddToCart}
      >
        <i className="bi bi-cart-plus" aria-hidden="true" />
        {atLimit ? "Quantity limit reached" : "Add to Cart"}
      </button>
    </article>
  );
}
