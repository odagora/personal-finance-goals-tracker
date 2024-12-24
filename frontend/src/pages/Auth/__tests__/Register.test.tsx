import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Register } from '../Register';
import { AuthContext } from '@/contexts/auth.context';

// Mock auth context
const mockRegister = vi.fn();
const mockAuthContext = {
  register: mockRegister,
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  login: vi.fn(),
  logout: vi.fn(),
};

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Test wrapper with providers
const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>{ui}</AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Register', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  it('should render registration form', () => {
    // Arrange
    renderWithProviders(<Register />);

    // Assert
    expect(screen.getByText(/CREATE YOUR ACCOUNT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/FIRST NAME/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LAST NAME/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/EMAIL ADDRESS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PASSWORD/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SIGN UP/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty form submission', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    const submitButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Act
    await act(async () => {
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/First name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should handle successful registration', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    const firstNameInput = screen.getByLabelText(/FIRST NAME/i);
    const lastNameInput = screen.getByLabelText(/LAST NAME/i);
    const emailInput = screen.getByLabelText(/EMAIL ADDRESS/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Act
    await act(async () => {
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });
  });

  it('should handle registration error', async () => {
    // Arrange
    mockRegister.mockRejectedValueOnce(new Error('Registration failed. Please try again.'));
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    const firstNameInput = screen.getByLabelText(/FIRST NAME/i);
    const lastNameInput = screen.getByLabelText(/LAST NAME/i);
    const emailInput = screen.getByLabelText(/EMAIL ADDRESS/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Act
    await act(async () => {
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Registration failed. Please try again.');
    });
  });

  it('should validate name length', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    const firstNameInput = screen.getByLabelText(/FIRST NAME/i);
    const submitButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Act
    await act(async () => {
      await user.type(firstNameInput, 'J');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/First name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Act
    await act(async () => {
      await user.type(passwordInput, 'short');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should handle unexpected registration error', async () => {
    // Arrange
    const user = userEvent.setup();
    mockRegister.mockRejectedValueOnce('Unexpected error');
    renderWithProviders(<Register />);

    const firstNameInput = screen.getByLabelText(/FIRST NAME/i);
    const lastNameInput = screen.getByLabelText(/LAST NAME/i);
    const emailInput = screen.getByLabelText(/EMAIL ADDRESS/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Act
    await act(async () => {
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('An unexpected error occurred');
    });
  });

  it('should navigate to transactions after successful registration', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    const firstNameInput = screen.getByLabelText(/FIRST NAME/i);
    const lastNameInput = screen.getByLabelText(/LAST NAME/i);
    const emailInput = screen.getByLabelText(/EMAIL ADDRESS/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Act
    await act(async () => {
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/transactions');
    });
  });
});
