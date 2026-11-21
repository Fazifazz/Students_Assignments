import { useEffect, useState } from 'react';

/**
 * Returns a value that only updates after `delay` ms of quiet.
 * Used for search inputs so typing does not fire a request per keystroke.
 */
export default function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
