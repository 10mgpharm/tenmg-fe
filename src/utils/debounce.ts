export function debounce(func: (...args: any[]) => void, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId); // Clear any existing timeout
      timeoutId = setTimeout(() => func(...args), delay); // Set a new timeout
    };
  }
  