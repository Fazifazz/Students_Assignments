
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductDetail({ products, loading }) {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find(
    (item) => String(item.id) === id
  );

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-dark mt-3">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <section className="container py-5">
      <Link to="/products" className="text-decoration-none">
        ← Back to Products
      </Link>

      <div className="row align-items-center g-5 mt-2">

        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-6">

          <span className="product-category">
            {product.category}
          </span>

          <h1 className="mt-3">{product.name}</h1>

          <p className="rating">
            ⭐ {product.rating}
          </p>

          <h3 className="product-price">
            ₹{Number(product.price).toFixed(2)}
          </h3>

          <p className="text-muted">
            Original Price: ₹
            {Number(product.originalPrice).toFixed(2)}
          </p>

          <p>
            Explore this product from our ShopNest collection.
          </p>

          <button
            className="add-cart-btn"
            onClick={() => addToCart(product)}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Add to Cart
          </button>

        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
