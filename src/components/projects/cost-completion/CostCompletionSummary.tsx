
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";
import { CostToCompletion } from "@/types/projects";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

// Mock data generator
const generateMockCostData = (projectId: string): CostToCompletion => {
  const originalBudget = Math.round((Math.random() * 5000000 + 2000000) / 10000) * 10000; // $2M to $7M
  const revisionFactor = Math.random() * 0.2 + 0.9; // 90% to 110% of original
  const revisedBudget = Math.round(originalBudget * revisionFactor / 10000) * 10000;
  
  const progressPercent = Math.random() * 0.7 + 0.2; // 20% to 90% complete
  const completedValue = Math.round(revisedBudget * progressPercent / 10000) * 10000;
  const remainingValue = revisedBudget - completedValue;
  
  const costEfficiencyFactor = Math.random() * 0.3 + 0.85; // 85% to 115% efficiency
  const actualCostToDate = Math.round(completedValue / costEfficiencyFactor / 10000) * 10000;
  
  const futureEfficiencyFactor = costEfficiencyFactor * (Math.random() * 0.1 + 0.95); // Slight variation
  const estimatedCostToComplete = Math.round(remainingValue / futureEfficiencyFactor / 10000) * 10000;
  
  const forecastTotalCost = actualCostToDate + estimatedCostToComplete;
  const costVariance = revisedBudget - forecastTotalCost;
  
  const laborPercent = 0.45;
  const materialPercent = 0.35;
  const equipmentPercent = 0.15;
  const subcontractorPercent = 0.03;
  const otherPercent = 0.02;
  
  return {
    id: `cost-${projectId}`,
    projectId,
    estimatedDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days in future
    remainingTasks: Math.round(30 * (1 - progressPercent)), // 0-30 tasks
    completedValue,
    remainingValue,
    originalBudget,
    revisedBudget,
    actualCostToDate,
    estimatedCostToComplete,
    forecastTotalCost,
    costVariance,
    laborRemaining: Math.round(remainingValue * laborPercent / 10000) * 10000,
    materialsRemaining: Math.round(remainingValue * materialPercent / 10000) * 10000,
    equipmentRemaining: Math.round(remainingValue * equipmentPercent / 10000) * 10000,
    subcontractorRemaining: Math.round(remainingValue * subcontractorPercent / 10000) * 10000,
    otherRemaining: Math.round(remainingValue * otherPercent / 10000) * 10000,
    riskFactors: ["Weather delays", "Material price fluctuations", "Labor availability"],
    lastUpdated: new Date().toISOString(),
    updatedBy: "John Smith",
  };
};

interface CostCompletionSummaryProps {
  projectId: string;
}

const CostCompletionSummary = ({ projectId }: CostCompletionSummaryProps) => {
  const [data, setData] = useState<CostToCompletion | null>(null);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    setData(generateMockCostData(projectId));
  }, [projectId]);
  
  if (!data) return <div>Loading cost data...</div>;
  
  const completionPercent = Math.round((data.completedValue / data.revisedBudget) * 100);
  const isUnderBudget = data.costVariance > 0;
  const variancePercent = Math.abs(Math.round((data.costVariance / data.revisedBudget) * 100));
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(data.revisedBudget)}</p>
                {data.revisedBudget !== data.originalBudget && (
                  <p className="text-xs text-muted-foreground">
                    Original: {formatCurrency(data.originalBudget)}
                  </p>
                )}
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Forecast at Completion</p>
                <p className="text-2xl font-bold">{formatCurrency(data.forecastTotalCost)}</p>
                <p className="text-xs text-muted-foreground">
                  {isUnderBudget ? "Under budget by " : "Over budget by "}
                  {formatCurrency(Math.abs(data.costVariance))}
                </p>
              </div>
              <div className={`rounded-full ${isUnderBudget ? 'bg-green-100' : 'bg-red-100'} p-3`}>
                {isUnderBudget ? (
                  <TrendingDown className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Project Completion</p>
                <p className="text-sm font-medium">{completionPercent}%</p>
              </div>
              <Progress value={completionPercent} className="h-2" />
              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <div>Spent: {formatCurrency(data.actualCostToDate)}</div>
                <div>Remaining: {formatCurrency(data.estimatedCostToComplete)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Labor Remaining</p>
          <p className="text-lg font-semibold">{formatCurrency(data.laborRemaining)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Materials Remaining</p>
          <p className="text-lg font-semibold">{formatCurrency(data.materialsRemaining)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Equipment Remaining</p>
          <p className="text-lg font-semibold">{formatCurrency(data.equipmentRemaining)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Subcontractor Remaining</p>
          <p className="text-lg font-semibold">{formatCurrency(data.subcontractorRemaining)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Other Remaining</p>
          <p className="text-lg font-semibold">{formatCurrency(data.otherRemaining)}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Risk Factors</p>
        <div className="flex flex-wrap gap-2">
          {data.riskFactors?.map((risk, index) => (
            <div key={index} className="bg-amber-100 text-amber-800 rounded-full px-3 py-1 text-xs">
              {risk}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CostCompletionSummary;
