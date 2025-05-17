
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { mockScheduleEvents } from '@/data/mockScheduleData';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Calendar, AlertCircle } from 'lucide-react';

interface EventDetailsProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetails({ event, isOpen, onClose }: EventDetailsProps) {
  // Find the full event details from our mock data
  const fullEvent = mockScheduleEvents.find(e => e.id === event.id);
  
  if (!fullEvent) return null;

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'project':
        return 'bg-blue-100 text-blue-800';
      case 'equipment':
        return 'bg-amber-100 text-amber-800';
      case 'labor':
        return 'bg-purple-100 text-purple-800';
      case 'training':
        return 'bg-green-100 text-green-800';
      case 'meeting':
        return 'bg-slate-100 text-slate-800';
      case 'inspection':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">{fullEvent.title}</SheetTitle>
          <div className="flex flex-wrap gap-2 mt-1 mb-2">
            <Badge className={getBadgeColor(fullEvent.category)}>
              {fullEvent.category.charAt(0).toUpperCase() + fullEvent.category.slice(1)}
            </Badge>
            <Badge className={getPriorityColor(fullEvent.priority)}>
              {fullEvent.priority.charAt(0).toUpperCase() + fullEvent.priority.slice(1)} Priority
            </Badge>
          </div>
          <SheetDescription className="text-md">{fullEvent.description}</SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Date & Time</p>
              <p className="text-sm text-gray-600">
                {format(new Date(fullEvent.startDate), 'MMM d, yyyy')}
                {!fullEvent.allDay ? (
                  <> • {format(new Date(fullEvent.startDate), 'h:mm a')} - {format(new Date(fullEvent.endDate), 'h:mm a')}</>
                ) : (
                  ' • All day'
                )}
              </p>
            </div>
          </div>
          
          {fullEvent.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-600">{fullEvent.location}</p>
              </div>
            </div>
          )}
          
          {fullEvent.projectName && (
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Project</p>
                <p className="text-sm text-gray-600">{fullEvent.projectName}</p>
              </div>
            </div>
          )}
          
          {fullEvent.assignees && fullEvent.assignees.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Assignees</p>
                <ul className="text-sm text-gray-600">
                  {fullEvent.assignees.map((assignee: any) => (
                    <li key={assignee.id} className="flex items-center gap-2">
                      <span>{assignee.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {assignee.type.charAt(0).toUpperCase() + assignee.type.slice(1)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {fullEvent.notes && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Notes</p>
                <p className="text-sm text-gray-600">{fullEvent.notes}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </SheetClose>
          <Button>Edit Event</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
