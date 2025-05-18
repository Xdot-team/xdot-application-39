
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarView } from "@/components/schedule/CalendarView";
import { ResourceSchedule } from "@/components/schedule/ResourceSchedule";
import { MeetingList } from "@/components/schedule/MeetingList";
import { Calendar, Users, Clock, AlertCircle, ChartGantt } from "lucide-react";
import { GanttView } from "@/components/schedule/GanttView";

export default function Schedule() {
  const [activeTab, setActiveTab] = useState("gantt");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Schedule Management"
        subheading="Manage organization-wide scheduling, resource allocations, and meetings"
      />
      
      <div className="relative">
        <Tabs
          defaultValue="gantt"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-8">
            <TabsTrigger value="gantt" className="flex items-center gap-1">
              <ChartGantt className="h-4 w-4" />
              <span>{isMobile ? "Gantt" : "Gantt Chart"}</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{isMobile ? "Calendar" : "Calendar View"}</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{isMobile ? "Resources" : "Resource Schedule"}</span>
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{isMobile ? "Meetings" : "Meeting List"}</span>
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>{isMobile ? "Conflicts" : "Scheduling Conflicts"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gantt" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <GanttView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <CalendarView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <ResourceSchedule />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <MeetingList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conflicts" className="space-y-4">
            <Card>
              <CardContent className="p-4 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Scheduling Conflicts</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    All resources are properly allocated with no overlapping schedules. 
                    Any detected conflicts will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="py-4 text-sm text-center text-muted-foreground border-t mt-8">
        <p>Construct for Centuries</p>
      </footer>
    </div>
  );
}
