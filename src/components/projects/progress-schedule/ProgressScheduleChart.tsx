
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
import { useProgressScheduleData } from "@/hooks/useProgressSchedule";
import { Badge } from "@/components/ui/badge";

interface ProgressScheduleChartProps {
  projectId: string;
}

const ProgressScheduleChart = ({ projectId }: ProgressScheduleChartProps) => {
  const { data: scheduleData = [], isLoading } = useProgressScheduleData(projectId);
  
  const chartConfig = {
    plannedProgress: {
      label: "Planned Progress",
      color: "#3b82f6", // blue-500
    },
    actualProgress: {
      label: "Actual Progress", 
      color: "#10b981", // emerald-500
    },
  };
  
  if (isLoading) {
    return <div>Loading schedule data...</div>;
  }
  
  if (!scheduleData.length) {
    return <div>No schedule data available</div>;
  }
  
  // Find current date line
  const currentDate = new Date().toISOString().split('T')[0];
  
  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ChartContainer
          className="h-full"
          config={chartConfig}
        >
          <LineChart data={scheduleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip 
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                chartConfig[name as keyof typeof chartConfig]?.label || name
              ]}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              content={<ChartTooltipContent />}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="plannedProgress" 
              stroke={chartConfig.plannedProgress.color}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="actualProgress" 
              stroke={chartConfig.actualProgress.color}
              strokeWidth={2}
              connectNulls={false}
            />
            <ReferenceLine 
              x={currentDate} 
              stroke="#ef4444" 
              strokeDasharray="2 2" 
              label={{ value: "Today", position: "top" }}
            />
          </LineChart>
        </ChartContainer>
      </div>
      
      {/* Upcoming Milestones */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Upcoming Milestones</h4>
        <div className="flex flex-wrap gap-2">
          {scheduleData
            .filter(data => new Date(data.date) >= new Date() && data.milestones.length > 0)
            .slice(0, 5)
            .map((data, index) => 
              data.milestones.map((milestone, mIndex) => (
                <Badge key={`${index}-${mIndex}`} variant="outline" className="text-xs">
                  {milestone.title} - {new Date(milestone.due_date).toLocaleDateString()}
                </Badge>
              ))
            )}
        </div>
      </div>
    </div>
  );
};

export default ProgressScheduleChart;
