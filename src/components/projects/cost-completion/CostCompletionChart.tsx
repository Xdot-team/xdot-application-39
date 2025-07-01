
import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useProject } from "@/hooks/useProjects";
import { useProjectBudgetItems } from "@/hooks/useProjectBudget";
import { formatCurrency } from "@/lib/formatters";

interface CostCompletionChartProps {
  projectId: string;
}

const CostCompletionChart = ({ projectId }: CostCompletionChartProps) => {
  const { data: project } = useProject(projectId);
  const { data: budgetItems = [] } = useProjectBudgetItems(projectId);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (project) {
      // Generate mock historical data for the chart
      const startDate = project.start_date ? new Date(project.start_date) : new Date();
      const endDate = project.end_date ? new Date(project.end_date) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const totalDuration = endDate.getTime() - startDate.getTime();
      const currentDate = new Date();
      
      const budget = project.budget_allocated || project.contractValue || 0;
      const currentProgress = project.progress_percentage || 0;
      const budgetSpent = project.budget_spent || 0;
      
      // Generate monthly data points
      const data = [];
      const monthsTotal = Math.ceil(totalDuration / (30 * 24 * 60 * 60 * 1000));
      
      for (let i = 0; i <= monthsTotal; i++) {
        const date = new Date(startDate.getTime() + (i * 30 * 24 * 60 * 60 * 1000));
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const plannedProgress = Math.min((i / monthsTotal) * 100, 100);
        const plannedCost = (plannedProgress / 100) * budget;
        
        let actualProgress = 0;
        let actualCost = 0;
        
        if (date <= currentDate) {
          // Use S-curve for realistic progress
          const timeProgress = Math.min(i / monthsTotal, 1);
          actualProgress = Math.min(
            (3 * Math.pow(timeProgress, 2) - 2 * Math.pow(timeProgress, 3)) * currentProgress,
            currentProgress
          );
          actualCost = (actualProgress / 100) * budget;
          
          // Add some variance for realism
          if (i === Math.floor((currentDate.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000))) {
            actualCost = budgetSpent;
          }
        }
        
        // Forecast future costs
        let forecastCost = actualCost;
        if (date > currentDate && currentProgress > 0) {
          const remainingProgress = 100 - currentProgress;
          const costEfficiency = budgetSpent / ((currentProgress / 100) * budget) || 1;
          const futureMonths = monthsTotal - i;
          const progressRate = remainingProgress / Math.max(futureMonths, 1);
          const monthlyForecastProgress = Math.min(plannedProgress, currentProgress + (progressRate * (i - Math.floor((currentDate.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000)))));
          forecastCost = budgetSpent + ((monthlyForecastProgress - currentProgress) / 100) * budget * costEfficiency;
        }
        
        data.push({
          month: monthName,
          plannedCost: Math.round(plannedCost),
          actualCost: date <= currentDate ? Math.round(actualCost) : null,
          forecastCost: date > currentDate ? Math.round(forecastCost) : Math.round(actualCost),
        });
      }
      
      setChartData(data);
    }
  }, [project, budgetItems]);
  
  const chartConfig = {
    plannedCost: {
      label: "Planned Cost",
      color: "#3b82f6", // blue-500
    },
    actualCost: {
      label: "Actual Cost",
      color: "#10b981", // emerald-500
    },
    forecastCost: {
      label: "Forecast Cost",
      color: "#f59e0b", // amber-500
    },
  };
  
  if (!chartData.length) {
    return <div>Loading chart data...</div>;
  }
  
  return (
    <div className="h-[300px]">
      <ChartContainer
        className="h-full"
        config={chartConfig}
      >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <ChartTooltip 
            formatter={(value: number, name: string) => [
              formatCurrency(value), 
              chartConfig[name as keyof typeof chartConfig]?.label || name
            ]}
            content={<ChartTooltipContent />}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="plannedCost" 
            stroke={chartConfig.plannedCost.color}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="actualCost" 
            stroke={chartConfig.actualCost.color}
            strokeWidth={2}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="forecastCost" 
            stroke={chartConfig.forecastCost.color}
            strokeWidth={2}
            strokeDasharray="10 5"
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

// Helper function to generate realistic cost data
function generateMockCostData(projectId: string) {
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
    laborRemaining: Math.round(remainingValue * 0.45 / 10000) * 10000,
    materialsRemaining: Math.round(remainingValue * 0.35 / 10000) * 10000,
    equipmentRemaining: Math.round(remainingValue * 0.15 / 10000) * 10000,
    subcontractorRemaining: Math.round(remainingValue * 0.03 / 10000) * 10000,
    otherRemaining: Math.round(remainingValue * 0.02 / 10000) * 10000,
    riskFactors: ["Weather delays", "Material price fluctuations", "Labor availability"],
    lastUpdated: new Date().toISOString(),
    updatedBy: "John Smith",
  };
}

export default CostCompletionChart;
