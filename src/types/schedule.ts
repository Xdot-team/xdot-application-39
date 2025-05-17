
export type EventType = 
  | 'project_milestone'
  | 'equipment_maintenance'
  | 'employee_shift'
  | 'training_session'
  | 'meeting'
  | 'inspection'
  | 'other';

export type EventCategory = 
  | 'project'
  | 'equipment'
  | 'labor'
  | 'training'
  | 'meeting'
  | 'inspection'
  | 'other';

export type EventPriority = 'low' | 'medium' | 'high';

export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

export type ViewMode = 'day' | 'week' | 'month';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  allDay: boolean;
  location?: string;
  eventType: EventType;
  category: EventCategory;
  priority: EventPriority;
  status: EventStatus;
  projectId?: string;
  projectName?: string;
  assignees: {
    id: string;
    name: string;
    type: 'employee' | 'equipment' | 'material';
  }[];
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  notes?: string;
  attachments?: string[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'employee' | 'equipment' | 'material';
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  hoursPerDay?: number;
  quantity?: number;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  attendees: {
    id: string;
    name: string;
    confirmed: boolean;
  }[];
  agenda?: string[];
  minutes?: string;
  relatedProjectId?: string;
  relatedProjectName?: string;
  virtual: boolean;
  meetingLink?: string;
  documents?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface CalendarFilter {
  eventTypes?: EventType[];
  categories?: EventCategory[];
  projects?: string[];
  resources?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  status?: EventStatus[];
}
