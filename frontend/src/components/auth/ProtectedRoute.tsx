import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
}
