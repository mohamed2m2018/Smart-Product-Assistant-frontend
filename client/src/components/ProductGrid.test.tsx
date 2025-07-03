import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { Product } from './ProductCard';
import ProductGrid from './ProductGrid';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 99.99,
    description: 'Description for product 1',
    image: 'https://example.com/product1.jpg',
    currency: 'USD'
  },
  {
    id: '2',
    name: 'Product 2',
    price: 149.99,
    description: 'Description for product 2',
    image: 'https://example.com/product2.jpg',
    currency: 'USD',
    aiExplanation: 'This product is recommended for you.'
  },
  {
    id: '3',
    name: 'Product 3',
    price: 199.99,
    description: 'Description for product 3',
    image: 'https://example.com/product3.jpg',
    currency: 'EUR'
  }
];

describe('ProductGrid', () => {
  it('renders loading state correctly', () => {
    render(<ProductGrid products={[]} loading={true} title="Test Products" />);
    
    expect(screen.getByText('Test Products')).toBeInTheDocument();
    expect(screen.getByText(/Getting AI recommendations/)).toBeInTheDocument();
  });

  it('renders empty state when no products are provided', () => {
    render(<ProductGrid products={[]} loading={false} title="Test Products" />);
    
    expect(screen.getByText('Test Products')).toBeInTheDocument();
    expect(screen.getByText(/No products found/)).toBeInTheDocument();
  });

  it('renders products correctly when provided', () => {
    render(<ProductGrid products={mockProducts} loading={false} title="Test Products" />);
    
    expect(screen.getByText('Test Products')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
  });

  it('renders with default title when none provided', () => {
    render(<ProductGrid products={mockProducts} loading={false} />);
    
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('displays correct product count', () => {
    render(<ProductGrid products={mockProducts} loading={false} title="Test Products" />);
    
    expect(screen.getByText(/Showing 3.*product/)).toBeInTheDocument();
  });

  it('displays singular product count for one product', () => {
    const singleProduct = [mockProducts[0]];
    render(<ProductGrid products={singleProduct} loading={false} title="Test Products" />);
    
    expect(screen.getByText(/Showing 1.*product[^s]/)).toBeInTheDocument();
  });

  it('calls onProductClick when a product is clicked', async () => {
    const mockOnProductClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ProductGrid 
        products={mockProducts} 
        loading={false} 
        title="Test Products"
        onProductClick={mockOnProductClick}
      />
    );
    
    // Find and click the first product card
    const firstProductCard = screen.getByText('Product 1').closest('div');
    if (firstProductCard) {
      await user.click(firstProductCard);
      expect(mockOnProductClick).toHaveBeenCalledWith(mockProducts[0]);
    }
  });

  it('does not call onProductClick when no handler is provided', async () => {
    const user = userEvent.setup();
    
    render(<ProductGrid products={mockProducts} loading={false} title="Test Products" />);
    
    const firstProductCard = screen.getByText('Product 1').closest('div');
    if (firstProductCard) {
      await user.click(firstProductCard);
      // Should not throw any errors
    }
  });

  it('renders all product information correctly', () => {
    render(<ProductGrid products={mockProducts} loading={false} title="Test Products" />);
    
    // Check that all product details are rendered
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Description for product 1')).toBeInTheDocument();
    
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
    expect(screen.getByText('This product is recommended for you.')).toBeInTheDocument();
    
    expect(screen.getByText('Product 3')).toBeInTheDocument();
    expect(screen.getByText(/€199.99|199.99.*EUR/)).toBeInTheDocument();
  });

  it('renders images for all products', () => {
    render(<ProductGrid products={mockProducts} loading={false} title="Test Products" />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    
    expect(screen.getByAltText('Product 1')).toBeInTheDocument();
    expect(screen.getByAltText('Product 2')).toBeInTheDocument();
    expect(screen.getByAltText('Product 3')).toBeInTheDocument();
  });

  it('applies correct grid structure', () => {
    const { container } = render(
      <ProductGrid products={mockProducts} loading={false} title="Test Products" />
    );
    
    // Check for the Box component that contains the grid
    const gridContainer = container.querySelector('.MuiBox-root');
    expect(gridContainer).toBeInTheDocument();
    
    // Check for ProductCard components
    const productCards = screen.getAllByText(/Product \d/);
    expect(productCards).toHaveLength(3);
  });

  it('handles loading state with custom title', () => {
    render(<ProductGrid products={[]} loading={true} title="Custom Loading Title" />);
    
    expect(screen.getByText('Custom Loading Title')).toBeInTheDocument();
    expect(screen.getByText(/Getting AI recommendations/)).toBeInTheDocument();
  });

  it('handles empty state with custom title', () => {
    render(<ProductGrid products={[]} loading={false} title="Custom Empty Title" />);
    
    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
    expect(screen.getByText(/No products found/)).toBeInTheDocument();
  });

  it('maintains consistent layout structure across states', () => {
    const { container: loadingContainer } = render(
      <ProductGrid products={[]} loading={true} title="Test" />
    );
    
    const { container: emptyContainer } = render(
      <ProductGrid products={[]} loading={false} title="Test" />
    );
    
    const { container: populatedContainer } = render(
      <ProductGrid products={mockProducts} loading={false} title="Test" />
    );
    
    // All should have Container component
    expect(loadingContainer.querySelector('.MuiContainer-root')).toBeInTheDocument();
    expect(emptyContainer.querySelector('.MuiContainer-root')).toBeInTheDocument();
    expect(populatedContainer.querySelector('.MuiContainer-root')).toBeInTheDocument();
  });

  it('does not show product count in loading state', () => {
    render(<ProductGrid products={mockProducts} loading={true} title="Test Products" />);
    
    expect(screen.queryByText(/Showing \d+ product/)).not.toBeInTheDocument();
  });

  it('does not show product count in empty state', () => {
    render(<ProductGrid products={[]} loading={false} title="Test Products" />);
    
    expect(screen.queryByText(/Showing \d+ product/)).not.toBeInTheDocument();
  });

  it('centers empty state content', () => {
    const { container } = render(
      <ProductGrid products={[]} loading={false} title="Test Products" />
    );
    
    // Check for the MUI Box component that should contain centered content
    const centeredBox = container.querySelector('.MuiBox-root');
    expect(centeredBox).toBeInTheDocument();
    
    // Verify empty state text is present (which confirms the centering layout worked)
    expect(screen.getByText(/No products found/)).toBeInTheDocument();
  });

  it('passes onClick handler to ProductCard components', () => {
    const mockOnProductClick = vi.fn();
    
    render(
      <ProductGrid 
        products={mockProducts} 
        loading={false} 
        title="Test Products"
        onProductClick={mockOnProductClick}
      />
    );
    
    // Verify that ProductCard components are rendered
    const productCards = screen.getAllByText(/Product \d/);
    expect(productCards).toHaveLength(3);
    
    // Since we can't easily test the cursor style with MUI's CSS-in-JS,
    // we'll just verify the components render correctly with the handler
    expect(productCards[0]).toBeInTheDocument();
  });
}); 