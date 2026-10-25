import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "shopnest-cart";
const MAX_QUANTITY = 10;
const CartContext = createContext(null);

function readSavedCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(savedCart)) {
      throw new TypeError("Saved cart must be an array.");
    }

    return savedCart.filter(
      (item) =>
        item &&
        item.product &&
        item.product.id &&
        Number.isFinite(Number(item.product.price)) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch (error) {
    console.error("Unable to read the saved ShopNest cart.", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readSavedCart);

  function updateItems(updater) {
    setItems((currentItems) => {
      const nextItems = updater(currentItems);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      } catch (error) {
        console.error("Unable to save the ShopNest cart.", error);
      }
      return nextItems;
    });
  }

  function addItem(product) {
    updateItems((currentItems) => {
      const existing = currentItems.find(
        (item) => item.product.id === String(product.id),
      );

      if (existing) {
        if (existing.quantity >= MAX_QUANTITY) return currentItems;
        return currentItems.map((item) =>
          item.product.id === String(product.id)
            ? { product, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  }

  function setQuantity(productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    updateItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === String(productId)
          ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }
          : item,
      ),
    );
  }

  function removeItem(productId) {
    updateItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== String(productId)),
    );
  }

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
    }),
    [items, itemCount, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}
