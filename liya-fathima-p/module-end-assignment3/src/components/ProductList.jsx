import ProductCard from "./ProductCard";

function ProductList({
  products,
  activeCategory,
  setActiveCategory,
  onAddToCart,
  loading,
  error
}) {
  const categories = [
    "All",
    "Electronics",
    "Clothing",
    "Footwear",
    "Books"
  ];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  return (
    <section id="products-section">
      <div className="container">

        <div className="section-heading">
          <p className="section-eyebrow">SHOP OUR COLLECTION</p>
          <h2>
            Popular <span className="head-span">Collections</span>
          </h2>
          <p className="section-description">
            Explore our latest products and find something made for you.
          </p>
        </div>

        <div className="filter-bar">
          <div className="category-buttons" role="group">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="loading-message">
            <div className="spinner-border" role="status"></div>
            <p>Loading products...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-circle"></i>
            <h3>Unable to load products</h3>
            <p>Please try again later.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <i className="bi bi-search"></i>
                <h3>No products found</h3>
                <p>Try a different search or category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProductList;