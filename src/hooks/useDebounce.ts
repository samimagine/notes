import { useRef, useCallback, useEffect } from "react";

const useDebounce = (callback: (...args: any[]) => void, delay = 500) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const latestCallback = useRef(callback);

  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  return useCallback(
    (...args: unknown[]) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        latestCallback.current(...args);
      }, delay);
    },
    [delay]
  );
};

export default useDebounce;
