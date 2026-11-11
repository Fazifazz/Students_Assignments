
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const {
    addToCart,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useCart();

  const favorite = isFavorite(product.id);

  function handleFavorite() {
    if (favorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  }

  const image = product.image || (
    product.imageUrl
      ? `/${product.imageUrl.replace(/^\/+/, '')}`
      : ''
  );

  const name = product.title || product.name;

  return (
    <article
  className="product-card"
  style={{ position: 'relative', overflow: 'hidden' }}
>
      <button
        type="button"
        className="product-favorite-button"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 5
        }}
        onClick={handleFavorite}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '❤️' : '🤍'}
      </button>

      <Link to={`/products/${product.id}`} className="product-image">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}
      </Link>

      <div className="product-info">
        <h3>{name}</h3>

        <p className="product-price">
          ₹{Number(product.price).toLocaleString('en-IN')}
        </p>

        {product.originalPrice && (
          <p className="original-price">
            <del>
              ₹{Number(product.originalPrice).toLocaleString('en-IN')}
            </del>
          </p>
        )}

        <p className="product-rating">
          {'★'.repeat(Number(product.rating) || 0)}
        </p>

        <div className="product-actions">
          <Link
            to={`/products/${product.id}`}
            className="button secondary"
          >
            Details
          </Link>

          <button
            type="button"
            className="button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

