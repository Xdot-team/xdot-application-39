
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, File, Mail } from 'lucide-react';

interface NotificationItemProps {
  id: string;
  projectName: string;
  type: 'rfi' | 'submittal' | 'change_order' | 'task' | 'update';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description: string;
  isRead: boolean;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({
  id,
  projectName,
  type,
  priority,
  dueDate,
  description,
  isRead,
  onMarkRead
}: NotificationItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'rfi':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'submittal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'change_order':
        return <File className="h-4 w-4 text-amber-500" />;
      case 'task':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityClass = () => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-500';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-500';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`border rounded-md p-3 ${isRead ? 'bg-slate-50' : 'bg-white border-l-4 border-l-blue-500'}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${!isRead && 'font-semibold'}`}>{description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{projectName}</p>
            </div>
            <Badge variant="outline" className={`text-xs ${getPriorityClass()}`}>
              {priority}
            </Badge>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Due {formatDate(dueDate)}</span>
            {!isRead && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 py-0 text-xs"
                onClick={() => onMarkRead(id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
