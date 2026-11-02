import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import useCart from "../hooks/useCart";

const productImages = import.meta.glob("../assets/images/*", {
  eager: true,
  import: "default",
});

function resolveImage(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    return "";
  }

  if (/^(https?:|data:|blob:)/i.test(imagePath)) {
    return imagePath;
  }

  const filename = imagePath.split(/[\\/]/).pop();
  return productImages[`../assets/images/${filename}`] || imagePath;
}

function formatLabel(label) {
  return label
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displaySpecification(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function ProductDetailPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedMessage, setAddedMessage] = useState("");
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setError("");
      setNotFound(false);
      setProduct(null);
      setQuantity(1);
      setSelectedImageIndex(0);
      setAddedMessage("");
      setIsAddedToCart(false);

      try {
        const response = await api.get(`/products/${productId}`, {
          signal: controller.signal,
        });

        if (!response.data || typeof response.data !== "object") {
          setNotFound(true);
          return;
        }

        setProduct(response.data);
      } catch (requestError) {
        if (controller.signal.aborted || axios.isCancel(requestError)) {
          return;
        }

        if (
          axios.isAxiosError(requestError) &&
          requestError.response?.status === 404
        ) {
          setNotFound(true);
        } else if (axios.isAxiosError(requestError)) {
          setError(
            requestError.response
              ? `Unable to load this product (server error ${requestError.response.status}).`
              : "Could not connect to the product server.",
          );
        } else {
          setError("Unable to load this product. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [productId, retryCount]);

  function retry() {
    setRetryCount((count) => count + 1);
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    setAddedMessage(`${product.title || product.name} added to your cart.`);
    setIsAddedToCart(true);
  }

  if (loading) {
    return (
      <main className="container py-5">
        <div className="d-flex align-items-center gap-3 py-4" role="status">
          <span
            className="spinner-border text-primary"
            aria-hidden="true"
          ></span>
          <span>Loading product details...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger" role="alert">
          <p className="mb-3">{error}</p>
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={retry}
          >
            Retry
          </button>
        </div>
        <Link to="/products">Back to Products</Link>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning" role="status">
          Product not found.
        </div>
        <Link to="/products">Back to Products</Link>
      </main>
    );
  }

  const title = product.title || product.name;
  const images = Array.isArray(product.images)
    ? product.images.filter((image) => typeof image === "string" && image)
    : [];
  const gallerySources =
    images.length > 0
      ? images
      : [product.image || product.imageUrl].filter(Boolean);
  const gallery = gallerySources.map(resolveImage);
  const specifications =
    product.specifications &&
    typeof product.specifications === "object" &&
    !Array.isArray(product.specifications)
      ? Object.entries(product.specifications).filter(
          ([, value]) => value !== null && value !== undefined && value !== "",
        )
      : [];
  const features = Array.isArray(product.features)
    ? product.features.filter(Boolean)
    : [];
  const highlights = Array.isArray(product.highlights)
    ? product.highlights.filter(Boolean)
    : [];
  const rating = product.rating;
  const reviewCount = product.reviewCount ?? product.reviews;
  const hasStock = Number.isFinite(product.stock);
  const inStock = !hasStock || product.stock > 0;

  return (
    <main className="container py-5">
      <div className="product-detail">
        <div className="row g-4 g-lg-5">
          {gallery.length > 0 && (
            <div className="col-12 col-md-6">
              <div className="product-detail-gallery">
                <img
                  className="product-detail-image"
                  src={gallery[selectedImageIndex] || gallery[0]}
                  alt={title || "Product image"}
                />
              </div>
              {gallery.length > 1 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {gallery.map((image, index) => (
                    <button
                      className={`product-detail-thumbnail ${
                        selectedImageIndex === index ? "active" : ""
                      }`}
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={selectedImageIndex === index}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <section
            className={gallery.length > 0 ? "col-12 col-md-6" : "col-12"}
          >
            <p className="text-muted mb-2">{product.category}</p>
            {title && <h1 className="section-title mb-4">{title}</h1>}
            {product.brand && (
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
            )}

            {(rating !== undefined || reviewCount !== undefined) && (
              <p className="rating mb-3">
                {rating !== undefined && <strong>{rating} / 5</strong>}
                {reviewCount !== undefined && (
                  <span className="text-muted ms-2">
                    ({reviewCount} reviews)
                  </span>
                )}
              </p>
            )}
            {product.price !== undefined && (
              <p className="h3 text-primary mb-3">₹{product.price}</p>
            )}
            {hasStock && (
              <p className={inStock ? "text-success" : "text-danger"}>
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </p>
            )}
            {product.description && <p>{product.description}</p>}

            {inStock && (
              <div className="d-flex flex-wrap align-items-end gap-3 mt-4">
                <div className="d-none">
                  <label className="form-label" htmlFor="product-quantity">
                    Quantity
                  </label>
                  <input
                    className="form-control product-quantity-input"
                    id="product-quantity"
                    type="number"
                    min="1"
                    max={hasStock ? product.stock : undefined}
                    value={quantity}
                    onChange={(event) => {
                      const nextQuantity = Number(event.target.value);
                      if (Number.isInteger(nextQuantity) && nextQuantity >= 1) {
                        setQuantity(
                          hasStock
                            ? Math.min(nextQuantity, product.stock)
                            : nextQuantity,
                        );
                      }
                    }}
                  />
                </div>
                {isAddedToCart ? (
                  <Link className="btn btn-primary" to="/cart">
                    <i className="bi bi-cart me-2" aria-hidden="true"></i>
                    Go to Cart
                  </Link>
                ) : (
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-cart-plus me-2" aria-hidden="true"></i>
                    Add to Cart
                  </button>
                )}
              </div>
            )}
            {addedMessage && (
              <p className="alert alert-success mt-3 mb-0" role="status">
                {addedMessage}
              </p>
            )}
          </section>
        </div>

        {(features.length > 0 || highlights.length > 0) && (
          <section className="product-detail-section">
            <h2 className="h4 section-title mb-4">Product Highlights</h2>
            <div className="row g-3">
              {features.length > 0 && (
                <div className="col-12 col-md-4">
                  <h3 className="h6">Features</h3>
                  <ul>
                    {features.map((feature, index) => (
                      <li key={`${feature}-${index}`}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {highlights.length > 0 && (
                <div className="col-12 col-md-4">
                  <h3 className="h6">Highlights</h3>
                  <ul>
                    {highlights.map((highlight, index) => (
                      <li key={`${highlight}-${index}`}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {specifications.length > 0 && (
          <section className="product-detail-section">
            <h2 className="h4 section-title mb-4">Product Specifications</h2>
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <tbody>
                  {specifications.map(([key, value]) => (
                    <tr key={key}>
                      <th scope="row">{formatLabel(key)}</th>
                      <td>{displaySpecification(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(product.warranty || product.deliveryInfo || product.returnPolicy) && (
          <section className="product-detail-section">
            <h2 className="h4 section-title mb-4">Additional Information</h2>
            <div className="row g-3">
              {product.warranty && (
                <div className="col-12 col-md-4">
                  <h3 className="h6">Warranty</h3>
                  <p>{product.warranty}</p>
                </div>
              )}
              {product.deliveryInfo && (
                <div className="col-12 col-md-4">
                  <h3 className="h6">Delivery</h3>
                  <p>{product.deliveryInfo}</p>
                </div>
              )}
              {product.returnPolicy && (
                <div className="col-12 col-md-4">
                  <h3 className="h6">Return Policy</h3>
                  <p>{product.returnPolicy}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <Link className="btn btn-outline-primary mt-4" to="/products">
        Back to Products
      </Link>
    </main>
  );
}

export default ProductDetailPage;
