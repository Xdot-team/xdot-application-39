
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NotificationsTabProps {
  projectId?: string;
  notificationCount?: number;
}

const NotificationsTab = ({ projectId, notificationCount = 4 }: NotificationsTabProps = {}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">RFI Response Required</p>
              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Urgent</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Due today</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Change Order Review</p>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">High</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Due in 2 days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
