
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileSpreadsheet } from "lucide-react";

const DocumentsTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Construction Drawings Rev 3</p>
              <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Material Quantity Takeoff</p>
              <p className="text-xs text-muted-foreground">Updated 5 days ago</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Site Survey Report</p>
              <p className="text-xs text-muted-foreground">Updated 1 week ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
