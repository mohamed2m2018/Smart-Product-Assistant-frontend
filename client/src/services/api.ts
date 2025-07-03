import axios from 'axios';
import type { Product } from '../components';

// Backend product format
interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  ai_explanation?: string;
  ai_relevance_score?: number;
}

// Transform backend product to frontend format
const transformProduct = (backendProduct: BackendProduct): Product => ({
  id: backendProduct.id.toString(),
  name: backendProduct.name,
  price: backendProduct.price,
  description: backendProduct.description,
  image: backendProduct.imageUrl,
  currency: 'USD',
  aiExplanation: backendProduct.ai_explanation,
});

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  withCredentials: true, // Include cookies for session management
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging (optional)
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - consider redirecting to login');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Backend response format
interface BackendResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

// Search response format (different from other endpoints)
interface SearchResponse {
  success: boolean;
  query: string;
  results: BackendProduct[];
  filters: Record<string, unknown>;
  sortBy: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  total_results: number;
  execution_time_ms: number;
}

// Search History interfaces
interface SearchHistoryItem {
  id: number;
  query: string;
  resultsCount: number;
  executionTimeMs: number;
  success: boolean;
  errorType: string | null;
  filters: Record<string, unknown>;
  sortBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SearchHistoryResponse {
  success: boolean;
  data: SearchHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface PopularSearchItem {
  query: string;
  searchCount: string;
}

interface PopularSearchResponse {
  success: boolean;
  data: PopularSearchItem[];
  period: string;
  limit: number;
}

interface SearchHistoryOptions {
  page?: number;
  limit?: number;
  successOnly?: boolean;
  query?: string;
  startDate?: string;
  endDate?: string;
}

// Search interfaces
interface SearchFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  attributes?: Record<string, string>;
}

interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

// Product API functions
export const productApi = {
  // Get all products with optional filtering and sorting
  getAllProducts: async (filters?: SearchFilters, sortBy?: SearchOptions['sortBy']): Promise<Product[]> => {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (sortBy && sortBy !== 'relevance') params.append('sortBy', sortBy);
    
    const url = params.toString() ? `/products?${params.toString()}` : '/products';
    const response = await api.get<BackendResponse<BackendProduct[]>>(url);
    return response.data.data.map(transformProduct);
  },

  // Search products (legacy GET endpoint)
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await api.get<BackendResponse<BackendProduct[]>>(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data.data.map(transformProduct);
  },

  // AI-powered search with recommendations (POST endpoint)
  aiSearch: async (options: SearchOptions): Promise<Product[]> => {
    const response = await api.post<SearchResponse>('/search', options);
    return response.data.results.map(transformProduct);
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<BackendResponse<BackendProduct>>(`/products/${id}`);
    console.log('response.data.data', response.data.data);
    return transformProduct(response.data.data);
  },

  // Get products by category (if backend supports it)
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get<BackendResponse<BackendProduct[]>>(`/products/category/${category}`);
    return response.data.data.map(transformProduct);
  },

  // Get featured products (if backend supports it)
  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await api.get<BackendResponse<BackendProduct[]>>('/products/featured');
    return response.data.data.map(transformProduct);
  },
};

// Search History API functions
export const searchHistoryApi = {
  // Get search history with pagination and filtering
  getHistory: async (options: SearchHistoryOptions = {}): Promise<SearchHistoryResponse> => {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.successOnly) params.append('successOnly', options.successOnly.toString());
    if (options.query) params.append('query', options.query);
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);

    const response = await api.get<SearchHistoryResponse>(`/search/history?${params.toString()}`);
    return response.data;
  },

  // Get popular search terms
  getPopularSearches: async (limit: number = 10, days: number = 30): Promise<PopularSearchResponse> => {
    const response = await api.get<PopularSearchResponse>(`/search/popular?limit=${limit}&days=${days}`);
    return response.data;
  },
};

// General API utilities
export const apiUtils = {
  // Check if API is available
  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch {
      return false;
    }
  },

  // Handle API errors with user-friendly messages
  getErrorMessage: (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return 'The requested resource was not found.';
      } else if (error.response?.status === 500) {
        return 'Server error occurred. Please try again later.';
      } else if (error.code === 'ECONNABORTED') {
        return 'Request timed out. Please check your connection.';
      } else if (error.code === 'ERR_NETWORK') {
        return 'Network error. Please check your internet connection.';
      } else if (error.response?.data?.message) {
        return error.response.data.message;
      }
    }
    return 'An unexpected error occurred. Please try again.';
  },
};

// Authentication interfaces
interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    preferences: {
      searchHistoryLimit: number;
      popularSearchesLimit: number;
      theme: string;
    };
  };
}

interface SessionResponse {
  success: boolean;
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    preferences: {
      searchHistoryLimit: number;
      popularSearchesLimit: number;
      theme: string;
    };
  };
}

interface PreferencesResponse {
  success: boolean;
  message: string;
  preferences: {
    searchHistoryLimit: number;
    popularSearchesLimit: number;
    theme: string;
  };
}

// Authentication API functions
export const authApi = {
  // User login
  login: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // User registration
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // User logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/auth/logout');
    return response.data;
  },

  // Get current session
  getSession: async (): Promise<SessionResponse> => {
    const response = await api.get<SessionResponse>('/auth/session');
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (preferences: Record<string, unknown>): Promise<PreferencesResponse> => {
    const response = await api.put<PreferencesResponse>('/auth/preferences', { preferences });
    return response.data;
  },
};

// Export types for use in components
export type { 
  SearchHistoryItem, 
  SearchHistoryOptions, 
  PopularSearchItem, 
  AuthResponse, 
  SessionResponse,
  SearchFilters,
  SearchOptions
};

export default api; 