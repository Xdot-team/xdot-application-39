
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RFIsTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">RFI #23 - Drainage Design</p>
              <p className="text-xs text-muted-foreground">Submitted 3 days ago</p>
            </div>
            <Badge>Open</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">RFI #22 - Utility Conflict</p>
              <p className="text-xs text-muted-foreground">Submitted 5 days ago</p>
            </div>
            <Badge>Open</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RFIsTab;
