
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarView } from "@/components/schedule/CalendarView";
import { ResourceSchedule } from "@/components/schedule/ResourceSchedule";
import { MeetingList } from "@/components/schedule/MeetingList";
import { Calendar, Users, Clock, AlertCircle, ChartGantt, CheckCircle, XCircle } from "lucide-react";
import { GanttView } from "@/components/schedule/GanttView";
import { useScheduleEvents, useScheduleConflicts } from "@/hooks/useScheduleData";

export default function Schedule() {
  const [activeTab, setActiveTab] = useState("gantt");
  const { events } = useScheduleEvents();
  const { conflicts, resolveConflict } = useScheduleConflicts();
  const isMobile = useIsMobile();
  
  const totalEvents = events.length;
  const todayEvents = events.filter(event => {
    const today = new Date().toDateString();
    return new Date(event.start_date).toDateString() === today;
  }).length;
  
  const upcomingEvents = events.filter(event => 
    new Date(event.start_date) > new Date()
  ).length;
  
  const unresolvedConflicts = conflicts.filter(conflict => 
    conflict.status === 'unresolved'
  ).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Schedule Management"
        subheading={`Comprehensive project scheduling and resource management • ${totalEvents} total events • ${todayEvents} today • ${upcomingEvents} upcoming • ${unresolvedConflicts} conflicts`}
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
              <span>{isMobile ? "Meetings" : "Meeting Management"}</span>
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>{isMobile ? "Conflicts" : "Schedule Conflicts"}</span>
              {unresolvedConflicts > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unresolvedConflicts}
                </Badge>
              )}
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
            {conflicts.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Schedule Conflicts</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    All resources are properly allocated with no overlapping schedules. 
                    The system automatically monitors for conflicts and will alert you when issues arise.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Schedule Conflicts ({conflicts.length})</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {unresolvedConflicts} unresolved
                    </Badge>
                    <Badge variant="outline">
                      {conflicts.filter(c => c.status === 'resolved').length} resolved
                    </Badge>
                  </div>
                </div>
                
                {conflicts.map((conflict) => (
                  <Card key={conflict.id} className={`border-l-4 ${getSeverityColor(conflict.severity)}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <h4 className="font-semibold capitalize">
                              {conflict.conflict_type.replace('_', ' ')}
                            </h4>
                            <Badge className={getSeverityColor(conflict.severity)}>
                              {conflict.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {conflict.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Detected on {new Date(conflict.detected_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {conflict.status === 'unresolved' ? (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => resolveConflict(conflict.id, "Manual resolution applied")}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Resolve
                              </Button>
                            </div>
                          ) : conflict.status === 'resolved' ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Resolved</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm font-medium capitalize">{conflict.status}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {conflict.suggested_resolution && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                          <h5 className="text-sm font-medium text-blue-900 mb-1">Suggested Resolution:</h5>
                          <p className="text-sm text-blue-800">{conflict.suggested_resolution}</p>
                        </div>
                      )}
                      
                      {conflict.resource_id && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium">Affected Resource: </span>
                          <span className="capitalize">{conflict.resource_type} - {conflict.resource_id}</span>
                        </div>
                      )}
                      
                      {conflict.resolved_at && (
                        <div className="mt-3 text-xs text-muted-foreground">
                          Resolved on {new Date(conflict.resolved_at).toLocaleDateString()}
                          {conflict.resolved_by && ` by ${conflict.resolved_by}`}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <footer className="py-4 text-sm text-center text-muted-foreground border-t mt-8">
        <p>Construct for Centuries</p>
      </footer>
    </div>
  );
}
