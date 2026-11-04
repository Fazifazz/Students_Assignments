
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import Contact from "./pages/Contact";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary local JSON fetching.
  // We will replace this with Axios and the backend API.
  useEffect(() => {
    fetch("/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/products"
          element={
            <Products
              products={products}
              loading={loading}
              error={error}
            />
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetail
              products={products}
              loading={loading}
            />
          }
        />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/contact" element={<Contact />} />

        <Route
          path="*"
          element={
            <div className="container py-5 text-center">
              <h2>404 - Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
