import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  if (products.length === 0) {
    return <p className="no-data w-100 p-4">No products found.</p>;
  }

  return (
    <div className="row g-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id ?? product._id ?? `${product.name || product.title}-${index}`}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
