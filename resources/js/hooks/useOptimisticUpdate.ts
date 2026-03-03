import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

interface UseOptimisticUpdateOptions<TData, TVariables, TState> {
  mutationFn: (variables: TVariables) => Promise<Response>;
  currentState: TState;
  setState: Dispatch<SetStateAction<TState>>;
  getOptimisticState: (currentState: TState, variables: TVariables) => TState;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: () => void;
}

/**
 * Hook that wraps TanStack's useMutation for optimistic UI updates
 * 
 * @example
 * const updateEntity = useOptimisticUpdate({
 *   mutationFn: (data) => apiDelete(`/answers/${data.id}`),
 *   currentState: selectedEntities,
 *   setState: setSelectedEntities,
 *   getOptimisticState: (current, variables) => {
 *     const newState = [...current];
 *     newState[variables.index] = null;
 *     return newState;
 *   },
 *   onSuccess: () => setNeedsReload(true),
 *   onError: () => setApiError('Failed to delete'),
 * });
 * 
 * // Use it
 * updateEntity.mutate({ id: 123, index: 0 });
 */
export function useOptimisticUpdate<TData = any, TVariables = any, TState = any>({
  mutationFn,
  currentState,
  setState,
  getOptimisticState,
  onSuccess: customOnSuccess,
  onError: customOnError,
  onSettled: customOnSettled,
}: UseOptimisticUpdateOptions<TData, TVariables, TState>) {
  return useMutation<TData, Error, TVariables, { previousState: TState }>({
    mutationFn: async (variables: TVariables) => {
      const response = await mutationFn(variables);
      
      // Parse response data if not 204 No Content
      const data = response.status !== 204 ? await response.json() : undefined;
      
      return data as TData;
    },
    
    // Optimistically update before API call
    onMutate: async (variables: TVariables) => {
      // Save previous state for rollback
      const previousState = currentState;
      
      // Apply optimistic update
      const optimisticState = getOptimisticState(currentState, variables);
      setState(optimisticState);
      
      // Return context with previous state
      return { previousState };
    },
    
    // Handle successful mutation
    onSuccess: async (data: TData, variables: TVariables) => {
      // Call custom onSuccess if provided
      if (customOnSuccess) {
        customOnSuccess(data, variables);
      }
    },
    
    // Roll back on error
    onError: (error: Error, variables: TVariables, context) => {
      if (context?.previousState) {
        setState(context.previousState);
      }
      
      // Call custom onError if provided
      if (customOnError) {
        customOnError(error, variables);
      }
    },
    
    // Always run after mutation (success or error)
    onSettled: () => {
      if (customOnSettled) {
        customOnSettled();
      }
    },
  });
}
