import { useState, useEffect } from 'react';

// useDebounce custom hook to throttle search inputs (Session 34)
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // Cancel timer on change
  }, [value, delay]);

  return debouncedValue;
}
