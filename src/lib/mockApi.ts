/**
 * Mock API Layer for Lovable Preview
 * 
 * This file simulates the Express.js backend for the Lovable preview environment.
 * When deployed to your self-hosted server, the real /api/* routes will be used instead.
 */

import { Product, User } from '@/types';

// Mock database stored in memory
let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handcrafted Ceramic Vase',
    description: 'A beautifully handcrafted ceramic vase with a natural glaze finish. Each piece is unique, made by skilled artisans using traditional techniques.',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
    category: 'Home Decor',
    stock: 15,
    featured: true,
  },
  {
    id: '2',
    name: 'Artisan Leather Wallet',
    description: 'Premium full-grain leather wallet, hand-stitched with care. Features multiple card slots and a coin pocket.',
    price: 125.00,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    category: 'Accessories',
    stock: 25,
    featured: true,
  },
  {
    id: '3',
    name: 'Hand-Woven Wool Throw',
    description: 'Soft, luxurious wool throw blanket in natural earth tones. Perfect for cozy evenings.',
    price: 195.00,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    category: 'Textiles',
    stock: 10,
    featured: true,
  },
  {
    id: '4',
    name: 'Wooden Cutting Board',
    description: 'Solid walnut cutting board with juice groove, food safe finish. A kitchen essential.',
    price: 78.00,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
    category: 'Kitchen',
    stock: 20,
    featured: false,
  },
  {
    id: '5',
    name: 'Handmade Soy Candle',
    description: 'Natural soy wax candle with essential oils, 60 hour burn time. Available in multiple scents.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1602607434683-1a5f486e5a77?w=800',
    category: 'Home Decor',
    stock: 50,
    featured: false,
  },
  {
    id: '6',
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handmade ceramic mugs with unique glazed patterns. Microwave and dishwasher safe.',
    price: 64.00,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    category: 'Kitchen',
    stock: 30,
    featured: true,
  },
];

const mockUsers: Array<{ email: string; passwordHash: string; name: string; isAdmin: boolean }> = [
  { email: 'admin@artisan.com', passwordHash: 'admin123', name: 'Admin', isAdmin: true },
];

// Simple token generation (mock)
function generateMockToken(userId: string, isAdmin: boolean): string {
  return btoa(JSON.stringify({ userId, isAdmin, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
}

function decodeMockToken(token: string): { userId: string; isAdmin: boolean } | null {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

// Check if we're in a browser environment (Lovable preview)
const isBrowser = typeof window !== 'undefined';

// Mock API responses
export const mockApi = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User } | null> {
    const user = mockUsers.find(u => u.email === email && u.passwordHash === password);
    if (!user) return null;
    
    const token = generateMockToken(email, user.isAdmin);
    return {
      token,
      user: {
        id: email,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> {
    let filtered = [...mockProducts];
    
    if (params?.category && params.category !== 'all') {
      filtered = filtered.filter(p => p.category === params.category);
    }
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    
    if (params?.featured) {
      filtered = filtered.filter(p => p.featured);
    }
    
    return filtered;
  },

  async getProduct(id: string): Promise<Product | null> {
    return mockProducts.find(p => p.id === id) || null;
  },

  async createProduct(product: Omit<Product, 'id'>, token: string): Promise<Product | null> {
    const decoded = decodeMockToken(token);
    if (!decoded?.isAdmin) return null;
    
    const newProduct: Product = {
      ...product,
      id: String(Date.now()),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, product: Partial<Product>, token: string): Promise<Product | null> {
    const decoded = decodeMockToken(token);
    if (!decoded?.isAdmin) return null;
    
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProducts[index] = { ...mockProducts[index], ...product };
    return mockProducts[index];
  },

  async deleteProduct(id: string, token: string): Promise<boolean> {
    const decoded = decodeMockToken(token);
    if (!decoded?.isAdmin) return false;
    
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProducts.splice(index, 1);
    return true;
  },

  getCategories(): string[] {
    return [...new Set(mockProducts.map(p => p.category))];
  },
};

// API wrapper that uses mock in browser, real API in production
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  // In browser/Lovable preview, use mock API
  if (isBrowser && !window.location.hostname.includes('localhost:3000')) {
    return handleMockRequest<T>(endpoint, options);
  }
  
  // In production, use real API
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      return { error: error.error || 'Request failed' };
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}

async function handleMockRequest<T>(endpoint: string, options?: RequestInit): Promise<{ data?: T; error?: string }> {
  const method = options?.method || 'GET';
  const body = options?.body ? JSON.parse(options.body as string) : null;
  const token = (options?.headers as Record<string, string>)?.Authorization?.replace('Bearer ', '') || '';
  
  // Auth endpoints
  if (endpoint === '/auth/login' && method === 'POST') {
    const result = await mockApi.login(body.email, body.password);
    if (!result) return { error: 'Invalid email or password' };
    return { data: result as T };
  }
  
  // Products endpoints
  if (endpoint === '/products' && method === 'GET') {
    const products = await mockApi.getProducts();
    return { data: products as T };
  }
  
  if (endpoint.startsWith('/products/') && method === 'GET') {
    const id = endpoint.split('/')[2];
    const product = await mockApi.getProduct(id);
    if (!product) return { error: 'Product not found' };
    return { data: product as T };
  }
  
  if (endpoint === '/products' && method === 'POST') {
    const product = await mockApi.createProduct(body, token);
    if (!product) return { error: 'Unauthorized' };
    return { data: product as T };
  }
  
  if (endpoint.startsWith('/products/') && method === 'PUT') {
    const id = endpoint.split('/')[2];
    const product = await mockApi.updateProduct(id, body, token);
    if (!product) return { error: 'Unauthorized or not found' };
    return { data: product as T };
  }
  
  if (endpoint.startsWith('/products/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    const success = await mockApi.deleteProduct(id, token);
    if (!success) return { error: 'Unauthorized or not found' };
    return { data: { success: true } as T };
  }
  
  return { error: 'Endpoint not found' };
}
