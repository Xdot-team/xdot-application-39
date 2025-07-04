
import React, { useState } from 'react';
import { useResourceAllocations } from '@/hooks/useScheduleData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wrench, Package, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';

export function ResourceSchedule() {
  const { allocations, loading } = useResourceAllocations();
  const [selectedResourceType, setSelectedResourceType] = useState<'all' | 'employee' | 'equipment' | 'material'>('all');
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const weekStart = startOfWeek(selectedWeek);
  const weekEnd = endOfWeek(selectedWeek);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter allocations by resource type
  const filteredAllocations = allocations.filter(allocation => 
    selectedResourceType === 'all' || allocation.resource_type === selectedResourceType
  );

  // Group allocations by resource
  const resourceGroups = filteredAllocations.reduce((groups, allocation) => {
    const key = `${allocation.resource_type}-${allocation.resource_id}`;
    if (!groups[key]) {
      groups[key] = {
        resource_id: allocation.resource_id,
        resource_name: allocation.resource_name,
        resource_type: allocation.resource_type,
        allocations: []
      };
    }
    groups[key].allocations.push(allocation);
    return groups;
  }, {} as Record<string, any>);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'employee': return <Users className="h-4 w-4" />;
      case 'equipment': return <Wrench className="h-4 w-4" />;
      case 'material': return <Package className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateUtilization = (resource: any) => {
    const totalHours = resource.allocations.reduce((sum: number, allocation: any) => {
      if (allocation.resource_type === 'employee' && allocation.hours_per_day) {
        const start = parseISO(allocation.allocation_start);
        const end = parseISO(allocation.allocation_end);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return sum + (allocation.hours_per_day * days);
      }
      return sum;
    }, 0);
    
    const availableHours = 40 * 4; // 40 hours per week, 4 weeks
    return Math.min(100, (totalHours / availableHours) * 100);
  };

  const getConflicts = (resource: any) => {
    const conflicts = [];
    const sortedAllocations = resource.allocations.sort((a: any, b: any) => 
      new Date(a.allocation_start).getTime() - new Date(b.allocation_start).getTime()
    );

    for (let i = 0; i < sortedAllocations.length - 1; i++) {
      const current = sortedAllocations[i];
      const next = sortedAllocations[i + 1];
      
      if (new Date(current.allocation_end) > new Date(next.allocation_start)) {
        conflicts.push({
          allocation1: current,
          allocation2: next,
          overlap: `${format(new Date(next.allocation_start), 'MMM d')} - ${format(new Date(current.allocation_end), 'MMM d')}`
        });
      }
    }
    
    return conflicts;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="mx-auto h-8 w-8 text-muted-foreground animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Loading resource schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedResourceType} onValueChange={(value: any) => setSelectedResourceType(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by resource type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="employee">Employees</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="material">Materials</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
          >
            Previous Week
          </Button>
          <span className="text-sm font-medium">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
          >
            Next Week
          </Button>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">Resource Schedule</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {Object.values(resourceGroups).map((resource: any) => (
            <Card key={`${resource.resource_type}-${resource.resource_id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getResourceIcon(resource.resource_type)}
                    <div>
                      <CardTitle className="text-lg">{resource.resource_name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {resource.resource_type} • {resource.allocations.length} allocation(s)
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {Math.round(calculateUtilization(resource))}% utilized
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resource.allocations.map((allocation: any) => (
                    <div key={allocation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{allocation.project_name}</h4>
                          <Badge className={getStatusColor(allocation.status)}>
                            {allocation.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{format(parseISO(allocation.allocation_start), 'MMM d')} - {format(parseISO(allocation.allocation_end), 'MMM d')}</span>
                          {allocation.hours_per_day && (
                            <span>{allocation.hours_per_day}h/day</span>
                          )}
                          {allocation.quantity_allocated && (
                            <span>{allocation.quantity_allocated} units</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(resourceGroups).map((resource: any) => {
              const utilization = calculateUtilization(resource);
              return (
                <Card key={`util-${resource.resource_type}-${resource.resource_id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.resource_type)}
                      <CardTitle className="text-base">{resource.resource_name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilization</span>
                        <span className="font-medium">{Math.round(utilization)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            utilization > 90 ? 'bg-red-500' : 
                            utilization > 70 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, utilization)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {resource.allocations.length} active allocation{resource.allocations.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          {Object.values(resourceGroups).map((resource: any) => {
            const conflicts = getConflicts(resource);
            if (conflicts.length === 0) return null;

            return (
              <Card key={`conflict-${resource.resource_type}-${resource.resource_id}`}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-lg text-amber-700">
                      {resource.resource_name} - Schedule Conflicts
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {conflicts.map((conflict: any, index: number) => (
                      <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-amber-900">Overlapping Allocations</h4>
                          <Badge variant="outline" className="text-amber-700 border-amber-300">
                            {conflict.overlap}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><strong>Project 1:</strong> {conflict.allocation1.project_name}</p>
                          <p><strong>Project 2:</strong> {conflict.allocation2.project_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {Object.values(resourceGroups).every((resource: any) => getConflicts(resource).length === 0) && (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Resource Conflicts</h3>
                <p className="text-sm text-muted-foreground">
                  All resources are properly allocated with no overlapping schedules.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
