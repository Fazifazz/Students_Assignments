import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "shopnest-cart-v1";

function readCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => setCartItems((current) => {
    const found = current.find((item) => item.id === product.id);
    if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    return [...current, { ...product, quantity: 1 }];
  });

  const removeFromCart = (id) => setCartItems((current) => current.filter((item) => item.id !== id));

  const updateQuantity = (id, amount) => setCartItems((current) =>
    current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item)
  );

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const value = useMemo(() => ({
    cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
    cartCount, subtotal, tax, total,
  }), [cartItems, cartCount, subtotal, tax, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}