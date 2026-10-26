import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, loading, error }) {
  if (loading) {
    return (
      <div className="loading-state" role="status">
        <span className="spinner" aria-hidden="true" />
        <span>Loading products…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state" role="alert">
        <i className="bi bi-cloud-slash" aria-hidden="true" />
        <p>{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return <p className="no-products">No products match your selection.</p>;
  }

  return (
    <div className="product-grid" aria-live="polite">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
