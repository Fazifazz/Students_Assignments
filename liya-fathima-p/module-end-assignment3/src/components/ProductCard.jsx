
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="product-card">

        <Link
          to={`/products/${product.id}`}
          className="text-decoration-none text-dark"
        >
          <div className="product-image-wrap">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
          </div>
        </Link>

        <div className="product-details">

          <span className="product-category">
            {product.category}
          </span>

          <h3 className="product-name">
            <Link
              to={`/products/${product.id}`}
              className="text-decoration-none text-dark"
            >
              {product.name}
            </Link>
          </h3>

          <div className="rating">
            <i className="bi bi-star-fill"></i>
            <span>{product.rating}</span>
          </div>

          <div className="price-row">
            <span className="product-price">
              ₹{Number(product.price).toFixed(2)}
            </span>

            <span className="original-price">
              ₹{Number(product.originalPrice).toFixed(2)}
            </span>
          </div>

          <button
            className="add-cart-btn"
            onClick={() => addToCart(product)}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Add to Cart
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;
