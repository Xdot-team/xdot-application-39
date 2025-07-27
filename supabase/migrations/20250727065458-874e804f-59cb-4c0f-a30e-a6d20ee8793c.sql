-- Create utility_conflicts table for tracking utility scheduling conflicts
CREATE TABLE public.utility_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  utility_type TEXT NOT NULL CHECK (utility_type IN ('water', 'gas', 'electric', 'telecom', 'sewer', 'other')),
  location TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'pending', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  resolution_notes TEXT,
  resolved_date DATE,
  resolved_by TEXT,
  estimated_duration_hours NUMERIC,
  cost_impact NUMERIC DEFAULT 0,
  affected_areas TEXT[],
  related_work_orders TEXT[],
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.utility_conflicts ENABLE ROW LEVEL SECURITY;

-- Create policies for utility_conflicts
CREATE POLICY "Allow all operations on utility_conflicts" 
ON public.utility_conflicts 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_utility_conflicts_project_id ON public.utility_conflicts(project_id);
CREATE INDEX idx_utility_conflicts_status ON public.utility_conflicts(status);
CREATE INDEX idx_utility_conflicts_scheduled_date ON public.utility_conflicts(scheduled_date);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_utility_conflicts_updated_at
BEFORE UPDATE ON public.utility_conflicts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create utility_meetings table for tracking utility coordination meetings
CREATE TABLE public.utility_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  utility_type TEXT NOT NULL CHECK (utility_type IN ('water', 'gas', 'electric', 'telecom', 'sewer', 'other')),
  meeting_type TEXT NOT NULL DEFAULT 'coordination' CHECK (meeting_type IN ('coordination', 'site_visit', 'planning', 'emergency', 'follow_up')),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  agenda JSONB DEFAULT '[]',
  minutes TEXT,
  attendees JSONB DEFAULT '[]',
  action_items JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
  documents TEXT[],
  related_project_id UUID,
  related_project_name TEXT,
  organizer_name TEXT NOT NULL,
  organizer_email TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for utility_meetings
ALTER TABLE public.utility_meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for utility_meetings
CREATE POLICY "Allow all operations on utility_meetings" 
ON public.utility_meetings 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_utility_meetings_project_id ON public.utility_meetings(project_id);
CREATE INDEX idx_utility_meetings_date ON public.utility_meetings(date);
CREATE INDEX idx_utility_meetings_status ON public.utility_meetings(status);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_utility_meetings_updated_at
BEFORE UPDATE ON public.utility_meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();