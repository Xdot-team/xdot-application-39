-- Safety & Risk Management Module - Complete Database Schema

-- Safety incidents table
CREATE TABLE public.safety_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_number TEXT NOT NULL UNIQUE,
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT NOT NULL,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('injury', 'near_miss', 'property_damage', 'environmental', 'security', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  immediate_cause TEXT,
  root_cause TEXT,
  injured_person_name TEXT,
  injured_person_role TEXT,
  witness_names TEXT[],
  reported_by TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  corrective_actions TEXT,
  preventive_actions TEXT,
  investigation_notes TEXT,
  photos TEXT[],
  documents TEXT[],
  estimated_cost NUMERIC DEFAULT 0,
  actual_cost NUMERIC DEFAULT 0,
  lost_time_hours NUMERIC DEFAULT 0,
  recordable BOOLEAN DEFAULT false,
  osha_reportable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hazard reports table
CREATE TABLE public.hazard_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hazard_number TEXT NOT NULL UNIQUE,
  reported_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT NOT NULL,
  hazard_type TEXT NOT NULL CHECK (hazard_type IN ('physical', 'chemical', 'biological', 'ergonomic', 'psychosocial', 'environmental')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  potential_consequences TEXT,
  recommended_actions TEXT,
  reported_by TEXT NOT NULL,
  assigned_to TEXT,
  project_id UUID REFERENCES projects(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
  resolution_date TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  photos TEXT[],
  gps_coordinates POINT,
  affected_workers INTEGER DEFAULT 0,
  estimated_cost NUMERIC DEFAULT 0,
  actual_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risk assessments table
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_number TEXT NOT NULL UNIQUE,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  project_id UUID REFERENCES projects(id),
  site_location TEXT,
  assessed_by TEXT NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('project_startup', 'periodic', 'change_driven', 'incident_driven', 'other')),
  scope_description TEXT NOT NULL,
  methodology TEXT DEFAULT 'matrix',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'active', 'archived')),
  approved_by TEXT,
  approval_date DATE,
  next_review_date DATE,
  overall_risk_rating TEXT CHECK (overall_risk_rating IN ('very_low', 'low', 'medium', 'high', 'very_high')),
  recommendations TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual risk items within assessments
CREATE TABLE public.risk_assessment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES risk_assessments(id) ON DELETE CASCADE,
  hazard_description TEXT NOT NULL,
  risk_category TEXT NOT NULL,
  probability INTEGER CHECK (probability BETWEEN 1 AND 5),
  severity INTEGER CHECK (severity BETWEEN 1 AND 5),
  risk_score INTEGER GENERATED ALWAYS AS (probability * severity) STORED,
  risk_level TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN (probability * severity) <= 5 THEN 'very_low'
      WHEN (probability * severity) <= 10 THEN 'low'
      WHEN (probability * severity) <= 15 THEN 'medium'
      WHEN (probability * severity) <= 20 THEN 'high'
      ELSE 'very_high'
    END
  ) STORED,
  existing_controls TEXT,
  additional_controls TEXT,
  responsible_person TEXT,
  target_completion_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risk mitigation actions
CREATE TABLE public.risk_mitigation_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_item_id UUID REFERENCES risk_assessment_items(id) ON DELETE CASCADE,
  action_description TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('eliminate', 'substitute', 'engineering', 'administrative', 'ppe')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to TEXT NOT NULL,
  due_date DATE NOT NULL,
  estimated_cost NUMERIC DEFAULT 0,
  actual_cost NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled', 'overdue')),
  completion_date DATE,
  completion_notes TEXT,
  effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safety training sessions
CREATE TABLE public.safety_training_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_title TEXT NOT NULL,
  training_type TEXT NOT NULL CHECK (training_type IN ('orientation', 'toolbox_talk', 'formal_training', 'certification', 'refresher', 'emergency_drill')),
  session_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT NOT NULL,
  instructor TEXT NOT NULL,
  topic_covered TEXT NOT NULL,
  training_materials TEXT[],
  attendance_required BOOLEAN DEFAULT false,
  certification_provided BOOLEAN DEFAULT false,
  certification_expiry_months INTEGER,
  project_id UUID REFERENCES projects(id),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  session_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Training attendance tracking
CREATE TABLE public.training_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES safety_training_sessions(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employee_profiles(id),
  employee_name TEXT NOT NULL,
  attendance_status TEXT NOT NULL DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent', 'excused')),
  test_score NUMERIC,
  passed BOOLEAN,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safety certifications tracking
CREATE TABLE public.safety_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employee_profiles(id),
  employee_name TEXT NOT NULL,
  certification_type TEXT NOT NULL,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  certification_number TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  renewal_required BOOLEAN DEFAULT true,
  renewal_reminder_days INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'revoked')),
  verification_document TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance checklists
CREATE TABLE public.compliance_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_name TEXT NOT NULL,
  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'project_specific')),
  project_id UUID REFERENCES projects(id),
  site_id UUID REFERENCES field_sites(id),
  inspector_name TEXT NOT NULL,
  inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checklist_template JSONB NOT NULL,
  checklist_responses JSONB NOT NULL DEFAULT '{}',
  overall_score NUMERIC,
  pass_fail TEXT CHECK (pass_fail IN ('pass', 'fail', 'conditional')),
  deficiencies_found TEXT[],
  corrective_actions_required TEXT[],
  followup_required BOOLEAN DEFAULT false,
  followup_date DATE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('draft', 'in_progress', 'completed', 'reviewed', 'approved')),
  reviewed_by TEXT,
  review_date DATE,
  photos TEXT[],
  documents TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Toolbox meetings (safety talks)
CREATE TABLE public.toolbox_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_number TEXT NOT NULL UNIQUE,
  meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meeting_time TIME,
  location TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  foreman_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  discussion_points TEXT NOT NULL,
  safety_concerns_raised TEXT,
  action_items TEXT,
  weather_conditions TEXT,
  work_planned TEXT,
  hazards_identified TEXT[],
  ppe_required TEXT[],
  attendees_count INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  meeting_notes TEXT,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Toolbox meeting attendance
CREATE TABLE public.toolbox_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES toolbox_meetings(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employee_profiles(id),
  employee_name TEXT NOT NULL,
  signature TEXT,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job Safety Analyses (JSA)
CREATE TABLE public.job_safety_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jsa_number TEXT NOT NULL UNIQUE,
  job_description TEXT NOT NULL,
  location TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  prepared_by TEXT NOT NULL,
  preparation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reviewed_by TEXT,
  review_date DATE,
  approved_by TEXT,
  approval_date DATE,
  effective_date DATE,
  revision_number INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'active', 'superseded')),
  equipment_needed TEXT[],
  ppe_required TEXT[],
  permits_required TEXT[],
  environmental_conditions TEXT,
  emergency_procedures TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- JSA steps and hazards
CREATE TABLE public.jsa_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jsa_id UUID NOT NULL REFERENCES job_safety_analyses(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_description TEXT NOT NULL,
  potential_hazards TEXT NOT NULL,
  safety_precautions TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Driver safety records
CREATE TABLE public.driver_safety_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES employee_profiles(id),
  driver_name TEXT NOT NULL,
  vehicle_id UUID REFERENCES fleet_vehicles(id),
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  record_type TEXT NOT NULL CHECK (record_type IN ('pre_trip_inspection', 'post_trip_inspection', 'incident', 'violation', 'training', 'performance_review')),
  driving_score NUMERIC CHECK (driving_score BETWEEN 0 AND 100),
  speed_violations INTEGER DEFAULT 0,
  harsh_braking_events INTEGER DEFAULT 0,
  harsh_acceleration_events INTEGER DEFAULT 0,
  harsh_cornering_events INTEGER DEFAULT 0,
  distracted_driving_events INTEGER DEFAULT 0,
  safety_belt_violations INTEGER DEFAULT 0,
  miles_driven NUMERIC DEFAULT 0,
  fuel_efficiency NUMERIC,
  incident_description TEXT,
  corrective_actions TEXT,
  training_completed TEXT,
  license_status TEXT CHECK (license_status IN ('valid', 'expired', 'suspended', 'revoked')),
  license_expiry_date DATE,
  medical_cert_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.safety_incidents ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.driver_safety_records ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for all tables
CREATE POLICY "Allow all operations on safety_incidents" ON public.safety_incidents FOR ALL USING (true) WITH CHECK (true);
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
CREATE POLICY "Allow all operations on driver_safety_records" ON public.driver_safety_records FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_safety_incidents_project_id ON public.safety_incidents(project_id);
CREATE INDEX idx_safety_incidents_date ON public.safety_incidents(incident_date);
CREATE INDEX idx_safety_incidents_status ON public.safety_incidents(status);
CREATE INDEX idx_hazard_reports_project_id ON public.hazard_reports(project_id);
CREATE INDEX idx_hazard_reports_priority ON public.hazard_reports(priority);
CREATE INDEX idx_risk_assessments_project_id ON public.risk_assessments(project_id);
CREATE INDEX idx_training_sessions_date ON public.safety_training_sessions(session_date);
CREATE INDEX idx_driver_records_driver_id ON public.driver_safety_records(driver_id);
CREATE INDEX idx_driver_records_date ON public.driver_safety_records(record_date);

-- Schedule Management Module - Complete Database Schema

-- Schedule events (main calendar events)
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
  project_id UUID REFERENCES projects(id),
  created_by TEXT NOT NULL,
  assigned_to TEXT[],
  notes TEXT,
  attachments TEXT[],
  recurring_pattern TEXT CHECK (recurring_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
  recurring_interval INTEGER DEFAULT 1,
  recurring_end_date TIMESTAMP WITH TIME ZONE,
  parent_event_id UUID REFERENCES schedule_events(id),
  color_code TEXT DEFAULT '#3b82f6',
  reminder_minutes INTEGER[] DEFAULT ARRAY[15, 60],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Resource allocations (employees, equipment, materials to projects/tasks)
CREATE TABLE public.resource_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('employee', 'equipment', 'material')),
  resource_id UUID NOT NULL,
  resource_name TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  event_id UUID REFERENCES schedule_events(id),
  allocation_start TIMESTAMP WITH TIME ZONE NOT NULL,
  allocation_end TIMESTAMP WITH TIME ZONE NOT NULL,
  hours_per_day NUMERIC DEFAULT 8,
  quantity_allocated NUMERIC DEFAULT 1,
  allocation_percentage NUMERIC DEFAULT 100 CHECK (allocation_percentage BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  cost_per_hour NUMERIC DEFAULT 0,
  total_estimated_cost NUMERIC DEFAULT 0,
  actual_hours_used NUMERIC DEFAULT 0,
  actual_cost NUMERIC DEFAULT 0,
  created_by TEXT NOT NULL,
  approved_by TEXT,
  approval_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_allocation_dates CHECK (allocation_end > allocation_start)
);

-- Meetings (detailed meeting management)
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('project_kickoff', 'progress_review', 'safety_meeting', 'client_meeting', 'team_standup', 'other')),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  organizer TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  agenda TEXT[],
  meeting_minutes TEXT,
  action_items TEXT[],
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_meeting_times CHECK (end_time > start_time)
);

-- Meeting attendees
CREATE TABLE public.meeting_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  attendee_type TEXT NOT NULL CHECK (attendee_type IN ('required', 'optional', 'organizer')),
  employee_id UUID REFERENCES employee_profiles(id),
  attendee_name TEXT NOT NULL,
  attendee_email TEXT,
  response_status TEXT NOT NULL DEFAULT 'pending' CHECK (response_status IN ('pending', 'accepted', 'declined', 'tentative')),
  attended BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Resource availability (when resources are available/unavailable)
CREATE TABLE public.resource_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('employee', 'equipment', 'material')),
  resource_id UUID NOT NULL,
  resource_name TEXT NOT NULL,
  availability_type TEXT NOT NULL CHECK (availability_type IN ('available', 'unavailable', 'maintenance', 'vacation', 'sick_leave', 'training')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_availability_dates CHECK (end_date > start_date)
);

-- Schedule conflicts (detected scheduling conflicts)
CREATE TABLE public.schedule_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('resource_double_booked', 'overlapping_events', 'resource_unavailable', 'deadline_conflict')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  affected_resources TEXT[],
  conflicting_event_ids UUID[],
  conflicting_allocation_ids UUID[],
  detected_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'unresolved' CHECK (status IN ('unresolved', 'acknowledged', 'resolved', 'ignored')),
  resolution_notes TEXT,
  resolved_by TEXT,
  resolved_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Project milestones (key project dates and deadlines)
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  description TEXT,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('start', 'phase_completion', 'deliverable', 'payment', 'approval', 'deadline', 'other')),
  target_date DATE NOT NULL,
  actual_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed', 'cancelled')),
  completion_percentage NUMERIC DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  dependencies TEXT[],
  responsible_person TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  budget_impact NUMERIC DEFAULT 0,
  deliverables TEXT[],
  approval_required BOOLEAN DEFAULT false,
  approved_by TEXT,
  approval_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Calendar templates (reusable schedule templates)
CREATE TABLE public.schedule_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('project', 'maintenance', 'training', 'inspection', 'custom')),
  description TEXT,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL,
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Schedule notifications (alerts and reminders)
CREATE TABLE public.schedule_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('reminder', 'alert', 'conflict', 'change', 'cancellation')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('user', 'role', 'project_team', 'all')),
  recipients TEXT[],
  related_event_id UUID REFERENCES schedule_events(id),
  related_meeting_id UUID REFERENCES meetings(id),
  send_date TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_method TEXT[] DEFAULT ARRAY['email', 'in_app'],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  read_by TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recurring event instances (for managing recurring events)
CREATE TABLE public.recurring_event_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_event_id UUID NOT NULL REFERENCES schedule_events(id) ON DELETE CASCADE,
  instance_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'modified', 'cancelled', 'completed')),
  modifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Work calendars (different calendar types for different work patterns)
CREATE TABLE public.work_calendars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_name TEXT NOT NULL,
  calendar_type TEXT NOT NULL CHECK (calendar_type IN ('standard', 'shift_work', 'seasonal', 'project_specific')),
  description TEXT,
  working_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- 1=Monday, 7=Sunday
  working_hours_start TIME DEFAULT '08:00',
  working_hours_end TIME DEFAULT '17:00',
  break_duration_minutes INTEGER DEFAULT 60,
  holidays DATE[],
  non_working_periods JSONB,
  is_default BOOLEAN DEFAULT false,
  applies_to TEXT[] DEFAULT ARRAY['all'],
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all schedule tables
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_event_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_calendars ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for schedule tables
CREATE POLICY "Allow all operations on schedule_events" ON public.schedule_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on resource_allocations" ON public.resource_allocations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meeting_attendees" ON public.meeting_attendees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on resource_availability" ON public.resource_availability FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on schedule_conflicts" ON public.schedule_conflicts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on project_milestones" ON public.project_milestones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on schedule_templates" ON public.schedule_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on schedule_notifications" ON public.schedule_notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on recurring_event_instances" ON public.recurring_event_instances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on work_calendars" ON public.work_calendars FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance on schedule tables
CREATE INDEX idx_schedule_events_project_id ON public.schedule_events(project_id);
CREATE INDEX idx_schedule_events_date_range ON public.schedule_events(start_date, end_date);
CREATE INDEX idx_schedule_events_type ON public.schedule_events(event_type);
CREATE INDEX idx_resource_allocations_resource ON public.resource_allocations(resource_type, resource_id);
CREATE INDEX idx_resource_allocations_project ON public.resource_allocations(project_id);
CREATE INDEX idx_resource_allocations_dates ON public.resource_allocations(allocation_start, allocation_end);
CREATE INDEX idx_meetings_date ON public.meetings(date);
CREATE INDEX idx_meetings_project ON public.meetings(project_id);
CREATE INDEX idx_project_milestones_project ON public.project_milestones(project_id);
CREATE INDEX idx_project_milestones_date ON public.project_milestones(target_date);
CREATE INDEX idx_schedule_conflicts_status ON public.schedule_conflicts(status);
CREATE INDEX idx_resource_availability_resource ON public.resource_availability(resource_type, resource_id);
CREATE INDEX idx_resource_availability_dates ON public.resource_availability(start_date, end_date);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_safety_incidents_updated_at 
  BEFORE UPDATE ON public.safety_incidents 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hazard_reports_updated_at 
  BEFORE UPDATE ON public.hazard_reports 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at 
  BEFORE UPDATE ON public.risk_assessments 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_events_updated_at 
  BEFORE UPDATE ON public.schedule_events 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_allocations_updated_at 
  BEFORE UPDATE ON public.resource_allocations 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at 
  BEFORE UPDATE ON public.meetings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();