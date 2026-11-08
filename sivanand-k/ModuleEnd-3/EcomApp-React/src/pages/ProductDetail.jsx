
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const products = await getProducts();

        const selectedProduct = products.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedProduct) {
          setError("Sorry, this product could not be found.");
        } else {
          setProduct(selectedProduct);
        }
      } catch (err) {
        console.error("Product Detail API Error:", err);
        setError("Unable to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="detail-message">
        <h2>Loading product details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-message">
        <h2>{error}</h2>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : 0;

  return (
    <div className="detail-page">

      <div className="detail-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="detail-container">

        {/* Product Image */}

        <div className="detail-image-section">
          <div className="detail-image-box">
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => {
                console.error("Image failed to load:", product.imageUrl);
                e.currentTarget.src = "/images/hero-placeholder.png";
              }}
            />
          </div>
        </div>

        {/* Product Information */}

        <div className="detail-info">

          <span className="detail-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="detail-rating">
            <span>⭐ {product.rating}</span>
            <span className="rating-label">
              Customer Rating
            </span>
          </div>

          <div className="detail-price">
            <span className="current-price">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.originalPrice && (
              <>
                <span className="original-price">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>

                <span className="discount-badge">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="detail-description">
            {product.description ||
              "A quality product designed for your everyday needs."}
          </p>

          <div className="detail-actions">
            <button
              className="detail-add-button"
              onClick={handleAddToCart}
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>

            <Link to="/cart" className="detail-cart-link">
              View Cart
            </Link>
          </div>

          {added && (
            <p className="added-message">
              Product successfully added to your cart!
            </p>
          )}

          <div className="detail-delivery">
            <p>✓ Quality product</p>
            <p>✓ Secure shopping experience</p>
            <p>✓ Easy cart management</p>
          </div>

        </div>
      </div>

      {/* Product Description */}

      <section className="detail-extra">

        <div className="extra-heading">
          <h2>Product Overview</h2>
          <p>Everything you need to know about this product.</p>
        </div>

        <div className="overview-box">
          <h3>About this product</h3>
          <p>{product.description}</p>

          <h3>Key Features</h3>

          <ul className="feature-list">
            {product.features?.map((feature, index) => (
              <li key={index}>
                <span>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications */}

        <div className="specification-section">

          <h2>Product Specifications</h2>

          <div className="specification-table">

            {Object.entries(product.details || {}).map(
              ([key, value]) => (
                <div className="specification-row" key={key}>
                  <span className="spec-label">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>

                  <span className="spec-value">
                    {value}
                  </span>
                </div>
              )
            )}

          </div>
        </div>

        <Link to="/products" className="back-products">
          ← Continue Shopping
        </Link>

      </section>

      {/* Page Styling */}

      <style>{`
        .detail-page {
          max-width: 1250px;
          margin: 0 auto;
          padding: 30px 25px 60px;
        }

        .detail-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin-bottom: 30px;
          color: #777;
          font-size: 14px;
        }

        .detail-breadcrumb a {
          color: #2563eb;
          text-decoration: none;
        }

        .detail-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 55px;
          align-items: start;
        }

        .detail-image-box {
          background: #fff;
          border-radius: 14px;
          padding: 25px;
          min-height: 430px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 15px rgba(0,0,0,0.06);
        }

        .detail-image-box img {
          width: 100%;
          max-height: 380px;
          object-fit: contain;
          display: block;
        }

        .detail-category {
          display: inline-block;
          color: #2563eb;
          background: #eff6ff;
          padding: 7px 13px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .detail-info h1 {
          text-align: left;
          font-size: 32px;
          margin: 18px 0 12px;
          color: #222;
        }

        .detail-rating {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
          font-size: 15px;
        }

        .rating-label {
          color: #777;
          font-size: 13px;
        }

        .detail-price {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .current-price {
          font-size: 30px;
          font-weight: 700;
          color: #222;
        }

        .original-price {
          color: #888;
          text-decoration: line-through;
          font-size: 17px;
        }

        .discount-badge {
          background: #dcfce7;
          color: #15803d;
          padding: 6px 10px;
          border-radius: 5px;
          font-size: 13px;
          font-weight: 600;
        }

        .detail-description {
          color: #666;
          line-height: 1.8;
          font-size: 15px;
          margin-bottom: 25px;
        }

        .detail-actions {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .detail-add-button {
          background: #2563eb;
          color: white;
          padding: 14px 28px;
          border-radius: 7px;
          font-size: 15px;
          font-weight: 600;
          transition: 0.2s;
        }

        .detail-add-button:hover {
          background: #1d4ed8;
        }

        .detail-cart-link {
          padding: 13px 24px;
          border: 1px solid #2563eb;
          border-radius: 7px;
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .added-message {
          color: #15803d;
          margin-top: 12px;
          font-size: 14px;
        }

        .detail-delivery {
          margin-top: 25px;
          padding: 18px;
          background: #f0fdf4;
          border-radius: 8px;
          line-height: 2;
          color: #166534;
          font-size: 14px;
        }

        .detail-extra {
          margin-top: 65px;
        }

        .extra-heading {
          margin-bottom: 25px;
        }

        .extra-heading h2,
        .specification-section h2 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #222;
        }

        .extra-heading p {
          color: #777;
        }

        .overview-box {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          margin-bottom: 35px;
        }

        .overview-box h3 {
          margin-bottom: 14px;
          margin-top: 10px;
        }

        .overview-box p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 25px;
        }

        .feature-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          padding: 0;
        }

        .feature-list li {
          display: flex;
          gap: 10px;
          color: #555;
          font-size: 14px;
        }

        .feature-list li span {
          color: #16a34a;
          font-weight: bold;
        }

        .specification-section {
          margin-bottom: 35px;
        }

        .specification-table {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #eee;
        }

        .specification-row {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          gap: 15px;
        }

        .specification-row:last-child {
          border-bottom: none;
        }

        .spec-label {
          color: #777;
          text-transform: capitalize;
        }

        .spec-value {
          color: #222;
          font-weight: 500;
        }

        .back-products {
          display: inline-block;
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
          margin-top: 10px;
        }

        .detail-message {
          text-align: center;
          padding: 100px 20px;
        }

        .detail-message a {
          display: inline-block;
          margin-top: 20px;
          color: #2563eb;
        }

        @media (max-width: 768px) {
          .detail-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .detail-image-box {
            min-height: 300px;
          }

          .detail-image-box img {
            max-height: 270px;
          }

          .detail-info h1 {
            font-size: 26px;
          }

          .feature-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .detail-page {
            padding: 20px 15px 40px;
          }

          .detail-image-box {
            min-height: 250px;
          }

          .detail-actions {
            flex-direction: column;
          }

          .detail-actions button,
          .detail-actions a {
            text-align: center;
            width: 100%;
          }

          .specification-row {
            grid-template-columns: 1fr 1.2fr;
            padding: 13px;
            font-size: 13px;
          }

          .current-price {
            font-size: 25px;
          }
        }
      `}</style>

    </div>
  );
}

export default ProductDetail;
