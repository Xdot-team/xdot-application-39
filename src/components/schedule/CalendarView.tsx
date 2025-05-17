
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getCategoryColor, getCalendarEvents } from '@/data/mockScheduleData';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/schedule';
import { CalendarToolbar } from './CalendarToolbar';
import { EventDetails } from './EventDetails';

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
  const events = getCalendarEvents();

  // Event style customization based on category
  const eventStyleGetter = (event: any) => {
    const categoryColor = getCategoryColor(event.category);
    
    return {
      className: `${categoryColor} rounded-md p-1 shadow-sm`,
      style: {
        fontSize: '0.75rem',
        fontWeight: 500,
      }
    };
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1 flex justify-center md:justify-start">
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
      </div>

      <div className="flex-grow bg-white rounded-lg shadow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 250px)' }}
          view={viewMode}
          onView={(newView: string) => setViewMode(newView as ViewMode)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          components={{
            toolbar: CalendarToolbar,
          }}
        />
      </div>

      {isDetailsOpen && selectedEvent && (
        <EventDetails event={selectedEvent} isOpen={isDetailsOpen} onClose={closeDetails} />
      )}
    </div>
  );
}
