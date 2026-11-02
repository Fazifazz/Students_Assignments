import { useEffect, useMemo, useState } from "react";
import CartContext from "./cartContext";

const CART_STORAGE_KEY = "shopnest-cart";

function getStoredItems() {
  try {
    const storedItems = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedItems) {
      return [];
    }

    const parsedItems = JSON.parse(storedItems);
    if (!Array.isArray(parsedItems)) {
      throw new Error("Saved cart data must be an array.");
    }

    return parsedItems.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    );
  } catch (error) {
    console.error("Unable to load saved cart data.", error);
    return [];
  }
}

function CartProvider({ children }) {
  const [items, setItems] = useState(getStoredItems);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Unable to save cart data.", error);
    }
  }, [items]);

  function addToCart(product, quantity) {
    setItems((currentItems) => {
      const productId = product.id ?? product._id;
      const existingItem = currentItems.find(
        (item) => (item.id ?? item._id) === productId,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          (item.id ?? item._id) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity }];
    });
  }

  function incrementQuantity(productId) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        const itemId = item.id ?? item._id;
        const maxStock = Number.isFinite(item.stock) ? item.stock : Infinity;

        return itemId === productId && item.quantity < maxStock
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      }),
    );
  }

  function decrementQuantity(productId) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        const itemId = item.id ?? item._id;
        return itemId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item;
      }),
    );
  }

  function removeFromCart(productId) {
    setItems((currentItems) =>
      currentItems.filter((item) => (item.id ?? item._id) !== productId),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      addToCart,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart,
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
