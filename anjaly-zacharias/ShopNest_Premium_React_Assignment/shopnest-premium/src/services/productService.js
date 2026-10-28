import axios from "axios";
import { curatedProducts } from "../data/products";

// Fake Store API is used to demonstrate a real Axios request.
// The curated catalogue keeps all four assignment categories available.
export async function fetchProducts() {
  const response = await axios.get("https://fakestoreapi.com/products", {
    timeout: 9000,
  });
  const apiProducts = Array.isArray(response.data) ? response.data : [];
  return { products: curatedProducts, apiCount: apiProducts.length };
}