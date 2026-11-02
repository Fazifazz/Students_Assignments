import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'shopnest_react_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
      return [];
    }
  });

  // Toast / feedback message state
  const [notification, setNotification] = useState(null);
  // Slide-over mini-cart drawer state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [cart]);

  // Show temporary toast notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((current) => (current === message ? null : current));
    }, 2800);
  };

  // Add item to cart (with optional quantity and drawer trigger)
  const addToCart = (product, quantity = 1, triggerDrawer = true) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [...prevCart, { ...product, quantity: qty }];
    });
    showNotification(`Added "${product.name}" to your cart!`);
    if (triggerDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  // Remove single item completely
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showNotification('Item removed from cart');
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Derived calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST/tax
  const total = subtotal + tax;

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    tax,
    total,
    notification,
    isCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook for consuming CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
