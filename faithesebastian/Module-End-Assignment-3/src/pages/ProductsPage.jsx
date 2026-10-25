import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";
import { useProducts } from "../context/ProductsContext.jsx";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const category = categoryParam;
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          category === "All" || product.category === category;
        const matchesSearch =
          !search ||
          `${product.name} ${product.category}`.toLowerCase().includes(search);
        return matchesCategory && matchesSearch;
      }),
    [products, category, search],
  );

  return (
    <section className="catalog page-section">
      <div className="container">
        <h1 className="section-title">
          {category === "All" ? "All Products" : category}
        </h1>
        <p className="section-subtitle">
        {search
          ? `Search results for “${searchParams.get("search")}”`
          : "Browse the ShopNest collection"}
        </p>
        <ProductGrid
          products={visibleProducts}
          loading={loading}
          error={error}
        />
      </div>
    </section>
  );
}
