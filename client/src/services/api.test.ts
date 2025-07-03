import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { productApi, apiUtils } from './api';
import type { Product } from '../components';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
    isAxiosError: vi.fn(),
  },
}));

const mockedAxios = vi.mocked(axios);
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};

// Setup axios.create to return our mock instance
(mockedAxios.create as any).mockReturnValue(mockAxiosInstance);

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  description: 'Test description',
  image: 'https://example.com/image.jpg',
  currency: 'USD'
};

const mockProducts: Product[] = [
  mockProduct,
  {
    id: '2',
    name: 'Test Product 2',
    price: 149.99,
    description: 'Test description 2',
    image: 'https://example.com/image2.jpg',
    currency: 'USD',
    aiExplanation: 'AI recommendation'
  }
];

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance.get.mockClear();
    mockAxiosInstance.post.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('productApi.getAllProducts', () => {
    it('fetches all products successfully', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockProducts });

      const result = await productApi.getAllProducts();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockProducts);
    });

    it('handles API error correctly', async () => {
      const errorMessage = 'Network Error';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      await expect(productApi.getAllProducts()).rejects.toThrow(errorMessage);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products');
    });
  });

  describe('productApi.searchProducts', () => {
    it('searches products with encoded query', async () => {
      const query = 'wireless headphones';
      mockAxiosInstance.get.mockResolvedValue({ data: mockProducts });

      const result = await productApi.searchProducts(query);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/search?q=wireless%20headphones');
      expect(result).toEqual(mockProducts);
    });

    it('handles special characters in search query', async () => {
      const query = 'product & test "quotes"';
      mockAxiosInstance.get.mockResolvedValue({ data: mockProducts });

      await productApi.searchProducts(query);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/products/search?q=product%20%26%20test%20%22quotes%22'
      );
    });

    it('handles empty search results', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [] });

      const result = await productApi.searchProducts('nonexistent');

      expect(result).toEqual([]);
    });
  });

  describe('productApi.aiSearch', () => {
    it('sends POST request with query in body', async () => {
      const query = 'I need a laptop for gaming';
      mockAxiosInstance.post.mockResolvedValue({ data: mockProducts });

      const result = await productApi.aiSearch({ query });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', { query });
      expect(result).toEqual(mockProducts);
    });

    it('handles AI search error', async () => {
      const query = 'test search';
      const errorResponse = {
        response: { status: 500, data: { message: 'AI service unavailable' } }
      };
      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(productApi.aiSearch({ query })).rejects.toEqual(errorResponse);
    });
  });

  describe('productApi.getProductById', () => {
    it('fetches single product by ID', async () => {
      const productId = '123';
      mockAxiosInstance.get.mockResolvedValue({ data: mockProduct });

      const result = await productApi.getProductById(productId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/123');
      expect(result).toEqual(mockProduct);
    });

    it('handles product not found error', async () => {
      const productId = 'nonexistent';
      const errorResponse = {
        response: { status: 404, data: { message: 'Product not found' } }
      };
      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(productApi.getProductById(productId)).rejects.toEqual(errorResponse);
    });
  });

  describe('productApi.getProductsByCategory', () => {
    it('fetches products by category', async () => {
      const category = 'electronics';
      mockAxiosInstance.get.mockResolvedValue({ data: mockProducts });

      const result = await productApi.getProductsByCategory(category);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/category/electronics');
      expect(result).toEqual(mockProducts);
    });
  });

  describe('productApi.getFeaturedProducts', () => {
    it('fetches featured products', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockProducts });

      const result = await productApi.getFeaturedProducts();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/featured');
      expect(result).toEqual(mockProducts);
    });
  });

  describe('apiUtils.healthCheck', () => {
    it('returns true when health check succeeds', async () => {
      mockAxiosInstance.get.mockResolvedValue({ status: 200 });

      const result = await apiUtils.healthCheck();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health');
      expect(result).toBe(true);
    });

    it('returns false when health check fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Service unavailable'));

      const result = await apiUtils.healthCheck();

      expect(result).toBe(false);
    });
  });

  describe('apiUtils.getErrorMessage', () => {
    it('returns specific message for 404 errors', () => {
      const error = {
        response: { status: 404 }
      };

      const message = apiUtils.getErrorMessage(error);

      expect(message).toBe('The requested resource was not found.');
    });

    it('returns specific message for 500 errors', () => {
      const error = {
        response: { status: 500 }
      };

      const message = apiUtils.getErrorMessage(error);

      expect(message).toBe('Server error occurred. Please try again later.');
    });

    it('returns specific message for timeout errors', () => {
      const error = {
        code: 'ECONNABORTED'
      };

      const message = apiUtils.getErrorMessage(error);

      expect(message).toBe('Request timed out. Please check your connection.');
    });

    it('returns specific message for network errors', () => {
      const error = {
        code: 'ERR_NETWORK'
      };

      const message = apiUtils.getErrorMessage(error);

      expect(message).toBe('Network error. Please check your internet connection.');
    });

    it('returns API error message when provided', () => {
      const customMessage = 'Custom API error message';
      const error = {
        response: {
          status: 400,
          data: { message: customMessage }
        }
      };

      const message = apiUtils.getErrorMessage(error);

      expect(message).toBe(customMessage);
    });

    it('returns generic message for unknown errors', () => {
      const error = {
        someOtherProperty: 'unknown error'
      };

      const message = apiUtils.getErrorMessage(error);

      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('handles non-axios errors', () => {
      const error = new Error('Regular JavaScript error');

      const message = apiUtils.getErrorMessage(error);

      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('handles null or undefined errors', () => {
      expect(apiUtils.getErrorMessage(null)).toBe(
        'An unexpected error occurred. Please try again.'
      );
      expect(apiUtils.getErrorMessage(undefined)).toBe(
        'An unexpected error occurred. Please try again.'
      );
    });
  });

  describe('Axios instance configuration', () => {
    it('uses correct base URL', () => {
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: '/api'
        })
      );
    });

    it('sets correct timeout', () => {
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 10000
        })
      );
    });

    it('sets correct headers', () => {
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
    });
  });
}); 