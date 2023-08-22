import { useEffect, useState } from "react";

export function useDebounce<T>(
  value: T,
  delay?: number
): { debouncedValue: T; loading: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setDebouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debouncedValue, loading };
}
