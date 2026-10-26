const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <article className="cart-item">
      <img src={item.image} alt={item.title} className="cart-item-image" />
      <div className="cart-item-info">
        <span className="product-category">{item.category}</span>
        <h3>{item.title}</h3>
        <p className="cart-item-price">{money(item.price)}</p>
        <div className="d-flex align-items-center flex-wrap gap-3">
          <div className="quantity-control" aria-label={`Quantity for ${item.title}`}>
            <button type="button" onClick={() => onQuantityChange(item.id, -1)} aria-label="Decrease quantity"><i className="bi bi-dash"></i></button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => onQuantityChange(item.id, 1)} aria-label="Increase quantity"><i className="bi bi-plus"></i></button>
          </div>
          <button className="remove-link" type="button" onClick={() => onRemove(item.id)}><i className="bi bi-trash3 me-1"></i>Remove</button>
        </div>
      </div>
      <div className="cart-line-total">{money(item.price * item.quantity)}</div>
    </article>
  );
}