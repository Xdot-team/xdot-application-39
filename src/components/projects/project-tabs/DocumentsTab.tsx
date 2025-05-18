
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DocumentsTabProps {
  projectId?: string; // Made optional for backward compatibility
}

const DocumentsTab = ({ projectId }: DocumentsTabProps = {}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Project Specifications.pdf</p>
              <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Site Plan Phase 2.pdf</p>
              <p className="text-xs text-muted-foreground">Updated 1 week ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Construction Schedule.xlsx</p>
              <p className="text-xs text-muted-foreground">Updated 3 days ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
