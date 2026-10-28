import { createContext, useContext, useEffect, useMemo, useState } from "react";
import sampleProducts from "../../products.json";
import { fetchProducts, normalizeProducts } from "../api/products.js";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        setProducts(await fetchProducts(controller.signal));
      } catch (fetchError) {
        if (controller.signal.aborted) return;

        try {
          const fallbackProducts = normalizeProducts(sampleProducts);
          console.warn(
            "ShopNest backend is unavailable; showing the bundled sample catalog.",
            fetchError,
          );
          setProducts(fallbackProducts);
        } catch (fallbackError) {
          console.error("Unable to load ShopNest products or sample data.", {
            fetchError,
            fallbackError,
          });
          setError(
            "We couldn’t load products right now. Please check your connection and try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({ products, loading, error }),
    [products, loading, error],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductsProvider.");
  }
  return context;
}
