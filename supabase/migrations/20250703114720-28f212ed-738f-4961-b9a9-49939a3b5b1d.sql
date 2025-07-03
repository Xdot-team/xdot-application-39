-- Phase 1: Database Schema Completion for Organization and Safety Modules

-- Organization Reports table for report management
CREATE TABLE IF NOT EXISTS public.organization_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  report_type text NOT NULL CHECK (report_type IN ('financial', 'project', 'safety', 'workforce', 'custom')),
  category text NOT NULL CHECK (category IN ('weekly', 'monthly', 'quarterly', 'annual', 'on_demand')),
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'one_time')),
  is_automated boolean NOT NULL DEFAULT false,
  last_generated timestamp with time zone,
  file_url text,
  configuration jsonb DEFAULT '{}',
  created_by text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enhanced EOS Goals table (replacing existing if needed)
DROP TABLE IF EXISTS public.eos_goals_extended CASCADE;
CREATE TABLE public.eos_goals_extended (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('revenue', 'profit', 'productivity', 'safety', 'quality', 'growth')),
  owner_name text NOT NULL,
  current_value numeric NOT NULL DEFAULT 0,
  target_value numeric NOT NULL,
  unit text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'on_track', 'at_risk', 'completed', 'delayed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  quarterly_targets jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enhanced EOS Milestones table
DROP TABLE IF EXISTS public.eos_milestones_extended CASCADE;
CREATE TABLE public.eos_milestones_extended (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id uuid REFERENCES public.eos_goals_extended(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  due_date date NOT NULL,
  completed boolean DEFAULT false,
  completed_date date,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Safety Certifications table
CREATE TABLE IF NOT EXISTS public.safety_certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  required_for_roles text[] DEFAULT '{}',
  validity_period_months integer DEFAULT 12,
  issuing_authority text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Employee Safety Certifications linkage table
CREATE TABLE IF NOT EXISTS public.employee_safety_certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES public.safety_certifications(id) ON DELETE CASCADE,
  obtained_date date NOT NULL,
  expiry_date date,
  renewal_required boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'pending_renewal')),
  certificate_number text,
  issuing_authority text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(employee_id, certification_id)
);

-- Toolbox Meetings table
CREATE TABLE IF NOT EXISTS public.toolbox_meetings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_date date NOT NULL,
  project_id uuid,
  site_id uuid,
  topic text NOT NULL,
  description text,
  conducted_by text NOT NULL,
  duration_minutes integer DEFAULT 30,
  meeting_type text DEFAULT 'safety' CHECK (meeting_type IN ('safety', 'quality', 'productivity', 'general')),
  weather_conditions text,
  hazards_discussed text[],
  safety_reminders text[],
  action_items text[],
  notes text,
  status text DEFAULT 'completed' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Toolbox Meeting Attendees table
CREATE TABLE IF NOT EXISTS public.toolbox_meeting_attendees (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id uuid REFERENCES public.toolbox_meetings(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  present boolean DEFAULT true,
  signature_data text,
  role_at_meeting text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(meeting_id, employee_id)
);

-- Schedule Events table for Schedule module
CREATE TABLE IF NOT EXISTS public.schedule_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('meeting', 'milestone', 'task', 'reminder', 'deadline')),
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  all_day boolean DEFAULT false,
  location text,
  project_id uuid,
  created_by text NOT NULL,
  attendees text[] DEFAULT '{}',
  recurrence_rule text,
  status text DEFAULT 'confirmed' CHECK (status IN ('tentative', 'confirmed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Schedule Meeting Attendees table
CREATE TABLE IF NOT EXISTS public.schedule_meeting_attendees (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.schedule_events(id) ON DELETE CASCADE,
  attendee_name text NOT NULL,
  attendee_email text,
  response_status text DEFAULT 'pending' CHECK (response_status IN ('pending', 'accepted', 'declined', 'tentative')),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Employee Onboarding Workflows table
CREATE TABLE IF NOT EXISTS public.employee_onboarding_workflows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  workflow_template_id uuid,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
  start_date date,
  expected_completion_date date,
  actual_completion_date date,
  completion_percentage integer DEFAULT 0,
  current_step text,
  assigned_to text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Onboarding Steps table
CREATE TABLE IF NOT EXISTS public.onboarding_steps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id uuid REFERENCES public.employee_onboarding_workflows(id) ON DELETE CASCADE,
  step_name text NOT NULL,
  description text,
  step_order integer NOT NULL,
  required boolean DEFAULT true,
  completed boolean DEFAULT false,
  completed_date date,
  assigned_to text,
  due_date date,
  documents_required text[],
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_organization_reports_type ON public.organization_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_organization_reports_created_by ON public.organization_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_eos_goals_extended_status ON public.eos_goals_extended(status);
CREATE INDEX IF NOT EXISTS idx_eos_goals_extended_category ON public.eos_goals_extended(category);
CREATE INDEX IF NOT EXISTS idx_employee_safety_cert_employee ON public.employee_safety_certifications(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_safety_cert_status ON public.employee_safety_certifications(status);
CREATE INDEX IF NOT EXISTS idx_toolbox_meetings_date ON public.toolbox_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_schedule_events_date ON public.schedule_events(start_date);
CREATE INDEX IF NOT EXISTS idx_onboarding_workflows_status ON public.employee_onboarding_workflows(status);

-- Enable Row Level Security on all tables
ALTER TABLE public.organization_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eos_goals_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eos_milestones_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_safety_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolbox_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolbox_meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_onboarding_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations on organization_reports" ON public.organization_reports FOR ALL USING (true);
CREATE POLICY "Allow all operations on eos_goals_extended" ON public.eos_goals_extended FOR ALL USING (true);
CREATE POLICY "Allow all operations on eos_milestones_extended" ON public.eos_milestones_extended FOR ALL USING (true);
CREATE POLICY "Allow all operations on safety_certifications" ON public.safety_certifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on employee_safety_certifications" ON public.employee_safety_certifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on toolbox_meetings" ON public.toolbox_meetings FOR ALL USING (true);
CREATE POLICY "Allow all operations on toolbox_meeting_attendees" ON public.toolbox_meeting_attendees FOR ALL USING (true);
CREATE POLICY "Allow all operations on schedule_events" ON public.schedule_events FOR ALL USING (true);
CREATE POLICY "Allow all operations on schedule_meeting_attendees" ON public.schedule_meeting_attendees FOR ALL USING (true);
CREATE POLICY "Allow all operations on employee_onboarding_workflows" ON public.employee_onboarding_workflows FOR ALL USING (true);
CREATE POLICY "Allow all operations on onboarding_steps" ON public.onboarding_steps FOR ALL USING (true);

-- Create updated_at triggers for all tables
CREATE TRIGGER update_organization_reports_updated_at BEFORE UPDATE ON public.organization_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_eos_goals_extended_updated_at BEFORE UPDATE ON public.eos_goals_extended FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_safety_certifications_updated_at BEFORE UPDATE ON public.safety_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_toolbox_meetings_updated_at BEFORE UPDATE ON public.toolbox_meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_schedule_events_updated_at BEFORE UPDATE ON public.schedule_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employee_onboarding_workflows_updated_at BEFORE UPDATE ON public.employee_onboarding_workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();