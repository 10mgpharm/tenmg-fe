import { useEffect, useState } from "react";

/**
 * Hook to debounce a value over a delay period.
 * @param value - The value that needs debouncing.
 * @param delay - Delay in milliseconds (default: 500ms).
 * @returns The debounced value.
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if value or delay changes, or when the component unmounts
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}
