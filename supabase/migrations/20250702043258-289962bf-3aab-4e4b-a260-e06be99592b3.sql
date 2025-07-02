-- Fleet Management Module Database Schema

-- Fleet Vehicles table (enhanced)
CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  vin TEXT UNIQUE,
  license_plate TEXT UNIQUE,
  vehicle_type TEXT NOT NULL, -- truck, van, pickup, equipment, etc.
  status TEXT NOT NULL DEFAULT 'available', -- available, in_use, maintenance, offline, retired
  fuel_type TEXT DEFAULT 'diesel', -- diesel, gas, electric, hybrid
  current_mileage NUMERIC DEFAULT 0,
  current_engine_hours NUMERIC DEFAULT 0,
  purchase_date DATE,
  purchase_cost NUMERIC,
  current_project_id UUID REFERENCES public.projects(id),
  assigned_driver_id UUID REFERENCES public.field_workers(id),
  home_yard_location TEXT,
  gps_device_id TEXT,
  last_gps_update TIMESTAMP WITH TIME ZONE,
  current_location POINT,
  fuel_capacity NUMERIC,
  current_fuel_level NUMERIC DEFAULT 100,
  insurance_policy_number TEXT,
  insurance_expiry DATE,
  registration_expiry DATE,
  inspection_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fleet Maintenance Records
CREATE TABLE public.fleet_maintenance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL, -- preventive, repair, inspection, recall
  service_date DATE NOT NULL,
  mileage_at_service NUMERIC,
  engine_hours_at_service NUMERIC,
  description TEXT NOT NULL,
  performed_by TEXT NOT NULL, -- mechanic/shop name
  shop_name TEXT,
  cost NUMERIC DEFAULT 0,
  parts_replaced TEXT[],
  next_service_mileage NUMERIC,
  next_service_date DATE,
  warranty_expires DATE,
  invoice_number TEXT,
  notes TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fleet Fuel Tracking
CREATE TABLE public.fleet_fuel_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  fuel_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  odometer_reading NUMERIC NOT NULL,
  gallons_purchased NUMERIC NOT NULL,
  cost_per_gallon NUMERIC NOT NULL,
  total_cost NUMERIC NOT NULL,
  fuel_station TEXT,
  driver_id UUID REFERENCES public.field_workers(id),
  receipt_photo TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fleet Trip Logs
CREATE TABLE public.fleet_trip_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.field_workers(id),
  trip_start TIMESTAMP WITH TIME ZONE NOT NULL,
  trip_end TIMESTAMP WITH TIME ZONE,
  start_location POINT,
  end_location POINT,
  start_mileage NUMERIC NOT NULL,
  end_mileage NUMERIC,
  purpose TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  total_miles NUMERIC,
  fuel_used NUMERIC,
  route_data JSONB, -- GPS tracking points
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fleet Inspections
CREATE TABLE public.fleet_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES public.field_workers(id),
  inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  inspection_type TEXT NOT NULL, -- daily, weekly, monthly, annual, dot
  mileage NUMERIC,
  engine_hours NUMERIC,
  overall_condition TEXT NOT NULL, -- excellent, good, fair, poor
  checklist_items JSONB NOT NULL, -- flexible inspection checklist
  defects_found TEXT[],
  corrective_actions TEXT,
  photos TEXT[],
  pass_fail TEXT NOT NULL, -- pass, fail, conditional
  next_inspection_due DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workforce Management Module Database Schema

-- Employee Profiles (enhanced)
CREATE TABLE IF NOT EXISTS public.employee_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  address TEXT,
  hire_date DATE NOT NULL,
  termination_date DATE,
  job_title TEXT NOT NULL,
  department TEXT NOT NULL,
  pay_rate NUMERIC NOT NULL,
  pay_type TEXT NOT NULL DEFAULT 'hourly', -- hourly, salary
  supervisor_id UUID REFERENCES public.employee_profiles(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, terminated, on_leave
  profile_photo TEXT,
  skills TEXT[],
  certifications JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Time Clock Records
CREATE TABLE public.time_clock_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out TIMESTAMP WITH TIME ZONE,
  break_start TIMESTAMP WITH TIME ZONE,
  break_end TIMESTAMP WITH TIME ZONE,
  lunch_start TIMESTAMP WITH TIME ZONE,
  lunch_end TIMESTAMP WITH TIME ZONE,
  total_hours NUMERIC,
  regular_hours NUMERIC,
  overtime_hours NUMERIC,
  project_id UUID REFERENCES public.projects(id),
  location POINT,
  clock_in_photo TEXT,
  clock_out_photo TEXT,
  notes TEXT,
  approved_by UUID REFERENCES public.employee_profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employee Schedules
CREATE TABLE public.employee_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  shift_start TIME NOT NULL,
  shift_end TIME NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  location TEXT,
  role_for_day TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, confirmed, modified, cancelled
  created_by UUID NOT NULL REFERENCES public.employee_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, schedule_date)
);

-- Employee Performance Reviews
CREATE TABLE public.employee_performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.employee_profiles(id),
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  overall_rating NUMERIC CHECK (overall_rating >= 1 AND overall_rating <= 5),
  goals_met NUMERIC CHECK (goals_met >= 1 AND goals_met <= 5),
  quality_of_work NUMERIC CHECK (quality_of_work >= 1 AND quality_of_work <= 5),
  teamwork NUMERIC CHECK (teamwork >= 1 AND teamwork <= 5),
  punctuality NUMERIC CHECK (punctuality >= 1 AND punctuality <= 5),
  safety_compliance NUMERIC CHECK (safety_compliance >= 1 AND safety_compliance <= 5),
  strengths TEXT,
  areas_for_improvement TEXT,
  goals_for_next_period TEXT,
  employee_comments TEXT,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, completed, acknowledged
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employee Training Records
CREATE TABLE public.employee_training_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  training_name TEXT NOT NULL,
  training_type TEXT NOT NULL, -- safety, skills, certification, orientation
  training_provider TEXT,
  start_date DATE NOT NULL,
  completion_date DATE,
  expiry_date DATE,
  certification_number TEXT,
  cost NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'enrolled', -- enrolled, in_progress, completed, failed, expired
  score NUMERIC,
  instructor TEXT,
  location TEXT,
  attachments TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employee Payroll Records
CREATE TABLE public.employee_payroll_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employee_profiles(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  regular_hours NUMERIC NOT NULL DEFAULT 0,
  overtime_hours NUMERIC NOT NULL DEFAULT 0,
  holiday_hours NUMERIC NOT NULL DEFAULT 0,
  sick_hours NUMERIC NOT NULL DEFAULT 0,
  vacation_hours NUMERIC NOT NULL DEFAULT 0,
  gross_pay NUMERIC NOT NULL DEFAULT 0,
  federal_tax NUMERIC NOT NULL DEFAULT 0,
  state_tax NUMERIC NOT NULL DEFAULT 0,
  social_security NUMERIC NOT NULL DEFAULT 0,
  medicare NUMERIC NOT NULL DEFAULT 0,
  other_deductions NUMERIC NOT NULL DEFAULT 0,
  net_pay NUMERIC NOT NULL DEFAULT 0,
  pay_date DATE,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, processed, paid
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_trip_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_clock_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_payroll_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - can be refined later)
CREATE POLICY "Allow all operations on fleet_vehicles" ON public.fleet_vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fleet_maintenance_records" ON public.fleet_maintenance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fleet_fuel_records" ON public.fleet_fuel_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fleet_trip_logs" ON public.fleet_trip_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fleet_inspections" ON public.fleet_inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on employee_profiles" ON public.employee_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on time_clock_records" ON public.time_clock_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on employee_schedules" ON public.employee_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on employee_performance_reviews" ON public.employee_performance_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on employee_training_records" ON public.employee_training_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on employee_payroll_records" ON public.employee_payroll_records FOR ALL USING (true) WITH CHECK (true);

-- Create update timestamp triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fleet_vehicles_updated_at
  BEFORE UPDATE ON public.fleet_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_profiles_updated_at
  BEFORE UPDATE ON public.employee_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_fleet_vehicles_status ON public.fleet_vehicles(status);
CREATE INDEX idx_fleet_vehicles_vehicle_type ON public.fleet_vehicles(vehicle_type);
CREATE INDEX idx_fleet_vehicles_current_project ON public.fleet_vehicles(current_project_id);
CREATE INDEX idx_fleet_maintenance_vehicle_date ON public.fleet_maintenance_records(vehicle_id, service_date);
CREATE INDEX idx_fleet_fuel_vehicle_date ON public.fleet_fuel_records(vehicle_id, fuel_date);
CREATE INDEX idx_employee_profiles_status ON public.employee_profiles(status);
CREATE INDEX idx_employee_profiles_department ON public.employee_profiles(department);
CREATE INDEX idx_time_clock_employee_date ON public.time_clock_records(employee_id, clock_in);
CREATE INDEX idx_employee_schedules_date ON public.employee_schedules(schedule_date);
CREATE INDEX idx_employee_schedules_employee ON public.employee_schedules(employee_id);