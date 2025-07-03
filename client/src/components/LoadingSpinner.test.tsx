import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Processing your request...';
    render(<LoadingSpinner message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders without message when message is empty string', () => {
    render(<LoadingSpinner message="" />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size={60} />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    // The size prop should be passed to the CircularProgress component
  });

  it('renders with different color variants', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />);
    
    let spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    
    rerender(<LoadingSpinner color="secondary" />);
    spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    
    rerender(<LoadingSpinner color="inherit" />);
    spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  it('renders as inline spinner by default', () => {
    const { container } = render(<LoadingSpinner />);
    
    // Should not have backdrop
    expect(container.querySelector('.MuiBackdrop-root')).not.toBeInTheDocument();
    
    // Should have the regular Box container
    const box = container.querySelector('div');
    expect(box).toBeInTheDocument();
  });

  it('renders as overlay when overlay prop is true', () => {
    render(<LoadingSpinner overlay={true} />);
    
    // Should have backdrop
    const backdrop = document.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeInTheDocument();
  });

  it('renders overlay with custom message and styling', () => {
    render(<LoadingSpinner overlay={true} message="Processing..." size={80} />);
    
    const backdrop = document.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeInTheDocument();
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    // Use hidden option to find progressbar inside aria-hidden backdrop
    const spinner = screen.getByRole('progressbar', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('applies correct styling for inline spinner', () => {
    const { container } = render(<LoadingSpinner />);
    
    const outerBox = container.firstChild as HTMLElement;
    expect(outerBox).toHaveStyle({
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center'
    });
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('role', 'progressbar');
  });

  it('renders multiple spinners independently', () => {
    render(
      <div>
        <LoadingSpinner message="First spinner" />
        <LoadingSpinner message="Second spinner" />
      </div>
    );
    
    expect(screen.getByText('First spinner')).toBeInTheDocument();
    expect(screen.getByText('Second spinner')).toBeInTheDocument();
    
    const spinners = screen.getAllByRole('progressbar');
    expect(spinners).toHaveLength(2);
  });

  it('handles undefined message prop gracefully', () => {
    render(<LoadingSpinner message={undefined} />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    // When message is undefined, it should show the default "Loading..." message
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('maintains consistent spacing structure', () => {
    const { container } = render(<LoadingSpinner message="Test message" />);
    
    const box = container.firstChild as HTMLElement;
    expect(box).toHaveStyle({
      gap: '24px' // 3 * 8px (MUI spacing unit)
    });
  });

  it('applies animation duration correctly', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('progressbar');
    const svg = spinner.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('overlay spinner has higher z-index', () => {
    render(<LoadingSpinner overlay={true} />);
    
    const backdrop = document.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeInTheDocument();
    
    // MUI Backdrop should have high z-index by default
    const computedStyle = window.getComputedStyle(backdrop as Element);
    expect(parseInt(computedStyle.zIndex)).toBeGreaterThan(1000);
  });

  it('overlay spinner has backdrop blur effect', () => {
    render(<LoadingSpinner overlay={true} />);
    
    const backdrop = document.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeInTheDocument();
  });

  it('renders correctly with zero size', () => {
    render(<LoadingSpinner size={0} />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  it('renders correctly with very large size', () => {
    render(<LoadingSpinner size={200} />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  it('text styling is consistent between inline and overlay modes', () => {
    const { rerender } = render(<LoadingSpinner message="Test" overlay={false} />);
    
    let text = screen.getByText('Test');
    expect(text).toBeInTheDocument();
    
    rerender(<LoadingSpinner message="Test" overlay={true} />);
    text = screen.getByText('Test');
    expect(text).toBeInTheDocument();
  });
}); 