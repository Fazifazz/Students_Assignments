import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

// useFetch custom hook with cancelled flag to prevent memory leak (Session 34)
export function useFetch(url, initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(url);
        if (!cancelled) {
          setData(response.data.data !== undefined ? response.data.data : response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Fetch failed');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true; // Cleanup on unmount (Session 30, 34)
    };
  }, [url]);

  return { data, loading, error, setData };
}
