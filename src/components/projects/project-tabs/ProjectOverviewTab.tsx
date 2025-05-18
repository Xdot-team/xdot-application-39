
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

const ProjectOverviewTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Project Description</h3>
          <p className="text-sm">Development of major highway infrastructure including lane expansion, bridge repairs, and drainage improvements.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Contract Value:</span>
              <span className="font-medium">{formatCurrency(12500000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Change Orders:</span>
              <span className="font-medium">{formatCurrency(35000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Contract:</span>
              <span className="font-medium">{formatCurrency(12535000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Billed to Date:</span>
              <span className="font-medium">{formatCurrency(5625000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Remaining:</span>
              <span className="font-medium">{formatCurrency(6910000)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Change Order Submitted</p>
              <p className="text-xs text-muted-foreground">2 days ago by John Smith</p>
            </div>
            <div>
              <p className="text-sm font-medium">Pay Application #3 Approved</p>
              <p className="text-xs text-muted-foreground">1 week ago by Sarah Johnson</p>
            </div>
            <div>
              <p className="text-sm font-medium">RFI #8 Responded</p>
              <p className="text-xs text-muted-foreground">1 week ago by Michael Chen</p>
            </div>
            <div>
              <p className="text-sm font-medium">Weekly Progress Meeting</p>
              <p className="text-xs text-muted-foreground">2 weeks ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverviewTab;
