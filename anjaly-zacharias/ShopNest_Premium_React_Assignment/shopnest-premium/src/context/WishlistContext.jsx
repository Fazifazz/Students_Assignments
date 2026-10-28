import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const KEY = "shopnest-wishlist-v1";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(wishlist)), [wishlist]);

  const toggleWishlist = (id) => setWishlist((items) =>
    items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
  );

  return <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}