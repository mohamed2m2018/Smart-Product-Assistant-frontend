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
    
    // Button should be disabled when no input
    expect(button).toBeDisabled();
    
    // Verify onSearch is not called
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('does not call onSearch with only whitespace', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, '   ');
    
    // Button should still be disabled with only whitespace
    expect(button).toBeDisabled();
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('prevents default form submission', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    
    // Add some text to enable the button
    await user.type(input, 'test query');
    
    // Submit the form
    await user.keyboard('{Enter}');
    
    // Verify search was called (form submission worked)
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
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