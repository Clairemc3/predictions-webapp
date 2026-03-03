import { useState, useCallback } from 'react';

interface UseOptimisticUpdateReturn<T> {
  state: T;
  setState: (value: T | ((prev: T) => T)) => void;
  updateOptimistically: (newState: T) => void;
  revert: () => void;
  commit: () => void;
}

/**
 * Hook for managing state with optimistic updates and the ability to revert
 * 
 * @param initialState Initial state value
 * @returns Object containing state management functions
 * 
 * @example
 * const { state, updateOptimistically, revert } = useOptimisticUpdate([1, 2, 3]);
 * 
 * // Make an optimistic update
 * updateOptimistically([3, 2, 1]);
 * 
 * // If API call fails, revert to previous state
 * if (!success) {
 *   revert();
 * }
 */
export function useOptimisticUpdate<T>(initialState: T): UseOptimisticUpdateReturn<T> {
  const [state, setState] = useState<T>(initialState);
  const [previousState, setPreviousState] = useState<T>(initialState);

  /**
   * Update state optimistically and save the current state for potential reversion
   */
  const updateOptimistically = useCallback((newState: T) => {
    setPreviousState(state);
    setState(newState);
  }, [state]);

  /**
   * Revert to the previous state before the last optimistic update
   */
  const revert = useCallback(() => {
    setState(previousState);
  }, [previousState]);

  /**
   * Commit the current state, making it the new baseline for reversion
   */
  const commit = useCallback(() => {
    setPreviousState(state);
  }, [state]);

  return {
    state,
    setState,
    updateOptimistically,
    revert,
    commit,
  };
}
