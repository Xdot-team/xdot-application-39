
-- Create schedule_events table to replace mock data
CREATE TABLE IF NOT EXISTS public.schedule_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('meeting', 'milestone', 'task', 'reminder', 'deadline', 'project_milestone', 'equipment_maintenance', 'employee_shift', 'training_session', 'inspection', 'other')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN NOT NULL DEFAULT false,
  location TEXT,
  project_id UUID REFERENCES public.projects(id),
  project_name TEXT,
  created_by_name TEXT NOT NULL,
  attendees JSONB DEFAULT '[]'::jsonb,
  recurrence_rule TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('tentative', 'confirmed', 'cancelled', 'scheduled', 'in_progress', 'completed', 'postponed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('project', 'equipment', 'labor', 'training', 'meeting', 'inspection', 'other')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  dependencies JSONB DEFAULT '[]'::jsonb,
  assignees JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resource_allocations table
CREATE TABLE IF NOT EXISTS public.resource_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('employee', 'equipment', 'material')),
  project_id UUID REFERENCES public.projects(id),
  project_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  hours_per_day NUMERIC,
  quantity NUMERIC,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  attendees JSONB DEFAULT '[]'::jsonb,
  agenda JSONB DEFAULT '[]'::jsonb,
  minutes TEXT,
  related_project_id UUID REFERENCES public.projects(id),
  related_project_name TEXT,
  virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schedule_conflicts table for conflict detection
CREATE TABLE IF NOT EXISTS public.schedule_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('resource_double_booking', 'schedule_overlap', 'capacity_exceeded', 'dependency_violation')),
  resource_id TEXT,
  resource_type TEXT,
  conflicting_event_ids JSONB NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  suggested_resolution TEXT,
  status TEXT NOT NULL DEFAULT 'unresolved' CHECK (status IN ('unresolved', 'acknowledged', 'resolved', 'ignored')),
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_conflicts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for schedule_events
CREATE POLICY "Allow all operations on schedule_events" ON public.schedule_events FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for resource_allocations
CREATE POLICY "Allow all operations on resource_allocations" ON public.resource_allocations FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for meetings
CREATE POLICY "Allow all operations on meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for schedule_conflicts
CREATE POLICY "Allow all operations on schedule_conflicts" ON public.schedule_conflicts FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schedule_events_date_range ON public.schedule_events (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_schedule_events_project ON public.schedule_events (project_id);
CREATE INDEX IF NOT EXISTS idx_schedule_events_type ON public.schedule_events (event_type);
CREATE INDEX IF NOT EXISTS idx_resource_allocations_date_range ON public.resource_allocations (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_resource_allocations_resource ON public.resource_allocations (resource_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON public.meetings (date);
CREATE INDEX IF NOT EXISTS idx_schedule_conflicts_status ON public.schedule_conflicts (status);

-- Create triggers for updated_at
CREATE OR REPLACE TRIGGER update_schedule_events_updated_at
  BEFORE UPDATE ON public.schedule_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_resource_allocations_updated_at
  BEFORE UPDATE ON public.resource_allocations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_schedule_conflicts_updated_at
  BEFORE UPDATE ON public.schedule_conflicts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all schedule tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.resource_allocations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_conflicts;

-- Set replica identity for realtime updates
ALTER TABLE public.schedule_events REPLICA IDENTITY FULL;
ALTER TABLE public.resource_allocations REPLICA IDENTITY FULL;
ALTER TABLE public.meetings REPLICA IDENTITY FULL;
ALTER TABLE public.schedule_conflicts REPLICA IDENTITY FULL;
