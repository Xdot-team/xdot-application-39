
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  MessageSquare,
  FileText,
  Clock,
  CalendarDays,
  AlertTriangle,
  CircleCheck,
  Archive,
  Link
} from "lucide-react";
import { Notification } from "@/types/projects";
import { useToast } from "@/hooks/use-toast";

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "n001",
    projectId: "1",
    title: "RFI #23 Response Required",
    message: "A response is required for RFI #23 regarding foundation specifications.",
    type: "rfi",
    priority: "urgent",
    status: "unread",
    createdAt: "2025-05-17T14:30:00Z",
    relatedItemId: "rfi23",
    relatedItemType: "rfi",
    relatedItemUrl: "/projects/1/rfis/23",
    actionRequired: true,
    dueDate: "2025-05-18"
  },
  {
    id: "n002",
    projectId: "1",
    title: "Submittal S-103 Approved",
    message: "Concrete mix design submittal (S-103) has been approved with comments.",
    type: "submittal",
    priority: "medium",
    status: "unread",
    createdAt: "2025-05-17T10:15:00Z",
    relatedItemId: "s103",
    relatedItemType: "submittal",
    relatedItemUrl: "/projects/1/submittals/s103"
  },
  {
    id: "n003",
    projectId: "1",
    title: "Change Order #7 Submitted",
    message: "A new change order has been submitted for your review.",
    type: "changeOrder",
    priority: "high",
    status: "unread",
    createdAt: "2025-05-16T16:45:00Z",
    relatedItemId: "co7",
    relatedItemType: "changeOrder",
    relatedItemUrl: "/projects/1/changeOrders/7",
    actionRequired: true,
    dueDate: "2025-05-20"
  },
  {
    id: "n004",
    projectId: "1",
    title: "Utility Meeting Scheduled",
    message: "Georgia Power coordination meeting scheduled for May 30.",
    type: "meeting",
    priority: "medium",
    status: "read",
    createdAt: "2025-05-16T09:30:00Z",
    relatedItemId: "um002",
    relatedItemType: "meeting",
    relatedItemUrl: "/projects/1/meetings/um002"
  },
  {
    id: "n005",
    projectId: "1",
    title: "Pay Application #3 Due",
    message: "Monthly pay application is due in 3 days.",
    type: "deadline",
    priority: "high",
    status: "unread",
    createdAt: "2025-05-15T11:20:00Z",
    actionRequired: true,
    dueDate: "2025-05-20"
  },
  {
    id: "n006",
    projectId: "1",
    title: "Scope of Work Update",
    message: "Bridge foundation work is now 75% complete.",
    type: "update",
    priority: "low",
    status: "read",
    createdAt: "2025-05-14T15:10:00Z"
  },
  {
    id: "n007",
    projectId: "1",
    title: "Safety Incident Reported",
    message: "Minor safety incident reported near south entrance. No injuries.",
    type: "other",
    priority: "medium",
    status: "read",
    createdAt: "2025-05-13T08:45:00Z"
  },
  {
    id: "n008",
    projectId: "1",
    title: "Material Delivery Scheduled",
    message: "Steel reinforcement delivery scheduled for May 21.",
    type: "update",
    priority: "low",
    status: "read",
    createdAt: "2025-05-12T13:25:00Z"
  },
  {
    id: "n009",
    projectId: "1",
    title: "Weather Alert",
    message: "Heavy rain expected on May 19-20. Please secure site materials.",
    type: "other",
    priority: "high",
    status: "unread",
    createdAt: "2025-05-12T10:05:00Z",
    actionRequired: true
  },
  {
    id: "n010",
    projectId: "1",
    title: "Inspector Visit Scheduled",
    message: "GDOT inspector scheduled to visit site on May 22.",
    type: "meeting",
    priority: "medium",
    status: "unread",
    createdAt: "2025-05-11T14:50:00Z",
    dueDate: "2025-05-22"
  }
];

interface NotificationListProps {
  projectId: string;
  filter: "all" | "unread" | "actionRequired";
}

const NotificationList = ({ projectId, filter }: NotificationListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Filter notifications based on the selected filter
    let filteredNotifications = mockNotifications.filter(n => n.projectId === projectId);
    
    if (filter === "unread") {
      filteredNotifications = filteredNotifications.filter(n => n.status === "unread");
    } else if (filter === "actionRequired") {
      filteredNotifications = filteredNotifications.filter(n => n.actionRequired === true);
    }
    
    // Sort notifications by creation date (newest first)
    filteredNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setNotifications(filteredNotifications);
  }, [projectId, filter]);

  const handleMarkRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, status: "read" } : n
      )
    );
    
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read",
    });
  };

  const handleArchive = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    toast({
      title: "Notification archived",
      description: "The notification has been archived",
    });
  };

  const handleNavigate = (notification: Notification) => {
    if (notification.relatedItemUrl) {
      toast({
        title: "Navigating",
        description: `Navigating to ${notification.relatedItemUrl}`,
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "rfi": return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case "submittal": return <FileText className="h-5 w-5 text-green-600" />;
      case "changeOrder": return <FileText className="h-5 w-5 text-amber-600" />;
      case "meeting": return <CalendarDays className="h-5 w-5 text-purple-600" />;
      case "deadline": return <Clock className="h-5 w-5 text-red-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return <Badge className="bg-red-500">Urgent</Badge>;
      case "high": return <Badge className="bg-amber-500">High</Badge>;
      case "medium": return <Badge className="bg-blue-500">Medium</Badge>;
      case "low": return <Badge className="bg-green-500">Low</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No notifications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map(notification => (
        <Card key={notification.id} className={`overflow-hidden ${notification.status === "unread" ? "border-l-4 border-l-blue-500" : ""}`}>
          <CardContent className="p-0">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {notification.status === "unread" && (
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2 self-start">
                      {getPriorityBadge(notification.priority)}
                      {notification.actionRequired && (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                          Action Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      
                      {notification.dueDate && (
                        <span className="ml-2 text-amber-500 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          Due: {new Date(notification.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-3 md:mt-0">
                      {notification.relatedItemUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => handleNavigate(notification)}
                        >
                          <Link className="h-4 w-4" />
                          View
                        </Button>
                      )}
                      
                      {notification.status === "unread" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => handleMarkRead(notification.id)}
                        >
                          <CircleCheck className="h-4 w-4" />
                          Mark Read
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleArchive(notification.id)}
                      >
                        <Archive className="h-4 w-4" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;
