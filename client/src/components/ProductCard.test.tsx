import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import type { Product } from './ProductCard';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  description: 'This is a test product description that should be displayed in the card.',
  image: 'https://example.com/test-image.jpg',
  currency: 'USD'
};

const mockProductWithAI: Product = {
  ...mockProduct,
  aiExplanation: 'This product is perfect for you because it matches your requirements perfectly.'
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product description that should be displayed in the card.')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
  });

  it('handles image error with fallback', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product') as HTMLImageElement;
    
    // Simulate image error
    fireEvent.error(image);
    
    expect(image.src).toBe('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMTgwVjEyMEgxMjBWODBaIiBmaWxsPSIjRTBFMEUwIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjQzBDMEMwIi8+CjxwYXRoIGQ9Ik0xMzAgMTEwTDE0NSA5NUwxNjAgMTEwSDE3MFYxMjBIMTMwVjExMFoiIGZpbGw9IiNDMEMwQzAiLz4KPHRleHQgeD0iMTUwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=');
  });

  it('formats price correctly with different currencies', () => {
    const productWithEUR = { ...mockProduct, price: 85.50, currency: 'EUR' };
    render(<ProductCard product={productWithEUR} />);
    
    // Should format as EUR currency
    expect(screen.getByText(/€85.50|85.50.*EUR/)).toBeInTheDocument();
  });

  it('formats price with default USD currency when currency is not provided', () => {
    const productWithoutCurrency = { 
      ...mockProduct, 
      currency: undefined 
    };
    render(<ProductCard product={productWithoutCurrency} />);
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onClick handler when card is clicked', async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();
    
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
    
    const card = screen.getByRole('img').closest('[data-testid]') || 
                 screen.getByRole('img').closest('div');
    
    if (card) {
      await user.click(card);
      expect(mockOnClick).toHaveBeenCalledWith(mockProduct);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClick when no handler is provided', async () => {
    const user = userEvent.setup();
    
    render(<ProductCard product={mockProduct} />);
    
    const card = screen.getByRole('img').closest('div');
    if (card) {
      await user.click(card);
      // Should not throw any errors
    }
  });

  it('applies hover styles when onClick is provided', () => {
    const mockOnClick = vi.fn();
    
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
    
    // Find the Card component which has the cursor style applied
    const card = screen.getByRole('img').closest('.MuiCard-root') || 
                 screen.getByRole('img').parentElement?.parentElement;
    expect(card).toHaveStyle('cursor: pointer');
  });

  it('does not apply hover styles when onClick is not provided', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Find the Card component which has the cursor style applied
    const card = screen.getByRole('img').closest('.MuiCard-root') || 
                 screen.getByRole('img').parentElement?.parentElement;
    expect(card).toHaveStyle('cursor: default');
  });

  it('displays AI explanation when provided', () => {
    render(<ProductCard product={mockProductWithAI} />);
    
    expect(screen.getByText('This product is perfect for you because it matches your requirements perfectly.')).toBeInTheDocument();
    
    // Should display the AI icon (using a more flexible approach)
    const aiIcon = document.querySelector('svg[data-testid="SmartToyIcon"]') || 
                   document.querySelector('[aria-label*="smart"]') ||
                   screen.queryByText(/smart/i);
    expect(aiIcon).toBeTruthy();
  });

  it('does not display AI explanation section when not provided', () => {
    render(<ProductCard product={mockProduct} />);
    
    // AI explanation text should not be present
    expect(screen.queryByText(/perfect for you/)).not.toBeInTheDocument();
    
    // AI icon should not be present
    const aiIcon = document.querySelector('svg[data-testid="SmartToyIcon"]');
    expect(aiIcon).not.toBeInTheDocument();
  });

  it('truncates long descriptions correctly', () => {
    const productWithLongDescription = {
      ...mockProduct,
      description: 'This is a very long description that should be truncated after a certain number of lines to ensure the card layout remains consistent and does not take up too much space on the page.'
    };
    
    render(<ProductCard product={productWithLongDescription} />);
    
    const description = screen.getByText(/This is a very long description/);
    expect(description).toHaveStyle('WebkitLineClamp: 3');
    expect(description).toHaveStyle('overflow: hidden');
  });

  it('handles special characters in product name', () => {
    const productWithSpecialChars = {
      ...mockProduct,
      name: 'Product with "Quotes" & Symbols > < test'
    };
    
    render(<ProductCard product={productWithSpecialChars} />);
    
    expect(screen.getByText('Product with "Quotes" & Symbols > < test')).toBeInTheDocument();
  });

  it('handles zero price correctly', () => {
    const freeProduct = { ...mockProduct, price: 0 };
    
    render(<ProductCard product={freeProduct} />);
    
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('handles very large price correctly', () => {
    const expensiveProduct = { ...mockProduct, price: 999999.99 };
    
    render(<ProductCard product={expensiveProduct} />);
    
    expect(screen.getByText('$999,999.99')).toBeInTheDocument();
  });

  it('maintains proper card structure', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Check that all main elements are present
    const image = screen.getByRole('img');
    const title = screen.getByRole('heading', { level: 2 });
    const price = screen.getByText('$99.99');
    const description = screen.getByText(/test product description/);
    
    expect(image).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
}); 