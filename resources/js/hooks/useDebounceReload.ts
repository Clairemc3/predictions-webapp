import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const RELOAD_DEBOUNCE_DELAY = 1000;

export const useDebounceReload = (only: string[] = ['questions', 'completedPercentage']) => {
  const [needsReload, setNeedsReload] = useState(false);

  useEffect(() => {
    if (!needsReload) return;

    const timeoutId = setTimeout(() => {
      router.reload({ only });
      setNeedsReload(false);
    }, RELOAD_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [needsReload]);

  return { triggerReload: () => setNeedsReload(true) };
};
