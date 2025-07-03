import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default placeholder text', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder text', () => {
    const customPlaceholder = 'Find your dream product';
    render(<SearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />);
    
    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'wireless headphones');
    
    expect(input).toHaveValue('wireless headphones');
  });

  it('calls onSearch when form is submitted with valid query', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, 'laptop');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('laptop');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    
    await user.type(input, 'smartphone');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('smartphone');
  });

  it('trims whitespace from query before calling onSearch', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, '  tablet  ');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('tablet');
  });

  it('does not call onSearch with empty query', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: /search/i });
    
    await user.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('does not call onSearch with only whitespace', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, '   ');
    await user.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('prevents default form submission', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const form = screen.getByRole('button', { name: /search/i }).closest('form');
    expect(form).toBeInTheDocument();
    
    if (form) {
      const preventDefaultSpy = vi.fn();
      const mockEvent = {
        preventDefault: preventDefaultSpy,
        target: form
      } as any;
      
      fireEvent.submit(form, mockEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    }
  });

  it('has proper form structure', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const form = screen.getByRole('button', { name: /search/i }).closest('form');
    const input = screen.getByPlaceholderText('Search products...');
    
    expect(form).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(form).toContainElement(input);
  });
}); 