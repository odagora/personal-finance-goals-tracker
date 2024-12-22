import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuthContext';

export function TopNav() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header className="border-b">
      <nav className="container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-bold">
          Logo
        </Link>
        <div className="flex gap-4">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
