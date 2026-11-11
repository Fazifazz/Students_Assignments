
export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) {
  return (
    <article className="cart-item">
     <img src={item.image || item.imageUrl} alt={item.title} />

      <div className="cart-item-info">
        <h3>{item.title}</h3>
       <p>₹{Number(item.price).toLocaleString('en-IN')}</p>

        <div className="quantity-controls">
          <button onClick={() => onDecrease(item.id)} aria-label="Decrease quantity">
            −
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => onIncrease(item.id)} aria-label="Increase quantity">
            +
          </button>
        </div>
      </div>

      <button className="remove-button" onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </article>
  );
}