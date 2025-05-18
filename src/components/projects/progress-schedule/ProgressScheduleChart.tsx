
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/formatters";
import { ProgressScheduleData } from "@/types/projects";

// Mock data generator
const generateMockProgressData = (
  projectId: string,
  timeframe: "weekly" | "monthly",
): ProgressScheduleData[] => {
  const now = new Date();
  const data: ProgressScheduleData[] = [];
  const totalPoints = timeframe === "weekly" ? 12 : 6; // 12 weeks or 6 months
  
  const baseLabor = Math.random() * 30000 + 10000;
  const baseMaterial = Math.random() * 50000 + 20000;
  const baseEquipment = Math.random() * 25000 + 8000;
  const baseOther = Math.random() * 15000 + 5000;
  
  for (let i = 0; i < totalPoints; i++) {
    const date = new Date();
    if (timeframe === "weekly") {
      date.setDate(now.getDate() - (totalPoints - i - 1) * 7);
    } else {
      date.setMonth(now.getMonth() - (totalPoints - i - 1));
    }
    
    const plannedProgress = Math.min(100, (i + 1) * (100 / totalPoints));
    const actualProgress = Math.min(
      100,
      plannedProgress * (Math.random() * 0.3 + 0.85) // 85% to 115% of planned
    );
    
    const plannedCost = ((i + 1) / totalPoints) * 1000000; // $1M total planned
    const actualCost = plannedCost * (Math.random() * 0.3 + 0.85); // 85% to 115% of planned
    
    const laborMultiplier = Math.random() * 0.2 + 0.9;
    const materialMultiplier = Math.random() * 0.2 + 0.9;
    const equipmentMultiplier = Math.random() * 0.2 + 0.9;
    const otherMultiplier = Math.random() * 0.2 + 0.9;
    
    data.push({
      id: `progress-${projectId}-${i}`,
      projectId,
      date: date.toISOString(),
      plannedProgress,
      actualProgress,
      plannedCost,
      actualCost,
      laborCost: baseLabor * (i + 1) * laborMultiplier,
      materialCost: baseMaterial * (i + 1) * materialMultiplier,
      equipmentCost: baseEquipment * (i + 1) * equipmentMultiplier,
      otherCost: baseOther * (i + 1) * otherMultiplier,
    });
  }
  
  return data;
};

interface ProgressScheduleChartProps {
  projectId: string;
  timeframe: "weekly" | "monthly";
  chartType: "planned-vs-actual" | "cost-breakdown";
}

export const ProgressScheduleChart = ({
  projectId,
  timeframe,
  chartType,
}: ProgressScheduleChartProps) => {
  const [data, setData] = useState<ProgressScheduleData[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setData(generateMockProgressData(projectId, timeframe));
  }, [projectId, timeframe]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return timeframe === "weekly"
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const transformedData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date),
  }));

  const chartConfig = {
    planned: {
      label: "Planned",
      color: "#2563eb", // blue-600
    },
    actual: {
      label: "Actual",
      color: "#16a34a", // green-600
    },
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
    other: {
      label: "Other",
      color: "#ec4899", // pink-500
    },
  };

  if (chartType === "planned-vs-actual") {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <ChartContainer
            className="h-[400px]"
            config={chartConfig}
          >
            <AreaChart data={transformedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="cost" 
                orientation="left" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              <YAxis 
                yAxisId="progress" 
                orientation="right" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="plannedCost"
                name="Planned Cost"
                yAxisId="cost"
                stroke={chartConfig.planned.color}
                fill={chartConfig.planned.color}
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="actualCost"
                name="Actual Cost"
                yAxisId="cost"
                stroke={chartConfig.actual.color}
                fill={chartConfig.actual.color}
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="plannedProgress"
                name="Planned Progress"
                yAxisId="progress"
                stroke={chartConfig.planned.color}
                fill={chartConfig.planned.color}
                fillOpacity={0}
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="actualProgress"
                name="Actual Progress"
                yAxisId="progress"
                stroke={chartConfig.actual.color}
                fill={chartConfig.actual.color}
                fillOpacity={0}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <ChartContainer
          className="h-[400px]"
          config={chartConfig}
        >
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => `$${(value / 1000)}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar
              dataKey="laborCost"
              name="Labor"
              stackId="a"
              fill={chartConfig.labor.color}
            />
            <Bar
              dataKey="materialCost"
              name="Materials"
              stackId="a"
              fill={chartConfig.materials.color}
            />
            <Bar
              dataKey="equipmentCost"
              name="Equipment"
              stackId="a"
              fill={chartConfig.equipment.color}
            />
            <Bar
              dataKey="otherCost"
              name="Other"
              stackId="a"
              fill={chartConfig.other.color}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
