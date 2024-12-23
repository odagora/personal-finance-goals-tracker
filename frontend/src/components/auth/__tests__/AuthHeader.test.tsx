import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthHeader } from '../AuthHeader';

// Wrap component with router for Link component
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AuthHeader', () => {
  const defaultProps = {
    text: 'Already have an account?',
    linkText: 'Sign in',
    linkHref: '/auth/login',
  };

  it('should render text and link correctly', () => {
    // Arrange
    renderWithRouter(<AuthHeader {...defaultProps} />);

    // Assert
    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.linkText)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.linkText).closest('a')).toHaveAttribute(
      'href',
      defaultProps.linkHref
    );
  });

  it('should apply correct styling classes', () => {
    // Arrange
    renderWithRouter(<AuthHeader {...defaultProps} />);

    // Assert
    // Check container div classes
    expect(screen.getByText(defaultProps.text).closest('div')).toHaveClass(
      'absolute',
      'top-8',
      'right-8'
    );

    // Check paragraph classes
    expect(screen.getByText(defaultProps.text)).toHaveClass('text-sm', 'text-muted-foreground');

    // Check link classes
    expect(screen.getByText(defaultProps.linkText)).toHaveClass('text-primary', 'hover:underline');
  });

  it('should render with different props', () => {
    // Arrange
    const customProps = {
      text: "Don't have an account?",
      linkText: 'Sign up',
      linkHref: '/auth/register',
    };
    renderWithRouter(<AuthHeader {...customProps} />);

    // Assert
    expect(screen.getByText(customProps.text)).toBeInTheDocument();
    expect(screen.getByText(customProps.linkText)).toBeInTheDocument();
    expect(screen.getByText(customProps.linkText).closest('a')).toHaveAttribute(
      'href',
      customProps.linkHref
    );
  });
});
