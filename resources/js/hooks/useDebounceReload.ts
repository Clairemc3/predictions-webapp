import { useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';

const RELOAD_DEBOUNCE_DELAY = 1000;

export const useDebounceReload = (only: string[] = ['questions', 'completedPercentage']) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onlyRef = useRef(only);
  onlyRef.current = only;

  const triggerReload = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      router.reload({ only: onlyRef.current });
      timeoutRef.current = null;
    }, RELOAD_DEBOUNCE_DELAY);
  }, []);

  return { triggerReload };
};
