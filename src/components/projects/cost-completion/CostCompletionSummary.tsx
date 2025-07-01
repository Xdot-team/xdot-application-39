
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useProject } from "@/hooks/useProjects";
import { useProjectBudgetItems } from "@/hooks/useProjectBudget";

interface CostCompletionSummaryProps {
  projectId: string;
}

const CostCompletionSummary = ({ projectId }: CostCompletionSummaryProps) => {
  const { data: project } = useProject(projectId);
  const { data: budgetItems = [] } = useProjectBudgetItems(projectId);
  
  const [costData, setCostData] = useState({
    originalBudget: 0,
    revisedBudget: 0,
    actualCostToDate: 0,
    estimatedCostToComplete: 0,
    forecastTotalCost: 0,
    costVariance: 0,
    completedValue: 0,
    remainingValue: 0,
    progressPercentage: 0
  });

  useEffect(() => {
    if (project && budgetItems) {
      const originalBudget = project.contractValue || 0;
      const budgetAllocated = project.budget_allocated || originalBudget;
      const budgetSpent = project.budget_spent || 0;
      const progressPercentage = project.progress_percentage || 0;
      
      // Calculate totals from budget items
      const totalBudgeted = budgetItems.reduce((sum, item) => sum + (item.budgeted_amount || 0), 0);
      const totalActual = budgetItems.reduce((sum, item) => sum + (item.actual_amount || 0), 0);
      
      const completedValue = (budgetAllocated * progressPercentage) / 100;
      const remainingValue = budgetAllocated - completedValue;
      const estimatedCostToComplete = remainingValue * 1.05; // 5% buffer
      const forecastTotalCost = (totalActual || budgetSpent) + estimatedCostToComplete;
      const costVariance = budgetAllocated - forecastTotalCost;

      setCostData({
        originalBudget,
        revisedBudget: budgetAllocated,
        actualCostToDate: totalActual || budgetSpent,
        estimatedCostToComplete,
        forecastTotalCost,
        costVariance,
        completedValue,
        remainingValue,
        progressPercentage
      });
    }
  }, [project, budgetItems]);

  const getVarianceStatus = () => {
    if (costData.costVariance > 0) {
      return { icon: CheckCircle, color: "text-green-600", label: "Under Budget" };
    } else if (costData.costVariance < -50000) {
      return { icon: AlertTriangle, color: "text-red-600", label: "Over Budget" };
    } else {
      return { icon: TrendingUp, color: "text-orange-600", label: "At Risk" };
    }
  };

  const varianceStatus = getVarianceStatus();
  const VarianceIcon = varianceStatus.icon;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Original vs Revised Budget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Original:</span>
              <span className="text-sm font-medium">{formatCurrency(costData.originalBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Revised:</span>
              <span className="text-sm font-medium">{formatCurrency(costData.revisedBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Variance:</span>
              <span className={`text-sm font-medium ${
                costData.revisedBudget >= costData.originalBudget ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatCurrency(costData.revisedBudget - costData.originalBudget)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actual Cost vs Forecast */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Cost Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Spent to Date:</span>
              <span className="text-sm font-medium">{formatCurrency(costData.actualCostToDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Est. to Complete:</span>
              <span className="text-sm font-medium">{formatCurrency(costData.estimatedCostToComplete)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Forecast Total:</span>
              <span className="text-sm font-medium">{formatCurrency(costData.forecastTotalCost)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Variance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <VarianceIcon className={`h-4 w-4 ${varianceStatus.color}`} />
            Cost Variance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatCurrency(Math.abs(costData.costVariance))}
            </div>
            <Badge className={costData.costVariance >= 0 ? 'bg-green-500' : 'bg-red-500'}>
              {varianceStatus.label}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {((Math.abs(costData.costVariance) / costData.revisedBudget) * 100).toFixed(1)}% variance
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress vs Budget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Progress vs Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Physical Progress</span>
                <span>{costData.progressPercentage}%</span>
              </div>
              <Progress value={costData.progressPercentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Budget Spent</span>
                <span>{((costData.actualCostToDate / costData.revisedBudget) * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={(costData.actualCostToDate / costData.revisedBudget) * 100} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostCompletionSummary;
