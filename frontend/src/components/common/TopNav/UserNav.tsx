import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from '@/assets/icons/ChevronDownIcon';
import { useAuth } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

export function UserNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/auth/login');
  };

  // Get initials from user's name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md border border-transparent py-1.5 hover:bg-accent transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user?.name || 'User'}</span>
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="cursor-pointer focus:bg-accent">Profile</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer focus:bg-accent">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer focus:bg-accent text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
