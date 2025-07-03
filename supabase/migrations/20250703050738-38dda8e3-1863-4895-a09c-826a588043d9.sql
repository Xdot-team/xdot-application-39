-- Create comprehensive safety tables for Phase 2-6 implementation

-- Hazard reports table
CREATE TABLE public.hazard_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hazard_number TEXT NOT NULL UNIQUE,
  reported_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reported_by TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  location TEXT NOT NULL,
  hazard_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'mitigated', 'closed')),
  mitigation_plan TEXT,
  mitigation_deadline DATE,
  assigned_to TEXT,
  resolution_notes TEXT,
  resolution_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safety training sessions table
CREATE TABLE public.safety_training_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_name TEXT NOT NULL,
  training_type TEXT NOT NULL,
  instructor TEXT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  max_attendees INTEGER DEFAULT 20,
  current_attendees INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  requirements TEXT,
  certification_provided BOOLEAN DEFAULT false,
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- JSA (Job Safety Analysis) table
CREATE TABLE public.job_safety_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jsa_number TEXT NOT NULL UNIQUE,
  job_title TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  location TEXT NOT NULL,
  date_created DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'archived')),
  job_steps JSONB NOT NULL DEFAULT '[]',
  hazards_identified JSONB NOT NULL DEFAULT '[]',
  control_measures JSONB NOT NULL DEFAULT '[]',
  ppe_required TEXT[],
  emergency_procedures TEXT,
  approved_by TEXT,
  approval_date DATE,
  review_date DATE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Toolbox meetings table
CREATE TABLE public.toolbox_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_number TEXT NOT NULL UNIQUE,
  meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meeting_time TIME NOT NULL,
  location TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  meeting_leader TEXT NOT NULL,
  topics_covered TEXT[] NOT NULL,
  attendees JSONB NOT NULL DEFAULT '[]',
  safety_concerns TEXT,
  action_items JSONB DEFAULT '[]',
  weather_conditions TEXT,
  next_meeting_date DATE,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risk assessments table (enhanced)
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('safety', 'schedule', 'budget', 'quality', 'regulatory', 'environmental', 'driver', 'equipment')),
  probability TEXT NOT NULL CHECK (probability IN ('very_low', 'low', 'medium', 'high', 'very_high')),
  impact TEXT NOT NULL CHECK (impact IN ('minimal', 'minor', 'moderate', 'significant', 'severe')),
  risk_score INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'analyzing', 'mitigating', 'monitoring', 'closed')),
  project_id UUID REFERENCES projects(id),
  identified_by TEXT NOT NULL,
  identification_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL CHECK (source IN ('manual_entry', 'ai_prediction', 'jsa_analysis', 'incident_analysis', 'driver_data', 'compliance_issue')),
  mitigation_strategy TEXT,
  mitigation_actions JSONB DEFAULT '[]',
  responsible_party TEXT,
  target_completion_date DATE,
  actual_completion_date DATE,
  ai_confidence INTEGER CHECK (ai_confidence BETWEEN 0 AND 100),
  predicted_triggers TEXT[],
  affected_areas TEXT[],
  is_high_priority BOOLEAN DEFAULT false,
  related_incidents UUID[],
  related_hazards UUID[],
  related_jsa UUID[],
  last_review_date DATE,
  next_review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comprehensive schedule tables

-- Meetings table (enhanced)
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('project_review', 'safety', 'coordination', 'client', 'training', 'other')),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  organizer TEXT NOT NULL,
  attendees JSONB DEFAULT '[]',
  agenda JSONB DEFAULT '[]',
  project_id UUID REFERENCES projects(id),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  meeting_minutes TEXT,
  action_items JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Resource allocations table (enhanced)
CREATE TABLE public.resource_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('employee', 'equipment', 'material', 'subcontractor')),
  resource_id UUID,
  resource_name TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  event_id UUID REFERENCES schedule_events(id),
  allocation_start DATE NOT NULL,
  allocation_end DATE NOT NULL,
  hours_per_day DECIMAL DEFAULT 8,
  quantity_allocated DECIMAL DEFAULT 1,
  allocation_percentage DECIMAL DEFAULT 100 CHECK (allocation_percentage BETWEEN 0 AND 100),
  cost_per_unit DECIMAL DEFAULT 0,
  total_cost DECIMAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI prediction logs table
CREATE TABLE public.ai_prediction_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('risk', 'schedule_delay', 'resource_conflict', 'safety_incident', 'budget_overrun')),
  confidence_score DECIMAL NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
  prediction_data JSONB NOT NULL,
  related_entity_type TEXT NOT NULL,
  related_entity_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'validated', 'false_positive', 'resolved')),
  validation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weather data table for schedule integration
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  temperature_high DECIMAL,
  temperature_low DECIMAL,
  humidity DECIMAL,
  precipitation DECIMAL DEFAULT 0,
  wind_speed DECIMAL,
  weather_conditions TEXT,
  visibility DECIMAL,
  work_suitability TEXT CHECK (work_suitability IN ('excellent', 'good', 'fair', 'poor', 'unsafe')),
  project_impact TEXT,
  data_source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_safety_incidents_project_id ON safety_incidents(project_id);
CREATE INDEX idx_safety_incidents_date ON safety_incidents(incident_date);
CREATE INDEX idx_safety_incidents_status ON safety_incidents(status);

CREATE INDEX idx_hazard_reports_project_id ON hazard_reports(project_id);
CREATE INDEX idx_hazard_reports_date ON hazard_reports(reported_date);
CREATE INDEX idx_hazard_reports_status ON hazard_reports(status);

CREATE INDEX idx_schedule_events_project_id ON schedule_events(project_id);
CREATE INDEX idx_schedule_events_dates ON schedule_events(start_date, end_date);
CREATE INDEX idx_schedule_events_category ON schedule_events(category);

CREATE INDEX idx_meetings_date ON meetings(date);
CREATE INDEX idx_meetings_project_id ON meetings(project_id);

CREATE INDEX idx_resource_allocations_dates ON resource_allocations(allocation_start, allocation_end);
CREATE INDEX idx_resource_allocations_project_id ON resource_allocations(project_id);

CREATE INDEX idx_risk_assessments_project_id ON risk_assessments(project_id);
CREATE INDEX idx_risk_assessments_status ON risk_assessments(status);
CREATE INDEX idx_risk_assessments_priority ON risk_assessments(is_high_priority);

-- Enable RLS
ALTER TABLE public.hazard_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_safety_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolbox_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prediction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now)
CREATE POLICY "Allow all operations on hazard_reports" ON public.hazard_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on safety_training_sessions" ON public.safety_training_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on job_safety_analyses" ON public.job_safety_analyses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on toolbox_meetings" ON public.toolbox_meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on risk_assessments" ON public.risk_assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on resource_allocations" ON public.resource_allocations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ai_prediction_logs" ON public.ai_prediction_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on weather_data" ON public.weather_data FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_hazard_reports_updated_at BEFORE UPDATE ON public.hazard_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_safety_training_sessions_updated_at BEFORE UPDATE ON public.safety_training_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_safety_analyses_updated_at BEFORE UPDATE ON public.job_safety_analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_toolbox_meetings_updated_at BEFORE UPDATE ON public.toolbox_meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risk_assessments_updated_at BEFORE UPDATE ON public.risk_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resource_allocations_updated_at BEFORE UPDATE ON public.resource_allocations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_prediction_logs_updated_at BEFORE UPDATE ON public.ai_prediction_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();