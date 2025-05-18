
import { useEffect, useState } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CostToCompletion } from "@/types/projects";
import { formatCurrency } from "@/lib/formatters";

interface CostBreakdownChartProps {
  projectId: string;
}

const CostBreakdownChart = ({ projectId }: CostBreakdownChartProps) => {
  const [costData, setCostData] = useState<CostToCompletion | null>(null);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockCostData = generateMockCostData(projectId);
    setCostData(mockCostData);
  }, [projectId]);
  
  if (!costData) return <div>Loading chart data...</div>;
  
  const data = [
    { name: 'Labor', value: costData.laborRemaining },
    { name: 'Materials', value: costData.materialsRemaining },
    { name: 'Equipment', value: costData.equipmentRemaining },
    { name: 'Subcontractor', value: costData.subcontractorRemaining },
    { name: 'Other', value: costData.otherRemaining },
  ];
  
  const chartConfig = {
    labor: {
      label: "Labor",
      color: "#3b82f6", // blue-500
    },
    materials: {
      label: "Materials",
      color: "#6366f1", // indigo-500
    },
    equipment: {
      label: "Equipment",
      color: "#8b5cf6", // violet-500
    },
    subcontractor: {
      label: "Subcontractor",
      color: "#ec4899", // pink-500
    },
    other: {
      label: "Other",
      color: "#94a3b8", // slate-400
    },
  };
  
  const COLORS = [
    chartConfig.labor.color,
    chartConfig.materials.color,
    chartConfig.equipment.color,
    chartConfig.subcontractor.color,
    chartConfig.other.color,
  ];
  
  return (
    <div className="h-[300px]">
      <ChartContainer
        className="h-full"
        config={chartConfig}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip 
            formatter={(value: number) => formatCurrency(value)}
            content={<ChartTooltipContent />} 
          />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default CostBreakdownChart;

// Import helper function from CostCompletionChart
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
