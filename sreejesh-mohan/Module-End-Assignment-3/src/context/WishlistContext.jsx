import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = 'shopnest_react_wishlist';

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load wishlist from storage:', e);
      return [];
    }
  });

  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [wishlistToast, setWishlistToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to storage:', e);
    }
  }, [wishlist]);

  const showToast = (message) => {
    setWishlistToast(message);
    setTimeout(() => {
      setWishlistToast((cur) => (cur === message ? null : cur));
    }, 2800);
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => String(item.id) === String(productId));
  };

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;
    const exists = isInWishlist(product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => String(item.id) !== String(product.id)));
      showToast(`Removed "${product.name}" from your wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to your wishlist! ❤️`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(productId)));
    showToast('Item removed from wishlist');
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const openWishlistDrawer = () => setIsWishlistDrawerOpen(true);
  const closeWishlistDrawer = () => setIsWishlistDrawerOpen(false);

  const wishlistCount = wishlist.length;

  const value = {
    wishlist,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    isWishlistDrawerOpen,
    openWishlistDrawer,
    closeWishlistDrawer,
    wishlistToast,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
