
import { Link } from 'react-router-dom';

export default function Categories() {
  const categories = [
    'Electronics',
    'Clothing',
    'Footwear',
    'Bags',
    'Accessories',
    'Skincare',
    'Perfumes',
    'Sunglasses',
    'Jewellery',
  ];

  return (
    <main className="section">
      <h1>Shop by Category</h1>

      <div className="category-grid">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/products?category=${encodeURIComponent(category)}`}
            className="category-card"
          >
            <h3>{category}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
}