
import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CostToCompletion } from "@/types/projects";
import { formatCurrency } from "@/lib/formatters";

// Generate mock data for the cost curve
const generateMockCostCurveData = (projectId: string, costData: CostToCompletion) => {
  const { revisedBudget, actualCostToDate, forecastTotalCost, completedValue } = costData;
  const completedPercent = completedValue / revisedBudget;
  const data = [];
  
  // Past data points (actual)
  for (let i = 0; i <= 10; i++) {
    const progress = (i / 10) * completedPercent;
    const idealCost = revisedBudget * progress;
    const actualCost = actualCostToDate * (progress / completedPercent);
    
    if (progress <= completedPercent) {
      data.push({
        progress: Math.round(progress * 100),
        idealCumulative: Math.round(idealCost),
        actualCumulative: Math.round(actualCost),
        isForecast: false,
      });
    }
  }
  
  const lastActualPoint = data[data.length - 1];
  
  // Future data points (forecast)
  for (let i = 1; i <= 10; i++) {
    const progress = completedPercent + (i / 10) * (1 - completedPercent);
    if (progress > 1) continue;
    
    const idealCost = revisedBudget * progress;
    
    // Calculate forecasted cost based on the efficiency so far
    const remainingProgress = progress - completedPercent;
    const totalRemainingProgress = 1 - completedPercent;
    
    const forecastedAdditionalCost = 
      (forecastTotalCost - actualCostToDate) * (remainingProgress / totalRemainingProgress);
      
    const forecastCost = actualCostToDate + forecastedAdditionalCost;
    
    data.push({
      progress: Math.round(progress * 100),
      idealCumulative: Math.round(idealCost),
      forecastCumulative: Math.round(forecastCost),
      isForecast: true,
    });
  }
  
  return data;
};

interface CostCompletionChartProps {
  projectId: string;
}

const CostCompletionChart = ({ projectId }: CostCompletionChartProps) => {
  const [costData, setCostData] = useState<CostToCompletion | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    // Using the same data generation function as CostCompletionSummary
    const mockCostData = generateMockCostData(projectId);
    setCostData(mockCostData);
    setChartData(generateMockCostCurveData(projectId, mockCostData));
  }, [projectId]);
  
  if (!costData || chartData.length === 0) return <div>Loading chart data...</div>;
  
  const chartConfig = {
    ideal: {
      label: "Budget Baseline",
      color: "#6b7280", // gray-500
    },
    actual: {
      label: "Actual Cost",
      color: "#2563eb", // blue-600
    },
    forecast: {
      label: "Forecasted Cost",
      color: "#7c3aed", // violet-600
    },
  };
  
  const currentProgress = Math.round((costData.completedValue / costData.revisedBudget) * 100);
  
  return (
    <div className="h-[300px]">
      <ChartContainer
        className="h-full"
        config={chartConfig}
      >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="progress" 
            tick={{ fontSize: 12 }} 
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <ReferenceLine x={currentProgress} stroke="#d97706" strokeDasharray="3 3" label={{
            value: 'Current',
            position: 'top',
            fill: '#d97706',
            fontSize: 12
          }} />
          <Line
            type="monotone"
            dataKey="idealCumulative"
            name="Budget Baseline"
            stroke={chartConfig.ideal.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actualCumulative"
            name="Actual Cost"
            stroke={chartConfig.actual.color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="forecastCumulative"
            name="Forecasted Cost"
            stroke={chartConfig.forecast.color}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default CostCompletionChart;

// Helper function since it's used in multiple files
function generateMockCostData(projectId: string): CostToCompletion {
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
}
