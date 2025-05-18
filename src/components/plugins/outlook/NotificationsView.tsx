
import React from 'react';
import { useOutlookPlugin } from './OutlookPluginProvider';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, CheckCircle, FileText, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotificationsViewProps {
  searchQuery: string;
}

export function NotificationsView({ searchQuery }: NotificationsViewProps) {
  const { notifications, markNotificationAsRead } = useOutlookPlugin();

  const filteredNotifications = notifications.filter(notification => 
    notification.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    // In a real implementation, this would navigate to the item in xDOTContractor
    // or create a task in Outlook
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'rfi':
        return <FileText className="h-4 w-4" />;
      case 'submittal':
        return <CheckCircle className="h-4 w-4" />;
      case 'change_order':
        return <FileText className="h-4 w-4" />;
      case 'task':
        return <Calendar className="h-4 w-4" />;
      case 'update':
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 border-red-500';
      case 'medium':
        return 'text-amber-500 border-amber-500';
      case 'low':
        return 'text-green-500 border-green-500';
      default:
        return 'text-blue-500 border-blue-500';
    }
  };

  return (
    <div className="p-3">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-sm">Notifications</h3>
        <div>
          <Button variant="outline" size="sm" className="text-xs h-7">
            Sync to Calendar
          </Button>
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
            <div
              key={notification.id}
              className={`border rounded-md p-3 ${notification.isRead ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex items-start">
                <div className={`p-1 rounded-full border ${getPriorityColor(notification.priority)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{notification.projectName}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'font-medium'}`}>
                    {notification.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {notification.type.replace('_', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 px-2 py-1 text-xs">
                      {notification.isRead ? 'View' : 'Mark as Read'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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
