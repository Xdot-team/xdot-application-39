
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Bell, DollarSign, FileText, MessageCircle, Clock } from "lucide-react";

const RecentUpdatesTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-purple-100 p-2">
              <CalendarDays className="h-4 w-4 text-purple-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Utility Meeting Scheduled for I-85 North Expansion</p>
              <p className="text-sm text-muted-foreground">Georgia Power coordination meeting on May 30</p>
              <p className="text-xs text-muted-foreground">Today by Maria Rodriguez</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-red-100 p-2">
              <Bell className="h-4 w-4 text-red-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Urgent RFI Response Required for I-85 North Expansion</p>
              <p className="text-sm text-muted-foreground">Response needed for foundation specifications</p>
              <p className="text-xs text-muted-foreground">2 hours ago by System</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-green-100 p-2">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Cost forecast updated for I-85 North Expansion</p>
              <p className="text-sm text-muted-foreground">Project is currently 3.2% under budget</p>
              <p className="text-xs text-muted-foreground">Yesterday by Sarah Johnson</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-blue-100 p-2">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">New RFI submitted for I-85 North Expansion</p>
              <p className="text-sm text-muted-foreground">Regarding drainage specifications at mile marker 112</p>
              <p className="text-xs text-muted-foreground">2 hours ago by James Williams</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-amber-100 p-2">
              <MessageCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Change Order #2 submitted for I-85 North Expansion</p>
              <p className="text-sm text-muted-foreground">Modified Sound Barrier Design due to undiscovered utilities</p>
              <p className="text-xs text-muted-foreground">Yesterday by Thomas Rodriguez</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-green-100 p-2">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">AIA Pay Application #3 approved for I-85 North Expansion</p>
              <p className="text-sm text-muted-foreground">Payment of $3,607,625.00 has been approved</p>
              <p className="text-xs text-muted-foreground">3 days ago by John Doe</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUpdatesTab;
