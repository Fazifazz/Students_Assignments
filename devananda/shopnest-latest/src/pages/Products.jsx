
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import productsUrl from '../products.json?url';
import ProductGrid from '../components/ProductGrid.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';

export default function Products() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );

  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
  setSelectedCategory(searchParams.get('category') || 'All');
  setSearch(searchParams.get('search') || '');
}, [searchParams]);

  useEffect(() => {
    axios.get(productsUrl)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      product.category === selectedCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="section">
      <h1>All Products</h1>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <CategoryFilter
            categories={categories}
            selected={selectedCategory === 'All' ? 'all' : selectedCategory}
            onSelect={(category) =>
              setSelectedCategory(category === 'all' ? 'All' : category)
            }
          />

          <ProductGrid products={filteredProducts} />
        </>
      )}
    </main>
  );
}

