import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export function normalizeProducts(payload) {
  const products = Array.isArray(payload)
    ? payload
    : payload?.products ?? payload?.data;

  if (!Array.isArray(products)) {
    throw new Error("The products API returned an unexpected response.");
  }

  const normalizedProducts = products.map((product) => ({
    ...product,
    id: product.id == null ? "" : String(product.id),
    price: Number(product.price),
    originalPrice:
      product.originalPrice == null ? null : Number(product.originalPrice),
  }));

  if (
    normalizedProducts.some(
      (product) =>
        !product.id ||
        !String(product.name || "").trim() ||
        !String(product.category || "").trim() ||
        !Number.isFinite(product.price) ||
        product.price < 0,
    )
  ) {
    throw new Error("The products API returned invalid product data.");
  }

  return normalizedProducts;
}

export async function fetchProducts(signal) {
  const response = await axios.get(`${apiBaseUrl}/products`, { signal });
  return normalizeProducts(response.data);
}
