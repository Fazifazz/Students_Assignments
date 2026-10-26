import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products.length) {
    return <div className="empty-state"><i className="bi bi-search"></i><h3>No matching products</h3><p>Try a different search or category.</p></div>;
  }
  return <div className="row g-3 g-md-4">{products.map((product) => <div className="col-6 col-lg-4 col-xl-3" key={product.id}><ProductCard product={product} /></div>)}</div>;
}