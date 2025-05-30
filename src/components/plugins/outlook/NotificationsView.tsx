
import React from 'react';
import { useOutlookPlugin } from './OutlookPluginProvider';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, CheckCircle } from 'lucide-react';
import { NotificationItem } from './NotificationItem';

interface NotificationsViewProps {
  searchQuery: string;
}

export function NotificationsView({ searchQuery }: NotificationsViewProps) {
  const { notifications, markNotificationAsRead } = useOutlookPlugin();

  const filteredNotifications = notifications.filter(notification => 
    notification.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">Notifications</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-7">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Sync to Calendar
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="text-xs h-7">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center p-6">
            <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              projectName={notification.projectName}
              type={notification.type}
              priority={notification.priority}
              dueDate={notification.dueDate}
              description={notification.description}
              isRead={notification.isRead}
              onMarkRead={markNotificationAsRead}
            />
          ))
        )}
      </div>

      <div className="mt-4 text-center">
        <Button variant="ghost" size="sm" className="text-xs">
          View All in xDOTContractor
        </Button>
      </div>
    </div>
  );
}
