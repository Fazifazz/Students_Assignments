
import { useState } from "react";
import { useLocation } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";

function Products({ products, loading, error }) {
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState(
    location.state?.category || "All"
  );

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  return (
    <section id="products-section" className="py-5">
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

        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {loading && (
          <div className="loading-message text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading products...</p>
          </div>
        )}

        {error && (
          <div className="error-message text-center py-5">
            <h3>Unable to load products</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <ProductGrid products={filteredProducts} />
        )}

      </div>
    </section>
  );
}

export default Products;
