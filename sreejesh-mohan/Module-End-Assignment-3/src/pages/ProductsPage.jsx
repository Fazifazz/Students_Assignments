import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  // API State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Synchronize category and search state when URL searchParams change
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    const urlSearch = searchParams.get('search') || '';
    setSelectedCategory(urlCategory);
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Fetch products with Axios
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/products.json');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products via Axios:', err);
      setError('Unable to load products. Please verify your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Clear category filter (revert to 'All')
  const handleClearCategory = () => {
    setSelectedCategory('All');
    searchParams.delete('category');
    setSearchParams(searchParams, { replace: true });
  };

  // Reset all filters
  const handleResetAllFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setSortBy('featured');
    setPriceRange('all');
    setSelectedBrand('all');
    setMinRating(0);
    setOnSaleOnly(false);
    setInStockOnly(false);
    searchParams.delete('category');
    searchParams.delete('search');
    setSearchParams(searchParams, { replace: true });
  };

  // Compute available brands based on selectedCategory
  const availableBrands = useMemo(() => {
    const pool =
      selectedCategory && selectedCategory !== 'All'
        ? products.filter(
            (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
          )
        : products;

    const brandSet = new Set(pool.map((p) => p.brand).filter(Boolean));
    return Array.from(brandSet).sort();
  }, [products, selectedCategory]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search keyword
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.brand && p.brand.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // Filter by Price Range
    if (priceRange === 'under-2000') {
      result = result.filter((p) => p.price < 2000);
    } else if (priceRange === '2000-10000') {
      result = result.filter((p) => p.price >= 2000 && p.price <= 10000);
    } else if (priceRange === '10000-40000') {
      result = result.filter((p) => p.price > 10000 && p.price <= 40000);
    } else if (priceRange === 'above-40000') {
      result = result.filter((p) => p.price > 40000);
    }

    // Filter by Brand
    if (selectedBrand && selectedBrand !== 'all') {
      result = result.filter(
        (p) => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Filter by Customer Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Filter by Deals / On Sale Only
    if (onSaleOnly) {
      result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Filter by In-Stock Only
    if (inStockOnly) {
      result = result.filter((p) => (p.stock !== undefined ? p.stock > 0 : true));
    }

    // Sort products
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    products,
    selectedCategory,
    searchTerm,
    priceRange,
    selectedBrand,
    minRating,
    onSaleOnly,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div className="products-page section-padding">
      <div className="container container-wide">
        {/* Page Header Banner */}
        <div className="page-header-banner">
          <div>
            <h1 className="page-heading">
              {selectedCategory && selectedCategory !== 'All'
                ? `${selectedCategory} Collection`
                : 'Our Products Collection'}
            </h1>
            <p className="page-subheading">
              {selectedCategory && selectedCategory !== 'All'
                ? `Explore authentic branded ${selectedCategory.toLowerCase()} with manufacturer warranty and fast delivery.`
                : 'Browse premium tech essentials, stylish fashion, footwear, and curated books.'}
            </p>
          </div>
        </div>

        {/* Specific Filters & Controls Component (No duplicate categories) */}
        <CategoryFilter
          activeCategory={selectedCategory}
          onClearCategory={handleClearCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          availableBrands={availableBrands}
          minRating={minRating}
          onRatingChange={setMinRating}
          onSaleOnly={onSaleOnly}
          onSaleToggle={() => setOnSaleOnly((prev) => !prev)}
          inStockOnly={inStockOnly}
          inStockToggle={() => setInStockOnly((prev) => !prev)}
          onResetAll={handleResetAllFilters}
          totalResults={loading || error ? undefined : filteredProducts.length}
        />

        {/* Dynamic States: Loading / Error / Product Grid */}
        {loading ? (
          <div className="loading-state-container">
            <Loader2 size={40} className="spinner-icon" />
            <h3>Fetching Products...</h3>
            <p>Please wait while we load our catalog.</p>
          </div>
        ) : error ? (
          <div className="error-state-container">
            <div className="error-icon-circle">
              <AlertTriangle size={36} />
            </div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button type="button" className="btn-retry" onClick={fetchProducts}>
              <RefreshCw size={16} />
              <span>Retry Fetch</span>
            </button>
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onResetFilters={handleResetAllFilters}
          />
        )}
      </div>
    </div>
  );
}
