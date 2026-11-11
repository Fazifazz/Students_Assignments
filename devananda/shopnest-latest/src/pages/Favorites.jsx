import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Favorites() {
  const { favorites } = useCart();

  return (
    <main className="section">
      <h1>My Favorites ❤️</h1>

      {favorites.length === 0 ? (
        <p>No favorite products added yet.</p>
      ) : (
        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}