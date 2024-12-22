import { Button } from '@/components/ui/button';
import { BellIcon } from '@/assets/icons/BellIcon';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NotificationBellProps {
  count?: number;
}

export function NotificationBell({ count }: NotificationBellProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent transition-colors"
          >
            <BellIcon />
            {count && count > 0 ? (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                {count > 9 ? '9+' : count}
              </Badge>
            ) : null}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
