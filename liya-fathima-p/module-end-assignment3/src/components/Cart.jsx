function Cart({ cart, onUpdateQuantity, onRemove }) {
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <div
      className="offcanvas offcanvas-end cart-offcanvas"
      tabIndex="-1"
      id="cartCanvas"
      aria-labelledby="cartCanvasLabel"
    >
      <div className="offcanvas-header">
        <div>
          <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
          <h2 id="cartCanvasLabel">Your Cart</h2>
        </div>

        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <i className="bi bi-bag-x"></i>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started.</p>
          </div>
        ) : (
          <>
            <div>
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div>
                    <p className="cart-item-name">{item.name}</p>

                    <span className="cart-item-price">
                      ₹{Number(item.price).toFixed(2)}
                    </span>

                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        -
                      </button>

                      <span className="quantity-value">
                        {item.quantity}
                      </span>

                      <button
                        className="quantity-btn"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>

                      <button
                        className="remove-btn"
                        onClick={() => onRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" type="button">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;