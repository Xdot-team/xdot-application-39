
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample notifications
const notifications = [
  {
    id: '1',
    title: 'Project Update',
    message: 'I-85 Expansion project timeline updated',
    time: '5m ago',
    read: false,
  },
  {
    id: '2',
    title: 'Equipment Alert',
    message: 'Excavator #103 maintenance due',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    title: 'Document Shared',
    message: 'Tom shared "Q2 Site Safety Report"',
    time: '3h ago',
    read: true,
  },
];

export function Header() {
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter(n => !n.read).length
  );
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold">xDOTContractor</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-construction-accent text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-4 px-2 text-center text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="cursor-pointer">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="ml-2 h-2 w-2 rounded-full bg-construction-accent"></div>
                    )}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/notifications" className="w-full text-center text-sm">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
