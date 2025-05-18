
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AIABillingTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Pay App #4</p>
              <p className="text-xs text-muted-foreground">Due June 15, 2023</p>
            </div>
            <Badge>Draft</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Pay App #3</p>
              <p className="text-xs text-muted-foreground">Submitted May 15, 2023</p>
            </div>
            <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIABillingTab;
