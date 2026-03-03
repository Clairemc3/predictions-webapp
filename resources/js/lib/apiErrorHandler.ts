interface ApiOperationOptions<T = any> {
  operation: () => Promise<Response>;
  onSuccess?: (data?: T) => void;
  onError?: (error: string) => void;
  revertState?: () => void;
}

/**
 * Handles API operations with consistent error handling, status validation, and state reversion
 * 
 * @param options Configuration object for the API operation
 * @returns Promise<boolean> indicating operation success
 * 
 * @example
 * const success = await handleApiOperation({
 *   operation: () => apiDelete('/resource/1'),
 *   onSuccess: () => setNeedsReload(true),
 *   onError: setApiError,
 *   revertState: revertToOriginalState,
 * });
 */
export async function handleApiOperation<T = any>({
  operation,
  onSuccess,
  onError,
  revertState,
}: ApiOperationOptions<T>): Promise<boolean> {
  try {
    const response = await operation();
    
    if (response.ok) {
      // Parse response data if status is not 204 (No Content)
      const data = response.status !== 204 ? await response.json() : null;
      onSuccess?.(data);
      return true;
    } else {
      // Handle non-success status codes
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Operation failed. Please try again.';
      onError?.(errorMessage);
      revertState?.();
      return false;
    }
  } catch (error) {
    // Handle network errors or unexpected failures
    console.error('API operation error:', error);
    onError?.('Operation failed. Please try again.');
    revertState?.();
    return false;
  }
}
