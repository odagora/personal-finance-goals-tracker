import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { UserNav } from './UserNav';
import { NotificationBell } from './NotificationBell';
import Logo from '@/assets/images/fintracker-logo-black.png';

export function TopNav() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Fintracker" className="h-8 w-auto" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/auth/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NotificationBell count={3} />
              <UserNav />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
