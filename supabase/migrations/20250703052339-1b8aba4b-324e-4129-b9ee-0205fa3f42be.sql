-- Survey Module Database Tables
CREATE TABLE IF NOT EXISTS public.survey_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  survey_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning',
  priority TEXT DEFAULT 'medium',
  assigned_surveyor TEXT,
  start_date DATE,
  end_date DATE,
  progress_percentage NUMERIC DEFAULT 0,
  equipment_required TEXT[],
  location_bounds POLYGON,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.survey_data_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_project_id UUID REFERENCES public.survey_projects(id),
  point_id TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  elevation NUMERIC,
  accuracy_horizontal NUMERIC,
  accuracy_vertical NUMERIC,
  point_type TEXT DEFAULT 'control',
  description TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  recorded_by TEXT,
  equipment_used TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.survey_equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id TEXT UNIQUE NOT NULL,
  equipment_type TEXT NOT NULL,
  model TEXT,
  serial_number TEXT,
  status TEXT DEFAULT 'available',
  battery_level NUMERIC DEFAULT 100,
  signal_strength NUMERIC,
  current_location POINT,
  assigned_to TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  storage_used_gb NUMERIC DEFAULT 0,
  storage_total_gb NUMERIC DEFAULT 32,
  maintenance_due DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.survey_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_project_id UUID REFERENCES public.survey_projects(id),
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  file_url TEXT,
  generated_by TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'draft',
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.control_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  point_name TEXT UNIQUE NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  elevation NUMERIC,
  coordinate_system TEXT DEFAULT 'WGS84',
  datum TEXT DEFAULT 'NAD83',
  accuracy_class TEXT DEFAULT 'Second Order',
  established_date DATE,
  verified_date DATE,
  verification_status TEXT DEFAULT 'unverified',
  monument_type TEXT,
  access_description TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.survey_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_project_id UUID REFERENCES public.survey_projects(id),
  session_name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  surveyor_name TEXT,
  equipment_used TEXT[],
  weather_conditions TEXT,
  data_points_collected INTEGER DEFAULT 0,
  session_notes TEXT,
  data_quality TEXT DEFAULT 'good',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Organization Module Database Tables
CREATE TABLE IF NOT EXISTS public.kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  current_value NUMERIC NOT NULL,
  target_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  trend TEXT DEFAULT 'stable',
  period TEXT DEFAULT 'monthly',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_source TEXT,
  calculation_method TEXT,
  threshold_warning NUMERIC,
  threshold_critical NUMERIC,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.eos_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC DEFAULT 0,
  unit TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  owner_name TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',
  priority TEXT DEFAULT 'medium',
  quarterly_targets JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.eos_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.eos_goals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  widget_type TEXT NOT NULL,
  title TEXT NOT NULL,
  size TEXT DEFAULT 'medium',
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  data_source TEXT,
  configuration JSONB DEFAULT '{}',
  refresh_interval INTEGER DEFAULT 300,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organization_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL,
  frequency TEXT DEFAULT 'monthly',
  data_range_start DATE,
  data_range_end DATE,
  generated_by TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'draft',
  file_url TEXT,
  recipients TEXT[],
  metrics_included TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  category TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT,
  measurement_date DATE NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  source_table TEXT,
  source_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  projection_type TEXT NOT NULL,
  period TEXT NOT NULL,
  projection_data JSONB NOT NULL,
  confidence_level NUMERIC,
  methodology TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reports Module Database Tables
CREATE TABLE IF NOT EXISTS public.custom_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT DEFAULT 'custom',
  configuration JSONB NOT NULL,
  created_by TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  tags TEXT[],
  version INTEGER DEFAULT 1,
  template_id UUID,
  last_generated TIMESTAMP WITH TIME ZONE,
  generated_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  template_config JSONB NOT NULL,
  default_filters JSONB DEFAULT '{}',
  default_visualizations JSONB DEFAULT '[]',
  is_system_template BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.report_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.custom_reports(id) ON DELETE CASCADE,
  schedule_name TEXT NOT NULL,
  frequency TEXT NOT NULL,
  day_of_week INTEGER,
  day_of_month INTEGER,
  time_of_day TIME,
  recipients TEXT[] NOT NULL,
  last_sent TIMESTAMP WITH TIME ZONE,
  next_scheduled TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.report_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  category TEXT NOT NULL,
  data_source TEXT NOT NULL,
  description TEXT,
  unit TEXT,
  aggregation_type TEXT DEFAULT 'sum',
  calculation_formula TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.report_filters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filter_name TEXT NOT NULL,
  report_id UUID REFERENCES public.custom_reports(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  operator TEXT NOT NULL,
  filter_value JSONB NOT NULL,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.report_visualizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.custom_reports(id) ON DELETE CASCADE,
  visualization_type TEXT NOT NULL,
  title TEXT NOT NULL,
  metrics TEXT[] NOT NULL,
  configuration JSONB DEFAULT '{}',
  position_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.survey_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.control_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eos_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eos_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_visualizations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now)
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'survey_projects', 'survey_data_points', 'survey_equipment', 'survey_reports', 
        'control_points', 'survey_sessions', 'kpis', 'eos_goals', 'eos_milestones',
        'dashboard_widgets', 'organization_reports', 'performance_metrics', 'projections',
        'custom_reports', 'report_templates', 'report_schedules', 'report_metrics',
        'report_filters', 'report_visualizations'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('CREATE POLICY "Allow all operations on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', table_name, table_name);
    END LOOP;
END $$;

-- Create triggers for updated_at
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'survey_projects', 'survey_equipment', 'control_points', 'kpis', 'eos_goals',
        'dashboard_widgets', 'projections', 'custom_reports', 'report_templates', 'report_schedules'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', table_name, table_name);
    END LOOP;
END $$;