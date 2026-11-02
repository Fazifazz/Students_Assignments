import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axiosInstance";

export default function useProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/products", {
          signal: controller.signal,
        });
        const products = Array.isArray(response.data)
          ? response.data
          : response.data?.products;

        if (!Array.isArray(products)) {
          throw new Error(
            "The product service returned an unexpected response.",
          );
        }

        setData(products);
      } catch (requestError) {
        if (controller.signal.aborted || axios.isCancel(requestError)) {
          return;
        }

        setData([]);
        if (axios.isAxiosError(requestError)) {
          setError(
            requestError.response
              ? `Unable to load products (server error ${requestError.response.status}). Please try again.`
              : "Could not connect to the product server. Please try again.",
          );
        } else {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load products. Please try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [retryCount]);

  function retry() {
    setRetryCount((count) => count + 1);
  }

  return { data, loading, error, retry };
}
