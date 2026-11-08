import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">

      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p>{product.category}</p>

        <p>₹{product.price}</p>

        <p>⭐ {product.rating}</p>

        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>

    </div>
  );
}

export default ProductCard;