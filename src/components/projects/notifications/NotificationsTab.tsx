
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Filter, Check, Archive, Clock, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationList from "./NotificationList";

interface NotificationsTabProps {
  projectId: string;
}

const NotificationsTab = ({ projectId }: NotificationsTabProps) => {
  const [filter, setFilter] = useState<"all" | "unread" | "actionRequired">("all");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Notifications</h2>
          <p className="text-muted-foreground">
            View and manage project notifications and action items
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Check className="h-4 w-4" /> Mark All Read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>
            Stay updated on project events and required actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as "all" | "unread" | "actionRequired")}
            className="w-full"
          >
            <TabsList className={isMobile ? "w-full" : ""}>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="actionRequired">Action Required</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <NotificationList projectId={projectId} filter="all" />
            </TabsContent>
            <TabsContent value="unread" className="pt-4">
              <NotificationList projectId={projectId} filter="unread" />
            </TabsContent>
            <TabsContent value="actionRequired" className="pt-4">
              <NotificationList projectId={projectId} filter="actionRequired" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Priority Overview</CardTitle>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Urgent</span>
                <Badge className="bg-red-500">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High</span>
                <Badge className="bg-amber-500">4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium</span>
                <Badge className="bg-blue-500">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low</span>
                <Badge className="bg-green-500">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notification Types</CardTitle>
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">RFI Responses</span>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Submittal Deadlines</span>
                <Badge variant="outline">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Change Orders</span>
                <Badge variant="outline">4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Meetings</span>
                <Badge variant="outline">5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Due Soon</CardTitle>
              <Clock className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">RFI #23 Response Required</p>
                <p className="text-xs text-red-500">Due Today</p>
              </div>
              <div>
                <p className="text-sm font-medium">Change Order Approval</p>
                <p className="text-xs text-amber-500">Due Tomorrow</p>
              </div>
              <div>
                <p className="text-sm font-medium">Weekly Progress Meeting</p>
                <p className="text-xs text-blue-500">In 2 days</p>
              </div>
              <div>
                <p className="text-sm font-medium">Submittal Review</p>
                <p className="text-xs text-blue-500">In 3 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsTab;
