/**
 * API Helper for self-hosted deployment
 * 
 * Use this helper for all API calls. It automatically:
 * - Adds JWT token to requests
 * - Handles JSON parsing
 * - Provides consistent error handling
 */

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(response.status, error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint),
  
  post: <T = any>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  put: <T = any>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  delete: <T = any>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

// Usage examples:
// const products = await api.get<Product[]>('/products');
// const product = await api.post<Product>('/products', { name: 'New Product', price: 99 });
// await api.put('/products/1', { name: 'Updated Product' });
// await api.delete('/products/1');
