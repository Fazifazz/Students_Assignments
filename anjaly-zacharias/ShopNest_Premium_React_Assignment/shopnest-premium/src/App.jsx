import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoadingState from "./components/LoadingState";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import { curatedProducts } from "./data/products";
import { fetchProducts } from "./services/productService";

export default function App() {
  const [products, setProducts] = useState(curatedProducts);
  const [loading, setLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      setLoading(true);
      try {
        const result = await fetchProducts();
        if (!active) return;
        setProducts(result.products);
        setApiNotice("");
      } catch (error) {
        if (!active) return;
        setProducts(curatedProducts);
        setApiNotice("Live catalogue service is temporarily unavailable. You're viewing our curated demo catalogue instead.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => { active = false; };
  }, []);

  return (
    <>
      <Navbar />
      {apiNotice && <div className="container pt-3"><div className="alert alert-warning api-alert d-flex align-items-center gap-2 mb-0" role="alert"><i className="bi bi-cloud-slash"></i><span>{apiNotice}</span><button className="btn btn-sm btn-outline-dark ms-auto flex-shrink-0" onClick={() => window.location.reload()}>Retry</button></div></div>}
      <main>
        {loading ? <LoadingState /> : (
          <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/products" element={<Products products={products} />} />
            <Route path="/products/:id" element={<ProductDetail products={products} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<div className="container section-space text-center"><h1>Page not found</h1><p className="text-muted">The page you are looking for may have moved.</p><a className="btn btn-dark rounded-pill px-4" href="/">Return home</a></div>} />
          </Routes>
        )}
      </main>
      <footer className="site-footer">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
          <Link className="footer-brand" to="/">shopnest<span>.</span></Link>
          <p className="mb-0">Considered essentials for everyday living.</p>
          <small>© {new Date().getFullYear()} ShopNest · Demo storefront</small>
        </div>
      </footer>
    </>
  );
}

// Local component import kept here to make the footer route-safe.
import { Link } from "react-router-dom";