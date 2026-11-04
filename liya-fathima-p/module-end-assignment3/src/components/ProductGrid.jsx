
import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <div className="no-products text-center py-5">
        <i className="bi bi-search"></i>
        <h3>No products found</h3>
        <p>Try selecting another category.</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
