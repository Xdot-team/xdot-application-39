
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ScopeWipTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between">
              <p className="text-sm font-medium">Foundation Work</p>
              <span className="text-xs">75%</span>
            </div>
            <Progress value={75} className="h-2 mt-1" />
          </div>
          <div>
            <div className="flex justify-between">
              <p className="text-sm font-medium">Utility Relocation</p>
              <span className="text-xs">45%</span>
            </div>
            <Progress value={45} className="h-2 mt-1" />
          </div>
          <div>
            <div className="flex justify-between">
              <p className="text-sm font-medium">Road Grading</p>
              <span className="text-xs">30%</span>
            </div>
            <Progress value={30} className="h-2 mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScopeWipTab;
