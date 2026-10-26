import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";

export default function Products({ products }) {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState(params.get("category") || "all");
  const wishlistMode = params.get("view") === "wishlist";
  const visible = useMemo(() => {
    let list = [...products];
    if (selected !== "all") list = list.filter((p) => p.category === selected);
    if (search.trim()) list = list.filter((p) => p.title.toLowerCase().includes(search.trim().toLowerCase()) || p.category.toLowerCase().includes(search.trim().toLowerCase()));
    if (wishlistMode) {
      const ids = JSON.parse(localStorage.getItem("shopnest-wishlist-v1") || "[]");
      list = list.filter((p) => ids.includes(p.id));
    }
    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [products, selected, search, sort, wishlistMode]);

  const chooseCategory = (category) => {
    setSelected(category);
    const next = new URLSearchParams(params);
    if (category === "all") next.delete("category"); else next.set("category", category);
    setParams(next, { replace: true });
  };

  return (
    <section className="container section-space products-page">
      <div className="page-title-block"><span className="eyebrow">THE COMPLETE COLLECTION</span><h1>{wishlistMode ? "Your wishlist." : "Objects for everyday."}</h1><p>Browse a considered collection of clothing, footwear, electronics, and books.</p></div>
      <div className="catalogue-toolbar">
        <div className="search-box"><i className="bi bi-search"></i><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the collection…" aria-label="Search products" /><kbd>⌕</kbd></div>
        <div className="sort-control"><label htmlFor="sortProducts">Sort by</label><select id="sortProducts" className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option><option value="name">Name A–Z</option></select></div>
      </div>
      <CategoryFilter selected={selected} onSelect={chooseCategory} />
      <div className="catalogue-count d-flex justify-content-between align-items-center"><span>{visible.length} items {wishlistMode ? "saved" : "in the collection"}</span><span className="catalogue-note"><i className="bi bi-stars me-1"></i>Thoughtfully selected</span></div>
      <ProductGrid products={visible} />
    </section>
  );
}