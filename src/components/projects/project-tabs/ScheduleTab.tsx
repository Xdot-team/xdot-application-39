
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ScheduleTabProps {
  projectId?: string; // Made optional for backward compatibility
}

const ScheduleTab = ({ projectId }: ScheduleTabProps = {}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Foundation Phase</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">May 15 - June 10</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Utility Relocation</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">May 20 - June 15</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Road Paving</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">June 15 - July 20</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleTab;
