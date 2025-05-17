
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { mockResourceAllocations } from '@/data/mockScheduleData';
import { Badge } from '@/components/ui/badge';
import { 
  format, 
  addDays, 
  startOfWeek, 
  isSameDay 
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export function ResourceSchedule() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const resourcesByType = {
    equipment: mockResourceAllocations.filter(r => r.resourceType === 'equipment'),
    employee: mockResourceAllocations.filter(r => r.resourceType === 'employee'),
    material: mockResourceAllocations.filter(r => r.resourceType === 'material')
  };

  const isAllocated = (resourceId: string, day: Date) => {
    return mockResourceAllocations.some(allocation => 
      allocation.resourceId === resourceId &&
      new Date(allocation.startDate) <= day &&
      new Date(allocation.endDate) >= day
    );
  };
  
  const getAllocationForDay = (resourceId: string, day: Date) => {
    return mockResourceAllocations.find(allocation => 
      allocation.resourceId === resourceId &&
      new Date(allocation.startDate) <= day &&
      new Date(allocation.endDate) >= day
    );
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const previousWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };
  
  const nextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const formatResourceType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(weekStart, 'MMM d, yyyy')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter Resources
        </Button>
      </div>
      
      {Object.entries(resourcesByType).map(([resourceType, allocations]) => (
        <div key={resourceType} className="rounded-md border shadow-sm">
          <div className="bg-muted px-4 py-2 border-b">
            <h3 className="font-semibold">{formatResourceType(resourceType)} Resources</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="sticky left-0 bg-muted/50 w-[200px]">Resource</TableHead>
                  {days.map(day => (
                    <TableHead key={day.toISOString()} className="text-center min-w-[120px]">
                      <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                      <div className="text-sm">{format(day, 'MMM d')}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map(allocation => {
                  const uniqueResourceIds = [...new Set(allocations.map(a => a.resourceId))];
                  if (!uniqueResourceIds.includes(allocation.resourceId)) return null;
                  
                  // Only process each resource once
                  if (allocations.findIndex(a => a.resourceId === allocation.resourceId) !== allocations.indexOf(allocation)) {
                    return null;
                  }
                  
                  return (
                    <TableRow key={allocation.resourceId}>
                      <TableCell className="font-medium sticky left-0 bg-white">
                        {allocation.resourceName}
                      </TableCell>
                      {days.map(day => {
                        const dayAllocation = getAllocationForDay(allocation.resourceId, day);
                        return (
                          <TableCell 
                            key={day.toISOString()} 
                            className={`text-center ${isAllocated(allocation.resourceId, day) ? 'bg-blue-50' : ''}`}
                          >
                            {dayAllocation && (
                              <div className="flex flex-col items-center justify-center h-full">
                                <Badge className={getStatusColor(dayAllocation.status)}>
                                  {dayAllocation.projectName}
                                </Badge>
                                <span className="text-xs mt-1">
                                  {dayAllocation.hoursPerDay ? `${dayAllocation.hoursPerDay}h` : ''}
                                  {dayAllocation.quantity ? `${dayAllocation.quantity} units` : ''}
                                </span>
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}
