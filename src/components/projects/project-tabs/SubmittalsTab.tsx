
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SubmittalsTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Concrete Mix Design</p>
            <Badge>In Review</Badge>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Road Rebar Shop Drawings</p>
            <Badge variant="outline">Approved</Badge>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Guardrail Specs</p>
            <Badge variant="destructive">Rejected</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmittalsTab;
