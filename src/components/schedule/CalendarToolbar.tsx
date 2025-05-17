
import React from 'react';
import { Navigate } from 'react-big-calendar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarToolbarProps {
  label: string;
  onNavigate: (action: Navigate) => void;
  onView: (view: string) => void;
}

export function CalendarToolbar({ label, onNavigate, onView }: CalendarToolbarProps) {
  const { toast } = useToast();

  const handleCreateEvent = () => {
    toast({
      title: "Create Event",
      description: "Event creation form would appear here",
    });
  };

  return (
    <div className="flex items-center justify-between py-4 px-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          onClick={() => onNavigate(Navigate.PREVIOUS)}
          className="p-2 h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => onNavigate(Navigate.TODAY)}
          className="px-3 h-8"
        >
          Today
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => onNavigate(Navigate.NEXT)}
          className="p-2 h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center ml-2">
          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-lg font-semibold">{label}</span>
        </div>
      </div>
      
      <Button onClick={handleCreateEvent} className="flex items-center">
        <Plus className="mr-2 h-4 w-4" /> Add Event
      </Button>
    </div>
  );
}
