
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProgressScheduleTabProps {
  projectId?: string; // Made optional for backward compatibility
}

const ProgressScheduleTab = ({ projectId }: ProgressScheduleTabProps = {}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Planned Progress</p>
              <p className="text-xs text-muted-foreground">Based on schedule</p>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">70%</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Actual Progress</p>
              <p className="text-xs text-muted-foreground">Current status</p>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">67%</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Next Milestone</p>
              <p className="text-xs text-muted-foreground">Foundation completion</p>
            </div>
            <span className="text-xs">5 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressScheduleTab;
