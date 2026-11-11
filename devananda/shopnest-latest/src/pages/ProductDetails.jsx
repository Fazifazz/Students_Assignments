import allProducts from '../products.json';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  setLoading(true);
  setError('');

  const foundProduct = allProducts.find(
    (item) => String(item.id) === String(id)
  );

  if (foundProduct) {
    setProduct(foundProduct);
  } else {
    setError('Product not found.');
  }

  setLoading(false);
}, [id]);

  if (loading) {
    return <main className="page-container">Loading product...</main>;
  }

  if (error) {
    return (
      <main className="page-container">
        <p className="error-message">{error}</p>
      </main>
    );
  }

  if (!product) {
    return <main className="page-container">Product not found.</main>;
  }

  return (
    <main className="page-container details-layout">
       <img
  src={product.imageUrl ? `/${product.imageUrl.replace(/^\/+/, '')}` : product.image}
  alt={product.name || product.title}
/>

      <div>
        <p className="product-category">{product.category}</p>
        <h1>{product.title}</h1>
        <h2>₹{Number(product.price).toLocaleString('en-IN')}</h2>
        <p>{product.description}</p>

        <button
          className="button"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>

        <Link to="/products" className="button secondary">
          Back to Products
        </Link>
      </div>
    </main>
  );
}