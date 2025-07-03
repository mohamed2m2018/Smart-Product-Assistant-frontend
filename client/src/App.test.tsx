import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

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

// Mock the API service
vi.mock('./services/api', () => ({
  productApi: {
    getAllProducts: vi.fn(),
    aiSearch: vi.fn(),
  },
  apiUtils: {
    getErrorMessage: vi.fn((error) => 'API Error occurred'),
  },
}));

import { productApi } from './services/api';

const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    description: 'High-quality wireless headphones with noise cancellation.',
    image: 'https://example.com/headphones.jpg',
    currency: 'USD'
  },
  {
    id: '2', 
    name: 'Gaming Laptop',
    price: 1299.99,
    description: 'Powerful gaming laptop with RTX graphics.',
    image: 'https://example.com/laptop.jpg',
    currency: 'USD',
    aiExplanation: 'Perfect for gaming with high-end specs and great performance.'
  }
];

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main application layout', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);

    render(<App />);

    // Check header content
    expect(screen.getByText('Smart Product Assistant')).toBeInTheDocument();
    expect(screen.getByText(/Get personalized product recommendations powered by AI/)).toBeInTheDocument();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows loading state on initial load', () => {
    (productApi.getAllProducts as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<App />);

    expect(screen.getByText('Initializing AI Product Assistant...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('loads and displays products on mount', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('$1,299.99')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(productApi.getAllProducts).toHaveBeenCalledTimes(1);
  });

  it('handles search workflow correctly', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);
    (productApi.aiSearch as any).mockResolvedValue([mockProducts[1]]); // Return only laptop

    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Find and interact with search bar
    const searchInput = screen.getByPlaceholderText(/Describe what you're looking for/);
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Perform search
    await user.type(searchInput, 'gaming laptop');
    await user.click(searchButton);

    // Check that AI search was called
    expect(productApi.aiSearch).toHaveBeenCalledWith('gaming laptop');

    // Wait for search results using more flexible text matching
    await waitFor(() => {
      expect(screen.getByText(/AI recommendations for:/)).toBeInTheDocument();
      expect(screen.getByText(/gaming laptop/)).toBeInTheDocument();
      expect(screen.getByText('AI Recommendations (1 found)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Should only show the laptop now
    expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
    expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
  });

  it('shows AI explanations in search results', async () => {
    (productApi.getAllProducts as any).mockResolvedValue([]);
    (productApi.aiSearch as any).mockResolvedValue([mockProducts[1]]);

    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Featured Products (0 total)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Perform search
    const searchInput = screen.getByPlaceholderText(/Describe what you're looking for/);
    await user.type(searchInput, 'gaming setup');
    await user.keyboard('{Enter}');

    // Wait for AI explanation to appear
    await waitFor(() => {
      expect(screen.getByText(/Perfect for gaming with high-end specs/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles search errors gracefully', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);
    (productApi.aiSearch as any).mockRejectedValue(new Error('AI service unavailable'));

    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Perform search that will fail
    const searchInput = screen.getByPlaceholderText(/Describe what you're looking for/);
    await user.type(searchInput, 'test query');
    await user.keyboard('{Enter}');

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('API Error occurred')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles initial load errors', async () => {
    (productApi.getAllProducts as any).mockRejectedValue(new Error('Failed to fetch'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('API Error occurred')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('allows clearing search results', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);
    (productApi.aiSearch as any).mockResolvedValue([mockProducts[0]]);

    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Perform search
    const searchInput = screen.getByPlaceholderText(/Describe what you're looking for/);
    await user.type(searchInput, 'headphones');
    await user.keyboard('{Enter}');

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText(/AI recommendations for:/)).toBeInTheDocument();
      expect(screen.getByText(/headphones/)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Clear search
    const clearButton = screen.getByText('Clear search and show all products');
    await user.click(clearButton);

    // Should fetch all products again
    expect(productApi.getAllProducts).toHaveBeenCalledTimes(2);

    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
      expect(screen.queryByText(/AI recommendations for:/)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles product click interactions', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const user = userEvent.setup();
    render(<App />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Click on a product
    const productCard = screen.getByText('Wireless Headphones').closest('div');
    if (productCard) {
      await user.click(productCard);
    }

    expect(consoleSpy).toHaveBeenCalledWith('Product clicked:', mockProducts[0]);
    expect(alertSpy).toHaveBeenCalledWith(
      'Product: Wireless Headphones\nPrice: $99.99\nID: 1'
    );

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('prevents empty search submissions', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);

    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Try to submit empty search
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // AI search should not have been called
    expect(productApi.aiSearch).not.toHaveBeenCalled();
  });

  it('shows loading state during search', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);
    (productApi.aiSearch as any).mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve([mockProducts[0]]), 100)
    ));

    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Start search
    const searchInput = screen.getByPlaceholderText(/Describe what you're looking for/);
    await user.type(searchInput, 'test');
    await user.keyboard('{Enter}');

    // Should show loading state
    expect(screen.getByText('Getting AI recommendations...')).toBeInTheDocument();

    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('AI Recommendations (1 found)')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('maintains proper app state throughout user journey', async () => {
    (productApi.getAllProducts as any).mockResolvedValue(mockProducts);
    (productApi.aiSearch as any).mockResolvedValue([mockProducts[1]]);

    const user = userEvent.setup();
    render(<App />);

    // 1. Initial load
    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // 2. Search
    const searchInput = screen.getByPlaceholderText(/Describe what you're looking for/);
    await user.type(searchInput, 'laptop');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('AI Recommendations (1 found)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // 3. Clear search
    const clearButton = screen.getByText('Clear search and show all products');
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('Featured Products (2 total)')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify API calls
    expect(productApi.getAllProducts).toHaveBeenCalledTimes(2); // Initial + after clear
    expect(productApi.aiSearch).toHaveBeenCalledTimes(1);
  });
}); 