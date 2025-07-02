-- Create missing tables for complete Fleet, Field, and Workforce management

-- Vehicle Forms and Additional Tables
CREATE TABLE IF NOT EXISTS public.vehicle_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL, -- 'registration', 'inspection', 'maintenance', 'daily_check'
  form_data JSONB NOT NULL DEFAULT '{}',
  submitted_by TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tools Management Tables
CREATE TABLE IF NOT EXISTS public.tools_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_name TEXT NOT NULL,
  tool_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT UNIQUE,
  purchase_date DATE,
  purchase_cost NUMERIC(10,2),
  current_value NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'available', -- 'available', 'in_use', 'maintenance', 'lost', 'retired'
  location TEXT,
  assigned_to_worker_id UUID,
  assigned_to_project_id UUID,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  maintenance_interval_days INTEGER DEFAULT 90,
  barcode TEXT,
  qr_code TEXT,
  specifications JSONB DEFAULT '{}',
  attachments TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tool Checkout/Checkin System
CREATE TABLE IF NOT EXISTS public.tool_checkouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES public.tools_inventory(id) ON DELETE CASCADE,
  worker_id UUID,
  worker_name TEXT NOT NULL,
  project_id UUID,
  checkout_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expected_return_date DATE,
  actual_return_date TIMESTAMP WITH TIME ZONE,
  checkout_condition TEXT DEFAULT 'good', -- 'excellent', 'good', 'fair', 'poor'
  return_condition TEXT,
  checkout_notes TEXT,
  return_notes TEXT,
  status TEXT NOT NULL DEFAULT 'checked_out', -- 'checked_out', 'returned', 'overdue', 'lost'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced Employee Health Management
CREATE TABLE IF NOT EXISTS public.employee_health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL, -- 'physical', 'drug_test', 'injury', 'vaccination', 'certification'
  record_date DATE NOT NULL,
  provider_name TEXT,
  provider_contact TEXT,
  test_results JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'current', -- 'current', 'expired', 'pending_renewal'
  expiry_date DATE,
  certification_number TEXT,
  restrictions TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  confidential_notes TEXT,
  attachments TEXT[],
  compliance_status TEXT DEFAULT 'compliant', -- 'compliant', 'non_compliant', 'pending'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employee Onboarding Workflows
CREATE TABLE IF NOT EXISTS public.onboarding_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  workflow_template TEXT NOT NULL, -- 'new_hire', 'contractor', 'intern', 'transfer'
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'not_started', 'in_progress', 'completed', 'on_hold'
  started_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  assigned_buddy_id UUID,
  assigned_hr_rep TEXT,
  completion_percentage INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Onboarding Steps/Tasks
CREATE TABLE IF NOT EXISTS public.onboarding_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.onboarding_workflows(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_title TEXT NOT NULL,
  step_description TEXT,
  step_type TEXT NOT NULL, -- 'document', 'training', 'meeting', 'system_access', 'equipment'
  required_documents TEXT[],
  assigned_to TEXT, -- who is responsible for completing this step
  due_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'skipped'
  completion_notes TEXT,
  attachments TEXT[],
  estimated_duration_hours NUMERIC(4,2),
  actual_duration_hours NUMERIC(4,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time Location Tracking for Workers
CREATE TABLE IF NOT EXISTS public.worker_location_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID REFERENCES public.field_workers(id) ON DELETE CASCADE,
  project_id UUID,
  site_id UUID,
  location_point POINT,
  accuracy_meters NUMERIC(6,2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activity_type TEXT, -- 'work', 'break', 'lunch', 'travel', 'check_in', 'check_out'
  battery_level INTEGER,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Photo Management for Field Operations
CREATE TABLE IF NOT EXISTS public.photo_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID REFERENCES public.field_photos(id) ON DELETE CASCADE,
  annotation_type TEXT NOT NULL, -- 'markup', 'measurement', 'note', 'issue'
  coordinates JSONB, -- {x, y} position on image
  annotation_data JSONB NOT NULL DEFAULT '{}', -- text, measurements, etc.
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced Subcontractor Management
ALTER TABLE public.subcontractors ADD COLUMN IF NOT EXISTS prequalification_score INTEGER DEFAULT 0;
ALTER TABLE public.subcontractors ADD COLUMN IF NOT EXISTS last_project_date DATE;
ALTER TABLE public.subcontractors ADD COLUMN IF NOT EXISTS project_history TEXT[];
ALTER TABLE public.subcontractors ADD COLUMN IF NOT EXISTS insurance_documents TEXT[];
ALTER TABLE public.subcontractors ADD COLUMN IF NOT EXISTS safety_record JSONB DEFAULT '{}';

-- Fleet Trip Optimization
CREATE TABLE IF NOT EXISTS public.route_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  trip_date DATE NOT NULL,
  original_route JSONB,
  optimized_route JSONB,
  estimated_time_saved_minutes INTEGER,
  estimated_fuel_saved_gallons NUMERIC(6,2),
  actual_time_saved_minutes INTEGER,
  actual_fuel_saved_gallons NUMERIC(6,2),
  optimization_algorithm TEXT DEFAULT 'dijkstra',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Advanced Payroll Integration
CREATE TABLE IF NOT EXISTS public.payroll_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  regular_hours NUMERIC(6,2) DEFAULT 0,
  overtime_hours NUMERIC(6,2) DEFAULT 0,
  double_time_hours NUMERIC(6,2) DEFAULT 0,
  holiday_hours NUMERIC(6,2) DEFAULT 0,
  vacation_hours NUMERIC(6,2) DEFAULT 0,
  sick_hours NUMERIC(6,2) DEFAULT 0,
  regular_rate NUMERIC(8,2) NOT NULL,
  overtime_rate NUMERIC(8,2),
  holiday_rate NUMERIC(8,2),
  gross_pay NUMERIC(10,2) DEFAULT 0,
  federal_tax NUMERIC(10,2) DEFAULT 0,
  state_tax NUMERIC(10,2) DEFAULT 0,
  social_security NUMERIC(10,2) DEFAULT 0,
  medicare NUMERIC(10,2) DEFAULT 0,
  other_deductions NUMERIC(10,2) DEFAULT 0,
  net_pay NUMERIC(10,2) DEFAULT 0,
  calculation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'pending_approval', 'approved', 'paid'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.vehicle_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_calculations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all new tables (can be restricted later)
CREATE POLICY "Allow all operations on vehicle_forms" ON public.vehicle_forms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tools_inventory" ON public.tools_inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tool_checkouts" ON public.tool_checkouts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on employee_health_records" ON public.employee_health_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on onboarding_workflows" ON public.onboarding_workflows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on onboarding_steps" ON public.onboarding_steps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on worker_location_history" ON public.worker_location_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on photo_annotations" ON public.photo_annotations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on route_optimizations" ON public.route_optimizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payroll_calculations" ON public.payroll_calculations FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicle_forms_vehicle_id ON public.vehicle_forms(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_tools_inventory_status ON public.tools_inventory(status);
CREATE INDEX IF NOT EXISTS idx_tool_checkouts_tool_id ON public.tool_checkouts(tool_id);
CREATE INDEX IF NOT EXISTS idx_employee_health_records_employee_id ON public.employee_health_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_workflows_employee_id ON public.onboarding_workflows(employee_id);
CREATE INDEX IF NOT EXISTS idx_worker_location_history_worker_id ON public.worker_location_history(worker_id);
CREATE INDEX IF NOT EXISTS idx_photo_annotations_photo_id ON public.photo_annotations(photo_id);
CREATE INDEX IF NOT EXISTS idx_payroll_calculations_employee_id ON public.payroll_calculations(employee_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_forms_updated_at BEFORE UPDATE ON public.vehicle_forms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tools_inventory_updated_at BEFORE UPDATE ON public.tools_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tool_checkouts_updated_at BEFORE UPDATE ON public.tool_checkouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employee_health_records_updated_at BEFORE UPDATE ON public.employee_health_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_onboarding_workflows_updated_at BEFORE UPDATE ON public.onboarding_workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_onboarding_steps_updated_at BEFORE UPDATE ON public.onboarding_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_photo_annotations_updated_at BEFORE UPDATE ON public.photo_annotations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_route_optimizations_updated_at BEFORE UPDATE ON public.route_optimizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payroll_calculations_updated_at BEFORE UPDATE ON public.payroll_calculations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();