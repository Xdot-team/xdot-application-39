
import React, { useState } from "react";
import { ChartContainer } from "@/components/ui/chart";
import { addDays, format, startOfToday } from "date-fns";
import { mockScheduleEvents } from "@/data/mockScheduleData";
import { ScheduleEvent } from "@/types/schedule";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartGantt, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Group events by project
const groupEventsByProject = (events: ScheduleEvent[]) => {
  const projects: Record<string, {name: string, events: ScheduleEvent[]}> = {};
  
  events.forEach(event => {
    if (event.projectId && event.projectName) {
      if (!projects[event.projectId]) {
        projects[event.projectId] = {
          name: event.projectName,
          events: []
        };
      }
      projects[event.projectId].events.push(event);
    }
  });
  
  return Object.values(projects);
};

// Filter events for the next two weeks by default
const filterEventsByDateRange = (events: ScheduleEvent[], startDate: Date, endDate: Date) => {
  return events.filter(event => {
    const eventStart = new Date(event.startDate);
    return eventStart >= startDate && eventStart <= endDate;
  });
};

export function GanttView() {
  const today = startOfToday();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addDays(today, 14)); // Default 2 weeks
  const [viewDuration, setViewDuration] = useState("14"); // Default 2 weeks

  // Filter events for the selected date range
  const eventsInRange = filterEventsByDateRange(mockScheduleEvents, startDate, endDate);
  const projectGroups = groupEventsByProject(eventsInRange);
  
  // Calculate the number of days to display
  const days = [];
  let currentDay = new Date(startDate);
  while (currentDay <= endDate) {
    days.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }
  
  // Handle navigation
  const navigatePrevious = () => {
    const daysToShift = parseInt(viewDuration);
    setStartDate(addDays(startDate, -daysToShift));
    setEndDate(addDays(endDate, -daysToShift));
  };
  
  const navigateNext = () => {
    const daysToShift = parseInt(viewDuration);
    setStartDate(addDays(startDate, daysToShift));
    setEndDate(addDays(endDate, daysToShift));
  };
  
  const handleViewDurationChange = (value: string) => {
    setViewDuration(value);
    setEndDate(addDays(startDate, parseInt(value)));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <ChartGantt className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Project Timeline</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={navigatePrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="bg-muted px-3 py-1 rounded-md font-medium text-sm">
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={navigateNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          
          <Select
            value={viewDuration}
            onValueChange={handleViewDurationChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">1 Week</SelectItem>
              <SelectItem value="14">2 Weeks</SelectItem>
              <SelectItem value="30">1 Month</SelectItem>
              <SelectItem value="90">3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="gantt-container border rounded-lg overflow-auto">
        <div className="min-w-[800px]"> {/* Ensure horizontal scrolling on small screens */}
          {/* Gantt Header - Dates */}
          <div className="flex border-b">
            <div className="w-64 min-w-64 border-r p-2 bg-muted font-medium">
              Project / Task
            </div>
            <div className="flex flex-1">
              {days.map((day, index) => (
                <div 
                  key={index} 
                  className={`flex-1 min-w-[60px] p-2 text-center text-xs font-medium ${
                    format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") 
                      ? "bg-primary/10" 
                      : day.getDay() === 0 || day.getDay() === 6 
                        ? "bg-muted/50" 
                        : ""
                  }`}
                >
                  <div>{format(day, "EEE")}</div>
                  <div>{format(day, "MMM d")}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Projects and their events */}
          {projectGroups.map((project, projectIndex) => (
            <div key={projectIndex}>
              {/* Project Name Row */}
              <div className="flex border-b">
                <div className="w-64 min-w-64 border-r p-2 font-semibold bg-muted/40">
                  {project.name}
                </div>
                <div className="flex flex-1">
                  {days.map((_, dayIndex) => (
                    <div key={dayIndex} className="flex-1 min-w-[60px] border-r"></div>
                  ))}
                </div>
              </div>
              
              {/* Project Events */}
              {project.events.map((event, eventIndex) => {
                // Calculate position and width based on start and end dates
                const eventStart = new Date(event.startDate);
                const eventEnd = new Date(event.endDate);
                const startDayIndex = Math.max(0, Math.floor((eventStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
                const durationDays = Math.max(1, Math.ceil((eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24)));
                
                // Ensure visibility within current view
                const visibleStartDay = Math.max(0, startDayIndex);
                const visibleDurationDays = Math.min(durationDays, days.length - visibleStartDay);
                
                const getPriorityClass = (priority: string) => {
                  switch(priority) {
                    case 'high': return 'bg-red-500';
                    case 'medium': return 'bg-amber-500';
                    case 'low': return 'bg-green-500';
                    default: return 'bg-blue-500';
                  }
                };
                
                return (
                  <div key={eventIndex} className="flex border-b">
                    <div className="w-64 min-w-64 border-r p-2 text-sm truncate flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getPriorityClass(event.priority)}`}></span>
                      {event.title}
                    </div>
                    <div className="flex flex-1 relative">
                      {days.map((_, dayIndex) => (
                        <div key={dayIndex} className="flex-1 min-w-[60px] border-r"></div>
                      ))}
                      
                      {/* Event Bar */}
                      <div 
                        className="absolute top-1 h-6 rounded bg-blue-500 text-white text-xs flex items-center justify-start px-2 truncate"
                        style={{
                          left: `calc(${visibleStartDay} * 100% / ${days.length})`,
                          width: `calc(${visibleDurationDays} * 100% / ${days.length})`,
                        }}
                        title={`${event.title} (${format(new Date(event.startDate), "MMM d")} - ${format(new Date(event.endDate), "MMM d")})`}
                      >
                        {event.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {projectGroups.length === 0 && (
            <div className="flex border-b h-32">
              <div className="w-full flex items-center justify-center text-muted-foreground">
                No projects scheduled in this time period
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
