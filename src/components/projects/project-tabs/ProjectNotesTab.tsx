
import { Card, CardContent } from "@/components/ui/card";

interface ProjectNotesTabProps {
  projectId?: string; // Made optional for backward compatibility
}

const ProjectNotesTab = ({ projectId }: ProjectNotesTabProps = {}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Site Meeting Follow-up</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Need to confirm utility locations with Georgia Power before excavation starts.
            </p>
            <p className="text-xs text-muted-foreground">Today - Maria Rodriguez</p>
          </div>
          <div>
            <p className="text-sm font-medium">Design Review</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Updated drawings received for foundation details.
            </p>
            <p className="text-xs text-muted-foreground">Yesterday - James Williams</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectNotesTab;
