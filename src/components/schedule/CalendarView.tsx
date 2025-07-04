
import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Event, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { CalendarToolbar } from './CalendarToolbar';
import { EventDetails } from './EventDetails';
import { useScheduleEvents } from '@/hooks/useScheduleData';
import { Loader2, Plus } from 'lucide-react';
import { ScheduleForm } from './ScheduleForm';
import { ViewMode } from '@/types/schedule';

// Setup localizer for react-big-calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function CalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const { events: scheduleEvents, loading, updateEvent } = useScheduleEvents();

  // Transform database events to calendar format
  const events = scheduleEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start_date),
    end: new Date(event.end_date),
    allDay: event.all_day,
    resource: {
      ...event,
      type: event.event_type,
      priority: event.priority,
      status: event.status,
      location: event.location,
      assignedTo: event.assignees?.[0]?.name || 'Unassigned',
      notes: event.description,
      category: event.category,
      completion: event.progress_percentage
    }
  }));

  // Event style customization based on category and priority
  const eventStyleGetter = useCallback((event: any) => {
    const priority = event.resource?.priority || 'medium';
    const category = event.resource?.category || 'other';
    
    let backgroundColor = '#3174ad';
    let borderColor = '#265985';
    
    // Color by category
    switch (category) {
      case 'project':
        backgroundColor = '#3b82f6';
        borderColor = '#2563eb';
        break;
      case 'equipment':
        backgroundColor = '#f59e0b';
        borderColor = '#d97706';
        break;
      case 'labor':
        backgroundColor = '#8b5cf6';
        borderColor = '#7c3aed';
        break;
      case 'training':
        backgroundColor = '#10b981';
        borderColor = '#059669';
        break;
      case 'meeting':
        backgroundColor = '#6b7280';
        borderColor = '#4b5563';
        break;
      case 'inspection':
        backgroundColor = '#ef4444';
        borderColor = '#dc2626';
        break;
    }
    
    // Adjust opacity based on priority
    const opacity = priority === 'high' ? 1 : priority === 'medium' ? 0.8 : 0.6;
    
    return {
      style: {
        backgroundColor,
        borderColor,
        opacity,
        color: 'white',
        border: '1px solid ' + borderColor,
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 500,
      }
    };
  }, []);

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  }, []);

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setIsFormOpen(true);
  }, []);

  const handleEventDrop = useCallback(async ({ event, start, end }: any) => {
    try {
      await updateEvent(event.id, {
        start_date: start.toISOString(),
        end_date: end.toISOString()
      });
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  }, [updateEvent]);

  const handleEventResize = useCallback(async ({ event, start, end }: any) => {
    try {
      await updateEvent(event.id, {
        start_date: start.toISOString(),
        end_date: end.toISOString()
      });
    } catch (error) {
      console.error('Failed to resize event:', error);
    }
  }, [updateEvent]);

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedEvent(null);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedSlot(null);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading schedule events...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="btn-group flex rounded-md">
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              className="px-4 rounded-l-md rounded-r-none"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              className="px-4 rounded-none border-l-0 border-r-0"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              className="px-4 rounded-r-md rounded-l-none"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
          </div>
        </div>
        
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="flex-grow bg-white rounded-lg shadow p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 350px)' }}
          view={viewMode as View}
          onView={(newView: View) => setViewMode(newView as ViewMode)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          selectable
          resizable
          dragAndDropAccessor="id"
          components={{
            toolbar: CalendarToolbar,
          }}
        />
      </div>

      {isDetailsOpen && selectedEvent && (
        <EventDetails event={selectedEvent} isOpen={isDetailsOpen} onClose={closeDetails} />
      )}

      {isFormOpen && (
        <ScheduleForm 
          isOpen={isFormOpen} 
          onClose={closeForm}
          initialData={selectedSlot ? {
            start_date: selectedSlot.start.toISOString(),
            end_date: selectedSlot.end.toISOString()
          } : undefined}
        />
      )}
    </div>
  );
}
