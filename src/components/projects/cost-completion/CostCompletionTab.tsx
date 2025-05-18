
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CostCompletionSummary from "./CostCompletionSummary";
import CostCompletionChart from "./CostCompletionChart";
import CostBreakdownChart from "./CostBreakdownChart";

interface CostCompletionTabProps {
  projectId: string;
}

const CostCompletionTab = ({ projectId }: CostCompletionTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost to Completion</CardTitle>
          <CardDescription>
            Track and forecast project costs to completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CostCompletionSummary projectId={projectId} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Forecast</CardTitle>
            <CardDescription>
              Projected cost curve to completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CostCompletionChart projectId={projectId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>
              Remaining costs by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CostBreakdownChart projectId={projectId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostCompletionTab;
