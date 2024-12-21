import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../Login';
import { AuthContext } from '@/contexts/auth.context';

// Mock auth context
const mockLogin = vi.fn();
const mockAuthContext = {
  login: mockLogin,
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  register: vi.fn(),
  logout: vi.fn(),
};

// Test wrapper with providers
const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>{ui}</AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    // Arrange
    renderWithProviders(<Login />);

    // Assert
    expect(screen.getByText(/SIGN IN TO FINTRACKER/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/EMAIL ADDRESS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PASSWORD/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SIGN IN/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot your password/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty form submission', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    const submitButton = screen.getByRole('button', { name: /SIGN IN/i });

    // Act
    await act(async () => {
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/EMAIL ADDRESS/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN IN/i });

    // Act
    await act(async () => {
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should handle login error', async () => {
    // Arrange
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/EMAIL ADDRESS/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN IN/i });

    // Act
    await act(async () => {
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });
  });

  it('should validate email format', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN IN/i });

    // Act
    await act(async () => {
      await user.type(passwordInput, '12345678');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('should render social login buttons', () => {
    // Arrange
    renderWithProviders(<Login />);

    // Assert
    expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bank Account/i })).toBeInTheDocument();
  });

  it('should render terms and agreements links', () => {
    // Arrange
    renderWithProviders(<Login />);

    // Assert
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Financial Services Agreement/i)).toBeInTheDocument();
  });

  it('should handle unexpected login error', async () => {
    // Arrange
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce('Unexpected error');
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/EMAIL ADDRESS/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);
    const submitButton = screen.getByRole('button', { name: /SIGN IN/i });

    // Act
    await act(async () => {
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'An unexpected error occurred. Please try again.'
      );
    });
  });
});
