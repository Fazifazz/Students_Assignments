import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { showCartAddedToast, showCartLimitToast } from "../utils/cartAlerts.js";

const categoryDescriptions = {
  Electronics:
    "Explore this technology pick from the ShopNest collection. Compare its price and customer rating with similar electronics below.",
  Clothing:
    "Discover a new wardrobe addition from ShopNest. Browse related styles below and compare current prices and customer ratings.",
  Footwear:
    "Explore this footwear pick from ShopNest. Find more options in the same collection below.",
  Books:
    "Add something new to your reading list with this ShopNest book. Browse more titles from the collection below.",
  Accessories:
    "Discover an accessory from the ShopNest collection. Explore more complementary finds below.",
  Home:
    "Find a new addition for your home in the ShopNest collection. Browse other home picks below.",
  Deals:
    "Explore this ShopNest deal while it is featured in our offers collection. See the current price and savings above.",
  "New Arrivals":
    "Take a look at one of ShopNest’s new arrivals. Browse other recently added finds below.",
  Offers:
    "Discover this featured ShopNest offer. Check the current price and savings above, and explore more offers below.",
};

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState("");
  const location = useLocation();
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const { addItem, items } = useCart();
  const product = products.find((item) => item.id === id);
  const cartQuantity =
    items.find((item) => item.product.id === id)?.quantity ?? 0;
  const continueShoppingTo =
    typeof location.state?.returnTo === "string" &&
    location.state.returnTo.startsWith("/products")
      ? location.state.returnTo
      : `/products?category=${encodeURIComponent(product?.category || "")}`;
  const relatedProducts = products
    .filter(
      (item) => item.id !== id && item.category === product?.category,
    )
    .slice(0, 8);
  const galleryImages = product
    ? [
        ...new Set(
          [
            product.imageUrl,
            ...(Array.isArray(product.images) ? product.images : []),
          ].filter((image) => typeof image === "string" && image.trim()),
        ),
      ]
    : [];
  const displayedImage = galleryImages.includes(activeImage)
    ? activeImage
    : galleryImages[0] || "/product-placeholder.svg";
  const savings =
    product?.originalPrice > product?.price
      ? product.originalPrice - product.price
      : 0;
  const savingsPercent = savings
    ? Math.round((savings / product.originalPrice) * 100)
    : 0;
  const productDescription =
    product?.description ||
    categoryDescriptions[product?.category] ||
    `Discover ${product?.name}, a find from the ShopNest collection. Check its current price and customer rating above, then explore similar products below.`;
  const productHighlights = Array.isArray(product?.highlights)
    ? product.highlights.filter(
        (highlight) => typeof highlight === "string" && highlight.trim(),
      )
    : [];
  const reviews = Array.isArray(product?.reviews)
    ? product.reviews.filter(
      (review) =>
        review &&
        typeof review.comment === "string" &&
        review.comment.trim() &&
        Number.isFinite(Number(review.rating)) &&
        Number(review.rating) >= 1 &&
        Number(review.rating) <= 5,
    )
    : [];
  const availability = product?.availability;
  const stockQuantity =
    typeof availability?.quantity === "number"
    ? availability.quantity
    : typeof product?.stockQuantity === "number"
      ? product.stockQuantity
      : null;
  const availabilityStatus =
    typeof availability === "string"
    ? availability
    : typeof availability?.status === "string"
      ? availability.status
      : typeof availability?.inStock === "boolean"
        ? availability.inStock
          ? "In stock"
          : "Out of stock"
        : typeof product?.inStock === "boolean"
          ? product.inStock
            ? "In stock"
            : "Out of stock"
          : stockQuantity != null
            ? stockQuantity > 0
              ? "In stock"
              : "Out of stock"
            : null;
  const isOutOfStock =
    /out of stock|unavailable|sold out/i.test(availabilityStatus || "") ||
    availability?.inStock === false ||
    product?.inStock === false ||
    stockQuantity === 0;
  const specifications =
    product?.specifications &&
    typeof product.specifications === "object" &&
    !Array.isArray(product.specifications)
      ? Object.entries(product.specifications).filter(
          ([, value]) =>
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean",
        )
      : [];

  function handleAddToCart() {
    if (cartQuantity >= 10) {
      showCartLimitToast();
      return;
    }
    addItem(product);
    showCartAddedToast(product.name);
  }

  if (loading) {
    return (
      <div className="container page-section">
        <div className="loading-state" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading product…
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container page-section"><div className="error-state" role="alert">{error}</div></div>;
  }

  if (!product) {
    return (
      <section className="container page-section not-found">
        <h1>Product not found</h1>
        <p>This product may no longer be available.</p>
        <Link className="button button-primary" to="/products">Browse products</Link>
      </section>
    );
  }

  return (
    <section className="container page-section">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span aria-hidden="true">/</span>
        <Link to={continueShoppingTo}>Products</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <article className="product-detail">
        <div className="product-detail-image">
          <div className="product-image-stage">
            <img src={displayedImage} alt={product.name} />
          </div>
          {galleryImages.length > 1 && (
            <div className="product-image-thumbnails" aria-label="Product images">
              {galleryImages.map((image, index) => (
                <button
                  className={`product-image-thumbnail${displayedImage === image ? " active" : ""}`}
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  aria-label={`Show product image ${index + 1}`}
                  aria-pressed={displayedImage === image}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          {product.rating != null && (
            <p className="detail-rating">★ {product.rating} <span>Customer rating</span></p>
          )}
          <div className="detail-price">
            <strong>{formatCurrency(product.price)}</strong>
            {product.originalPrice != null && product.originalPrice > product.price && (
              <del>{formatCurrency(product.originalPrice)}</del>
            )}
          </div>
          {savings > 0 && (
            <span className="detail-savings">
              <i className="bi bi-tag-fill" aria-hidden="true" />
              Save {formatCurrency(savings)} ({savingsPercent}% off)
            </span>
          )}
          <p className="product-description">
            {productDescription}
          </p>
          <div className="product-availability" aria-live="polite">
            <i
              className={`bi ${isOutOfStock ? "bi-x-circle" : availabilityStatus ? "bi-check-circle" : "bi-info-circle"}`}
              aria-hidden="true"
            />
            <span>
              {availabilityStatus || "Availability information not provided"}
              {stockQuantity != null && stockQuantity > 0
                ? ` · ${stockQuantity} available`
                : ""}
            </span>
          </div>
          <div className="product-detail-actions">
            <button
              className="button button-primary detail-add"
              type="button"
              onClick={handleAddToCart}
              disabled={cartQuantity >= 10 || isOutOfStock}
            >
              <i className="bi bi-cart-plus" aria-hidden="true" />
              {isOutOfStock
                ? "Out of Stock"
                : cartQuantity >= 10
                  ? "Quantity limit reached"
                  : "Add to Cart"}
            </button>
            <Link className="button button-secondary detail-continue" to={continueShoppingTo}>
              Continue shopping
            </Link>
          </div>
          <p className="detail-note">Your cart is saved on this device.</p>
        </div>
      </article>
      <section className="product-information" aria-labelledby="product-information-title">
        <div className="product-information-heading">
          <span className="eyebrow contact-eyebrow">Product information</span>
          <h2 id="product-information-title">A little more about this find</h2>
          <p>{productDescription}</p>
        </div>
        {productHighlights.length > 0 && (
          <div className="product-highlights">
            <h3>Highlights</h3>
            <ul>
              {productHighlights.map((highlight) => (
                <li key={highlight}>
                  <i className="bi bi-check-circle-fill" aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}
        <dl className="product-facts">
          {product.brand && (
            <div>
              <dt>Brand</dt>
              <dd>{product.brand}</dd>
            </div>
          )}
          <div>
            <dt>Category</dt>
            <dd>{product.category}</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>{availabilityStatus || "Not provided"}</dd>
          </div>
          {stockQuantity != null && (
            <div>
              <dt>Stock quantity</dt>
              <dd>{stockQuantity} {stockQuantity === 1 ? "unit" : "units"}</dd>
            </div>
          )}
          <div>
            <dt>Current price</dt>
            <dd>{formatCurrency(product.price)}</dd>
          </div>
          {product.originalPrice != null && product.originalPrice > product.price && (
            <div>
              <dt>Original price</dt>
              <dd>{formatCurrency(product.originalPrice)}</dd>
            </div>
          )}
          {product.rating != null && (
            <div>
              <dt>Customer rating</dt>
              <dd className="fact-rating">★ {product.rating} <span>out of 5</span></dd>
            </div>
          )}
          {specifications.map(([name, value]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{String(value)}</dd>
            </div>
          ))}
        </dl>
        {specifications.length === 0 && (
          <p className="product-data-note">
            Detailed specifications have not been provided for this product.
          </p>
        )}
        <div className="product-promise">
          <div>
            <i className="bi bi-heart" aria-hidden="true" />
            <span><strong>Picked for you</strong> Explore more products from this collection.</span>
          </div>
          <div>
            <i className="bi bi-bag-check" aria-hidden="true" />
            <span><strong>Easy cart updates</strong> Change quantities or remove items from your cart anytime.</span>
          </div>
          <div>
            <i className="bi bi-receipt" aria-hidden="true" />
            <span><strong>Clear estimate</strong> Review your subtotal and estimated tax in the cart.</span>
          </div>
        </div>
      </section>
      <section className="product-reviews" aria-labelledby="product-reviews-title">
        <div className="reviews-heading">
          <div>
            <span className="eyebrow contact-eyebrow">Customer feedback</span>
            <h2 id="product-reviews-title">Reviews &amp; ratings</h2>
          </div>
          {product.rating != null && (
            <span className="reviews-average">
              <i className="bi bi-star-fill" aria-hidden="true" />
              {product.rating} <small>out of 5</small>
            </span>
          )}
        </div>
        {reviews.length ? (
          <div className="review-list">
            {reviews.map((review, index) => (
              <article
                className="review-card"
                key={review.id || `${review.name || "review"}-${index}`}
              >
                <div className="review-card-heading">
                  <strong>{review.name || review.author || "ShopNest customer"}</strong>
                  <span
                    className="review-rating"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(Math.round(Number(review.rating)))}
                    <span>{"★".repeat(5 - Math.round(Number(review.rating)))}</span>
                  </span>
                </div>
                {review.date && <time dateTime={review.date}>{review.date}</time>}
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="reviews-empty">
            No written reviews have been provided for this product yet.
          </p>
        )}
      </section>
      {relatedProducts.length > 0 && (
        <section className="related-products" aria-labelledby="related-products-title">
          <div className="related-products-heading">
            <div>
              <span className="eyebrow contact-eyebrow">Keep exploring</span>
              <h2 id="related-products-title">More in {product.category}</h2>
            </div>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
              View category <i className="bi bi-arrow-right" aria-hidden="true" />
            </Link>
          </div>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
