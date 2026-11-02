import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import useProducts from "../hooks/useProducts";

const CATEGORIES = ["All", "Electronics", "Footwear", "Books", "Clothing"];

function normalizeCategory(category) {
  const normalized =
    typeof category === "string"
      ? category.trim().toLowerCase().replace(/[\s_-]+/g, "")
      : "";

  const aliases = {
    electronic: "electronics",
    footwear: "footwear",
    footware: "footwear",
    shoe: "footwear",
    shoes: "footwear",
    book: "books",
    clothes: "clothing",
    apparel: "clothing",
  };

  return aliases[normalized] || normalized;
}

function ProductsPage() {
  const { data: products, loading, error, retry } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const searchTerm = (searchParams.get("search") ?? "").trim().toLowerCase();
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          selectedCategory === "All" ||
          normalizeCategory(product.category) ===
            normalizeCategory(selectedCategory);
        const matchesSearch =
          !searchTerm ||
          [product.name, product.title, product.category, product.brand, product.description]
            .filter((value) => typeof value === "string")
            .some((value) => value.toLowerCase().includes(searchTerm));

        return matchesCategory && matchesSearch;
      }),
    [products, searchTerm, selectedCategory],
  );

  return (
    <main className="container py-5">
      <h1 className="section-title mb-4">Products</h1>
      <div className="mb-4">
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      {loading ? (
        <div
          className="d-flex align-items-center gap-3 py-4"
          role="status"
          aria-live="polite"
        >
          <span className="spinner-border text-primary" aria-hidden="true"></span>
          <span>Loading products...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <p className="mb-3">{error}</p>
          <button className="btn btn-outline-danger" type="button" onClick={retry}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : searchTerm ? (
            <p className="no-data w-100 p-4" role="status">
              No products found matching your search.
            </p>
          ) : products.length > 0 ? (
            <p className="no-data w-100 p-4" role="status">
              No products found in {selectedCategory}. Try another category.
            </p>
          ) : (
            <p className="no-data w-100 p-4" role="status">
              No products are available right now.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default ProductsPage;
