-- Phase 1: Complete Safety & Risk Management Database Schema
-- Missing Safety Tables (11 tables)

-- 1. Hazard Reports Table
CREATE TABLE public.hazard_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hazard_number TEXT NOT NULL UNIQUE,
  reported_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reported_by TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  location TEXT NOT NULL,
  hazard_type TEXT NOT NULL CHECK (hazard_type IN ('physical', 'chemical', 'biological', 'ergonomic', 'environmental', 'behavioral')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  recommended_actions TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
  assigned_to TEXT,
  target_completion_date DATE,
  actual_completion_date DATE,
  affected_workers INTEGER DEFAULT 0,
  photos TEXT[],
  corrective_actions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Risk Assessments Table
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_number TEXT NOT NULL UNIQUE,
  assessment_date DATE NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  assessed_by TEXT NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('project_startup', 'periodic', 'incident_driven', 'regulatory')),
  scope_description TEXT NOT NULL,
  methodology TEXT DEFAULT 'matrix',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'review', 'approved', 'expired')),
  approval_date DATE,
  approved_by TEXT,
  next_review_date DATE,
  overall_risk_rating TEXT CHECK (overall_risk_rating IN ('low', 'medium', 'high', 'critical')),
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Risk Assessment Items Table
CREATE TABLE public.risk_assessment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
  hazard_description TEXT NOT NULL,
  risk_category TEXT NOT NULL,
  potential_consequences TEXT NOT NULL,
  likelihood_score INTEGER NOT NULL CHECK (likelihood_score BETWEEN 1 AND 5),
  severity_score INTEGER NOT NULL CHECK (severity_score BETWEEN 1 AND 5),
  risk_score INTEGER GENERATED ALWAYS AS (likelihood_score * severity_score) STORED,
  risk_level TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN (likelihood_score * severity_score) <= 4 THEN 'low'
      WHEN (likelihood_score * severity_score) <= 12 THEN 'medium'
      WHEN (likelihood_score * severity_score) <= 20 THEN 'high'
      ELSE 'critical'
    END
  ) STORED,
  existing_controls TEXT,
  additional_controls TEXT,
  responsible_person TEXT,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'not_applicable')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Risk Mitigation Actions Table
CREATE TABLE public.risk_mitigation_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_item_id UUID NOT NULL REFERENCES public.risk_assessment_items(id) ON DELETE CASCADE,
  action_description TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('eliminate', 'substitute', 'engineering', 'administrative', 'ppe')),
  assigned_to TEXT NOT NULL,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'overdue', 'cancelled')),
  completion_date DATE,
  completion_notes TEXT,
  cost_estimate DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Safety Training Sessions Table
CREATE TABLE public.safety_training_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_name TEXT NOT NULL,
  training_type TEXT NOT NULL CHECK (training_type IN ('orientation', 'refresher', 'specialized', 'certification', 'toolbox', 'emergency')),
  instructor TEXT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  max_attendees INTEGER DEFAULT 20,
  description TEXT,
  materials_required TEXT[],
  certification_awarded BOOLEAN DEFAULT false,
  certification_expires_after_days INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  project_id UUID REFERENCES public.projects(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Training Attendance Table
CREATE TABLE public.training_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.safety_training_sessions(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employee_profiles(id),
  attendance_status TEXT NOT NULL DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent', 'late', 'excused')),
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  pass_fail TEXT CHECK (pass_fail IN ('pass', 'fail', 'pending')),
  certification_issued BOOLEAN DEFAULT false,
  certification_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Safety Certifications Table
CREATE TABLE public.safety_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employee_profiles(id),
  certification_name TEXT NOT NULL,
  certification_type TEXT NOT NULL CHECK (certification_type IN ('osha', 'first_aid', 'cpr', 'confined_space', 'fall_protection', 'hazmat', 'crane_operator', 'forklift', 'other')),
  issuing_organization TEXT NOT NULL,
  certification_number TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'revoked')),
  renewal_required BOOLEAN DEFAULT true,
  renewal_notification_days INTEGER DEFAULT 30,
  attachment_url TEXT,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Compliance Checklists Table
CREATE TABLE public.compliance_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_name TEXT NOT NULL,
  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'project_specific')),
  regulation_reference TEXT,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  assigned_to TEXT NOT NULL,
  due_date DATE NOT NULL,
  completion_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'not_applicable')),
  overall_compliance_score INTEGER CHECK (overall_compliance_score BETWEEN 0 AND 100),
  items JSONB NOT NULL DEFAULT '[]', -- Array of checklist items with status
  notes TEXT,
  inspector_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Toolbox Meetings Table
CREATE TABLE public.toolbox_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  crew_id UUID REFERENCES public.field_crews(id),
  foreman TEXT NOT NULL,
  topics_discussed TEXT[] NOT NULL,
  safety_concerns TEXT[],
  action_items TEXT[],
  weather_conditions TEXT,
  work_planned TEXT,
  hazards_identified TEXT[],
  ppe_required TEXT[],
  emergency_procedures_reviewed BOOLEAN DEFAULT false,
  attendee_count INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Toolbox Attendance Table
CREATE TABLE public.toolbox_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.toolbox_meetings(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employee_profiles(id),
  worker_name TEXT NOT NULL, -- For subcontractors who may not be in employee_profiles
  signature TEXT,
  questions_asked TEXT,
  concerns_raised TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Job Safety Analyses Table
CREATE TABLE public.job_safety_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jsa_number TEXT NOT NULL UNIQUE,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  prepared_by TEXT NOT NULL,
  reviewed_by TEXT,
  approved_by TEXT,
  preparation_date DATE NOT NULL,
  review_date DATE,
  approval_date DATE,
  effective_date DATE,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'active', 'expired', 'cancelled')),
  equipment_required TEXT[],
  materials_required TEXT[],
  personnel_required INTEGER,
  environmental_conditions TEXT,
  emergency_procedures TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. JSA Steps Table
CREATE TABLE public.jsa_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jsa_id UUID NOT NULL REFERENCES public.job_safety_analyses(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_description TEXT NOT NULL,
  potential_hazards TEXT[] NOT NULL,
  safety_precautions TEXT[] NOT NULL,
  required_ppe TEXT[],
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(jsa_id, step_number)
);

-- Phase 1: Complete Schedule Management Database Schema
-- Missing Schedule Tables (9 tables)

-- 1. Schedule Events Table (Enhanced version)
CREATE TABLE public.schedule_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('project_milestone', 'equipment_maintenance', 'employee_shift', 'training_session', 'meeting', 'inspection', 'other')),
  category TEXT NOT NULL CHECK (category IN ('project', 'equipment', 'labor', 'training', 'meeting', 'inspection', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT false,
  location TEXT,
  project_id UUID REFERENCES public.projects(id),
  created_by TEXT NOT NULL,
  assigned_to TEXT[],
  attendees TEXT[],
  notifications_enabled BOOLEAN DEFAULT true,
  notification_times INTEGER[] DEFAULT ARRAY[15, 60], -- minutes before event
  recurring_pattern TEXT CHECK (recurring_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
  recurring_interval INTEGER DEFAULT 1,
  recurring_until DATE,
  parent_event_id UUID REFERENCES public.schedule_events(id),
  color_code TEXT DEFAULT '#3b82f6',
  attachments TEXT[],
  notes TEXT,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (start_date <= end_date)
);

-- 2. Resource Allocations Table (Enhanced version)
CREATE TABLE public.resource_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('employee', 'equipment', 'material', 'subcontractor')),
  resource_id UUID, -- Can reference different tables based on resource_type
  resource_name TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  event_id UUID REFERENCES public.schedule_events(id),
  allocation_start TIMESTAMP WITH TIME ZONE NOT NULL,
  allocation_end TIMESTAMP WITH TIME ZONE NOT NULL,
  hours_per_day DECIMAL(4,2) DEFAULT 8.0,
  quantity_allocated INTEGER DEFAULT 1,
  allocation_percentage INTEGER DEFAULT 100 CHECK (allocation_percentage BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_by TEXT NOT NULL,
  notes TEXT,
  cost_per_hour DECIMAL(10,2),
  total_estimated_cost DECIMAL(12,2),
  actual_hours_worked DECIMAL(8,2),
  actual_cost DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (allocation_start <= allocation_end)
);

-- 3. Meetings Table (Enhanced version)
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('team_standup', 'client_meeting', 'safety_meeting', 'project_kickoff', 'review', 'training', 'other')),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  organizer TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  agenda JSONB DEFAULT '[]', -- Array of agenda items
  minutes TEXT,
  action_items JSONB DEFAULT '[]', -- Array of action items
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  recording_url TEXT,
  documents TEXT[], -- Array of document URLs
  recurring BOOLEAN DEFAULT false,
  recurring_pattern TEXT,
  recurring_until DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (start_time < end_time)
);

-- 4. Meeting Attendees Table
CREATE TABLE public.meeting_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  attendee_type TEXT NOT NULL CHECK (attendee_type IN ('employee', 'client', 'vendor', 'external')),
  attendee_id UUID, -- Can reference employee_profiles or other tables
  attendee_name TEXT NOT NULL,
  attendee_email TEXT,
  attendance_status TEXT NOT NULL DEFAULT 'invited' CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'tentative', 'attended', 'absent')),
  role_in_meeting TEXT CHECK (role_in_meeting IN ('organizer', 'presenter', 'attendee', 'optional')),
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  contribution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Resource Availability Table
CREATE TABLE public.resource_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('employee', 'equipment', 'room', 'vehicle')),
  resource_id UUID NOT NULL,
  resource_name TEXT NOT NULL,
  availability_start TIMESTAMP WITH TIME ZONE NOT NULL,
  availability_end TIMESTAMP WITH TIME ZONE NOT NULL,
  availability_type TEXT NOT NULL CHECK (availability_type IN ('available', 'unavailable', 'limited', 'maintenance', 'vacation', 'sick_leave')),
  reason TEXT,
  capacity_percentage INTEGER DEFAULT 100 CHECK (capacity_percentage BETWEEN 0 AND 100),
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (availability_start < availability_end)
);

-- 6. Schedule Conflicts Table
CREATE TABLE public.schedule_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('resource_double_booked', 'overlapping_events', 'deadline_conflict', 'dependency_violation', 'capacity_exceeded')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  affected_events UUID[] NOT NULL,
  affected_resources TEXT[] NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'unresolved' CHECK (status IN ('unresolved', 'acknowledged', 'resolved', 'ignored')),
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  auto_detected BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Schedule Templates Table
CREATE TABLE public.schedule_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('project', 'maintenance', 'training', 'shift', 'meeting_series')),
  description TEXT,
  template_data JSONB NOT NULL DEFAULT '{}', -- Stores template structure
  is_public BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL,
  project_category TEXT,
  estimated_duration_days INTEGER,
  resource_requirements JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  dependencies JSONB DEFAULT '[]',
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Recurring Event Instances Table
CREATE TABLE public.recurring_event_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_event_id UUID NOT NULL REFERENCES public.schedule_events(id) ON DELETE CASCADE,
  instance_start TIMESTAMP WITH TIME ZONE NOT NULL,
  instance_end TIMESTAMP WITH TIME ZONE NOT NULL,
  is_exception BOOLEAN DEFAULT false, -- True if this instance was modified from the pattern
  is_cancelled BOOLEAN DEFAULT false,
  override_data JSONB DEFAULT '{}', -- Stores any instance-specific overrides
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Work Calendars Table
CREATE TABLE public.work_calendars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_name TEXT NOT NULL,
  calendar_type TEXT NOT NULL CHECK (calendar_type IN ('standard', 'shift_work', 'seasonal', 'project_specific', 'maintenance')),
  description TEXT,
  project_id UUID REFERENCES public.projects(id),
  work_days INTEGER[] NOT NULL DEFAULT ARRAY[1,2,3,4,5], -- 1=Monday, 7=Sunday
  work_hours_start TIME NOT NULL DEFAULT '08:00:00',
  work_hours_end TIME NOT NULL DEFAULT '17:00:00',
  break_times JSONB DEFAULT '[]', -- Array of break periods
  holidays JSONB DEFAULT '[]', -- Array of holiday dates
  overtime_rules JSONB DEFAULT '{}',
  shift_patterns JSONB DEFAULT '[]', -- For shift work
  timezone TEXT DEFAULT 'UTC',
  effective_from DATE NOT NULL,
  effective_until DATE,
  is_default BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all new tables
ALTER TABLE public.hazard_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_mitigation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolbox_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolbox_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_safety_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jsa_steps ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_event_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_calendars ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all new safety tables (allowing all operations for now)
CREATE POLICY "Allow all operations on hazard_reports" ON public.hazard_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on risk_assessments" ON public.risk_assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on risk_assessment_items" ON public.risk_assessment_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on risk_mitigation_actions" ON public.risk_mitigation_actions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on safety_training_sessions" ON public.safety_training_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on training_attendance" ON public.training_attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on safety_certifications" ON public.safety_certifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on compliance_checklists" ON public.compliance_checklists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on toolbox_meetings" ON public.toolbox_meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on toolbox_attendance" ON public.toolbox_attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on job_safety_analyses" ON public.job_safety_analyses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on jsa_steps" ON public.jsa_steps FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for all new schedule tables (allowing all operations for now)
CREATE POLICY "Allow all operations on schedule_events" ON public.schedule_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on resource_allocations" ON public.resource_allocations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meeting_attendees" ON public.meeting_attendees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on resource_availability" ON public.resource_availability FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on schedule_conflicts" ON public.schedule_conflicts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on schedule_templates" ON public.schedule_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on recurring_event_instances" ON public.recurring_event_instances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on work_calendars" ON public.work_calendars FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_hazard_reports_updated_at BEFORE UPDATE ON public.hazard_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risk_assessments_updated_at BEFORE UPDATE ON public.risk_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risk_mitigation_actions_updated_at BEFORE UPDATE ON public.risk_mitigation_actions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_safety_training_sessions_updated_at BEFORE UPDATE ON public.safety_training_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_safety_certifications_updated_at BEFORE UPDATE ON public.safety_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_checklists_updated_at BEFORE UPDATE ON public.compliance_checklists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_safety_analyses_updated_at BEFORE UPDATE ON public.job_safety_analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_events_updated_at BEFORE UPDATE ON public.schedule_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resource_allocations_updated_at BEFORE UPDATE ON public.resource_allocations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resource_availability_updated_at BEFORE UPDATE ON public.resource_availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_schedule_templates_updated_at BEFORE UPDATE ON public.schedule_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_work_calendars_updated_at BEFORE UPDATE ON public.work_calendars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_hazard_reports_project_id ON public.hazard_reports(project_id);
CREATE INDEX idx_hazard_reports_status ON public.hazard_reports(status);
CREATE INDEX idx_hazard_reports_priority ON public.hazard_reports(priority);
CREATE INDEX idx_risk_assessments_project_id ON public.risk_assessments(project_id);
CREATE INDEX idx_risk_assessments_status ON public.risk_assessments(status);
CREATE INDEX idx_safety_training_sessions_date ON public.safety_training_sessions(session_date);
CREATE INDEX idx_safety_certifications_employee_id ON public.safety_certifications(employee_id);
CREATE INDEX idx_safety_certifications_expiry ON public.safety_certifications(expiry_date);
CREATE INDEX idx_toolbox_meetings_project_id ON public.toolbox_meetings(project_id);
CREATE INDEX idx_toolbox_meetings_date ON public.toolbox_meetings(meeting_date);
CREATE INDEX idx_jsa_project_id ON public.job_safety_analyses(project_id);

CREATE INDEX idx_schedule_events_project_id ON public.schedule_events(project_id);
CREATE INDEX idx_schedule_events_date_range ON public.schedule_events(start_date, end_date);
CREATE INDEX idx_schedule_events_status ON public.schedule_events(status);
CREATE INDEX idx_resource_allocations_project_id ON public.resource_allocations(project_id);
CREATE INDEX idx_resource_allocations_resource ON public.resource_allocations(resource_type, resource_id);
CREATE INDEX idx_resource_allocations_dates ON public.resource_allocations(allocation_start, allocation_end);
CREATE INDEX idx_meetings_project_id ON public.meetings(project_id);
CREATE INDEX idx_meetings_date ON public.meetings(date);
CREATE INDEX idx_resource_availability_resource ON public.resource_availability(resource_type, resource_id);
CREATE INDEX idx_resource_availability_dates ON public.resource_availability(availability_start, availability_end);
CREATE INDEX idx_schedule_conflicts_status ON public.schedule_conflicts(status);
CREATE INDEX idx_schedule_conflicts_severity ON public.schedule_conflicts(severity);