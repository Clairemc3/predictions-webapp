// Get CSRF token once
const getCsrfToken = (): string => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
};

// Custom fetch wrapper that includes CSRF token
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const csrfToken = getCsrfToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': csrfToken,
  };

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(url, mergedOptions);
};

// Convenience methods
export const apiPost = (url: string, data: any = {}, options: RequestInit = {}) => {
  return apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

export const apiPut = (url: string, data: any = {}, options: RequestInit = {}) => {
  return apiFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

export const apiDelete = (url: string, options: RequestInit = {}) => {
  return apiFetch(url, {
    method: 'DELETE',
    ...options,
  });
};

export const apiGet = (url: string, options: RequestInit = {}) => {
  return apiFetch(url, {
    method: 'GET',
    ...options,
  });
};