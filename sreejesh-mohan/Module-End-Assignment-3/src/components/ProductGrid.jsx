import React from 'react';
import ProductCard from './ProductCard';
import { SearchX, RotateCcw } from 'lucide-react';

export default function ProductGrid({ products, onResetFilters }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-products-state">
        <div className="empty-icon-wrap">
          <SearchX size={44} />
        </div>
        <h3>No Products Found</h3>
        <p>We couldn't find any items matching your selected category and search keywords.</p>
        {onResetFilters && (
          <button type="button" className="btn-reset-filters" onClick={onResetFilters}>
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
