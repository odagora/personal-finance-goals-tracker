import { useEffect, useState } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { api } from '@/services/api';
import { AuthContext } from './auth.context';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Get user profile
      const response = await api.get('/auth/profile');
      const user = response.data;

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // Clear invalid token
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
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
  };

  const register = async (credentials: RegisterCredentials) => {
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
