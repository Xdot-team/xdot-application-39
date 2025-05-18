
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface UtilityMeetingsTabProps {
  projectId?: string; // Made optional for backward compatibility
}

const UtilityMeetingsTab = ({ projectId }: UtilityMeetingsTabProps = {}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Georgia Power Coordination</p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">May 30, 2023 - 10:00 AM</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">AT&T Line Relocation</p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">June 2, 2023 - 2:00 PM</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilityMeetingsTab;
