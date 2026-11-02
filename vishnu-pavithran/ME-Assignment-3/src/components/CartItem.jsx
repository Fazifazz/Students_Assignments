const localProductImages = import.meta.glob("../assets/images/*", {
  eager: true,
  import: "default",
});

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function CartItem({
  product,
  quantity,
  onIncrement = () => {},
  onDecrement = () => {},
  onRemove = () => {},
}) {
  const { id, name, title, price, imageUrl, image } = product;
  const productName = name || title;
  const imagePath = imageUrl || image;
  const imageFilename = imagePath?.split(/[\\/]/).pop();
  const productImage =
    (imageFilename &&
      localProductImages[`../assets/images/${imageFilename}`]) ||
    imagePath;
  const numericPrice = Number(price);
  const subtotal = numericPrice * quantity;
  const stockLimit = Number.isFinite(product.stock);

  return (
    <article className="cart-item">
      {productImage && (
        <img
          className="cart-item-image"
          src={productImage}
          alt={productName}
        />
      )}
      <div className="cart-item-details">
        <h2 className="h6 mb-1">{productName}</h2>
        <p className="text-muted mb-2">
          {currencyFormatter.format(numericPrice)} each
        </p>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="btn-group" role="group" aria-label={`${productName} quantity`}>
            <button
              className="btn btn-outline-secondary"
              type="button"
              aria-label={`Decrease ${productName} quantity`}
              disabled={quantity <= 1}
              onClick={() => onDecrement(id)}
            >
              <span aria-hidden="true">−</span>
            </button>
            <span className="btn btn-outline-secondary" aria-live="polite">
              {quantity}
            </span>
            <button
              className="btn btn-outline-secondary"
              type="button"
              aria-label={`Increase ${productName} quantity`}
              disabled={stockLimit && quantity >= product.stock}
              onClick={() => onIncrement(id)}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <strong>Subtotal: {currencyFormatter.format(subtotal)}</strong>
        </div>
      </div>
      <button
        className="btn btn-outline-danger cart-item-remove"
        type="button"
        onClick={() => onRemove(id)}
      >
        Remove
      </button>
    </article>
  );
}

export default CartItem;
