import { useEffect, useState } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { api } from '@/services/api';
import { AuthContext } from './auth.context';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AxiosError } from 'axios';

// Add interface for JWT payload
interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Add interface for API error response
interface ApiErrorResponse {
  message: string;
  statusCode: number;
  status: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);

        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          throw new Error('Token expired');
        }

        const user = {
          id: decoded.userId,
          email: decoded.email,
          name: `${decoded.firstName} ${decoded.lastName}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw new Error(apiError.message);
      }
      throw new Error('An unexpected error occurred');
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await api.post('/auth/register', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw new Error(apiError.message);
      }
      throw new Error('An unexpected error occurred');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setState(initialState);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
