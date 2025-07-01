
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProgressScheduleChart from "./ProgressScheduleChart";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProgressScheduleTabProps {
  projectId: string;
}

const ProgressScheduleTab = ({ projectId }: ProgressScheduleTabProps) => {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("monthly");
  const [chartView, setChartView] = useState<"planned-vs-actual" | "cost-breakdown">("planned-vs-actual");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Progress Schedule</CardTitle>
            <CardDescription>
              Visualize project progress against timeline and costs
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={(value) => setTimeframe(value as "weekly" | "monthly")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={chartView} onValueChange={(value) => setChartView(value as "planned-vs-actual" | "cost-breakdown")} className="w-full">
            <TabsList className={isMobile ? "w-full" : ""}>
              <TabsTrigger value="planned-vs-actual">Planned vs. Actual</TabsTrigger>
              <TabsTrigger value="cost-breakdown">Cost Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="planned-vs-actual" className="pt-4">
              <ProgressScheduleChart projectId={projectId} />
            </TabsContent>
            <TabsContent value="cost-breakdown" className="pt-4">
              <ProgressScheduleChart projectId={projectId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressScheduleTab;
