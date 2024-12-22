import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../index';

describe('PageHeader', () => {
  it('should render title', () => {
    // Arrange
    render(<PageHeader title="Test Title" />);

    // Assert
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    // Arrange
    render(<PageHeader title="Test Title" description="Test Description" />);

    // Assert
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    // Arrange
    const { container } = render(<PageHeader title="Test Title" />);

    // Assert
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });
});
