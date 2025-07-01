
-- Phase 1: Complete Field Module Database Schema

-- Core field sites table
CREATE TABLE public.field_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  name TEXT NOT NULL,
  address TEXT,
  coordinates POINT, -- GPS coordinates
  boundaries POLYGON, -- Site boundaries
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  site_manager TEXT,
  access_instructions TEXT,
  safety_requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced site visits table
CREATE TABLE public.site_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  inspector_name TEXT NOT NULL,
  inspector_id TEXT,
  purpose TEXT NOT NULL,
  weather_conditions TEXT,
  temperature NUMERIC,
  wind_speed NUMERIC,
  visibility TEXT,
  findings TEXT,
  recommendations TEXT,
  safety_observations TEXT,
  environmental_notes TEXT,
  photos TEXT[],
  attachments TEXT[],
  gps_location POINT,
  duration_minutes INTEGER,
  attendees TEXT[],
  status TEXT DEFAULT 'completed' CHECK (status IN ('planned', 'in-progress', 'completed', 'cancelled')),
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced punchlist items table
CREATE TABLE public.punchlist_items (
  id TEXT NOT NULL PRIMARY KEY, -- Using TEXT for custom ID format like "PL-2001"
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  location TEXT NOT NULL,
  station_reference TEXT,
  description TEXT NOT NULL,
  detailed_description TEXT,
  category TEXT DEFAULT 'defect' CHECK (category IN ('defect', 'omission', 'damage', 'safety', 'quality')),
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to TEXT NOT NULL,
  assigned_crew TEXT,
  reporter_name TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed', 'rejected')),
  resolution_notes TEXT,
  resolution_date TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  photos_before TEXT[],
  photos_after TEXT[],
  gps_coordinates POINT,
  cost_impact NUMERIC DEFAULT 0,
  schedule_impact_days INTEGER DEFAULT 0,
  root_cause TEXT,
  corrective_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced work orders table
CREATE TABLE public.work_orders (
  id TEXT NOT NULL PRIMARY KEY, -- Using TEXT for custom ID format like "WO-3001"
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  punchlist_item_id TEXT REFERENCES public.punchlist_items(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scope_of_work TEXT,
  assigned_to TEXT NOT NULL,
  assigned_crew TEXT,
  crew_size INTEGER DEFAULT 1,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in-progress', 'completed', 'cancelled', 'on-hold')),
  due_date DATE NOT NULL,
  start_date DATE,
  completion_date DATE,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  location TEXT,
  station_reference TEXT,
  gps_coordinates POINT,
  materials_required JSONB, -- Array of materials with quantities
  equipment_required TEXT[],
  safety_requirements TEXT[],
  special_instructions TEXT,
  related_documents TEXT[],
  photos TEXT[],
  progress_notes TEXT,
  completion_notes TEXT,
  quality_check_required BOOLEAN DEFAULT true,
  quality_check_completed BOOLEAN DEFAULT false,
  quality_check_notes TEXT,
  created_by TEXT NOT NULL,
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced utility adjustments table
CREATE TABLE public.utility_adjustments (
  id TEXT NOT NULL PRIMARY KEY, -- Using TEXT for custom ID format like "UA-4001"
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  utility_type TEXT NOT NULL CHECK (utility_type IN ('water', 'gas', 'electric', 'telecom', 'sewer', 'cable', 'fiber')),
  utility_company TEXT NOT NULL,
  location TEXT NOT NULL,
  station_reference TEXT,
  gps_coordinates POINT,
  adjustment_type TEXT CHECK (adjustment_type IN ('relocation', 'protection', 'lowering', 'raising', 'removal', 'installation')),
  description TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  actual_date DATE,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  secondary_contact TEXT,
  permit_required BOOLEAN DEFAULT false,
  permit_number TEXT,
  permit_status TEXT,
  coordination_notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'delayed', 'cancelled')),
  delay_reason TEXT,
  completion_notes TEXT,
  related_documents TEXT[],
  photos TEXT[],
  cost NUMERIC DEFAULT 0,
  billing_info TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Field workers table
CREATE TABLE public.field_workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialty TEXT[],
  certifications JSONB, -- Array of certifications with expiry dates
  contact_phone TEXT,
  contact_email TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  current_location POINT,
  last_location_update TIMESTAMP WITH TIME ZONE,
  current_project_id UUID REFERENCES public.projects(id),
  current_site_id UUID REFERENCES public.field_sites(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on-break', 'off-duty', 'on-leave')),
  shift_start TIME,
  shift_end TIME,
  hourly_rate NUMERIC,
  supervisor TEXT,
  safety_training_expiry DATE,
  drug_test_date DATE,
  background_check_date DATE,
  hire_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Field crews table
CREATE TABLE public.field_crews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  crew_leader_id UUID REFERENCES public.field_workers(id),
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  specialty TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disbanded')),
  shift_start TIME,
  shift_end TIME,
  max_crew_size INTEGER DEFAULT 10,
  current_crew_size INTEGER DEFAULT 0,
  equipment_assigned TEXT[],
  current_work_order_id TEXT REFERENCES public.work_orders(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crew members junction table
CREATE TABLE public.crew_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crew_id UUID REFERENCES public.field_crews(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.field_workers(id) ON DELETE CASCADE,
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  role_in_crew TEXT,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(crew_id, worker_id)
);

-- Enhanced subcontractors table
CREATE TABLE public.subcontractors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  trade_specialty TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  address TEXT,
  license_number TEXT,
  license_expiry DATE,
  insurance_certificate TEXT,
  insurance_expiry DATE,
  bond_amount NUMERIC,
  bond_expiry DATE,
  safety_rating NUMERIC DEFAULT 0 CHECK (safety_rating >= 0 AND safety_rating <= 5),
  quality_rating NUMERIC DEFAULT 0 CHECK (quality_rating >= 0 AND quality_rating <= 5),
  schedule_rating NUMERIC DEFAULT 0 CHECK (schedule_rating >= 0 AND schedule_rating <= 5),
  overall_rating NUMERIC DEFAULT 0 CHECK (overall_rating >= 0 AND overall_rating <= 5),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'blacklisted')),
  prequalified BOOLEAN DEFAULT false,
  prequalification_expiry DATE,
  contract_value NUMERIC DEFAULT 0,
  work_completed_value NUMERIC DEFAULT 0,
  current_projects TEXT[],
  certifications TEXT[],
  key_personnel JSONB,
  equipment_owned TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Field photos table
CREATE TABLE public.field_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  related_table TEXT, -- 'punchlist_items', 'work_orders', 'site_visits', etc.
  related_id TEXT, -- ID from the related table
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  caption TEXT,
  description TEXT,
  photographer TEXT NOT NULL,
  gps_coordinates POINT,
  direction_facing NUMERIC, -- Compass direction in degrees
  weather_conditions TEXT,
  photo_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[],
  is_before_photo BOOLEAN DEFAULT false,
  is_after_photo BOOLEAN DEFAULT false,
  is_progress_photo BOOLEAN DEFAULT false,
  is_safety_photo BOOLEAN DEFAULT false,
  is_quality_photo BOOLEAN DEFAULT false,
  metadata JSONB, -- Camera settings, device info, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Equipment locations and tracking
CREATE TABLE public.equipment_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id TEXT NOT NULL,
  equipment_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  current_location POINT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance', 'out-of-service', 'transit')),
  operator_id UUID REFERENCES public.field_workers(id),
  operator_name TEXT,
  fuel_level NUMERIC DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
  hours_operated NUMERIC DEFAULT 0,
  last_maintenance DATE,
  next_maintenance DATE,
  maintenance_due BOOLEAN DEFAULT false,
  gps_tracking_enabled BOOLEAN DEFAULT true,
  last_location_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Material inventory tracking
CREATE TABLE public.material_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  material_name TEXT NOT NULL,
  material_code TEXT,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity_on_hand NUMERIC NOT NULL DEFAULT 0,
  quantity_reserved NUMERIC DEFAULT 0,
  quantity_available NUMERIC GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  minimum_stock NUMERIC DEFAULT 0,
  location_on_site TEXT,
  storage_requirements TEXT,
  supplier TEXT,
  unit_cost NUMERIC DEFAULT 0,
  total_value NUMERIC GENERATED ALWAYS AS (quantity_on_hand * unit_cost) STORED,
  last_delivery_date DATE,
  next_delivery_date DATE,
  expiry_date DATE,
  lot_number TEXT,
  quality_status TEXT DEFAULT 'approved' CHECK (quality_status IN ('approved', 'pending', 'rejected', 'expired')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safety incidents table
CREATE TABLE public.safety_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_number TEXT UNIQUE NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reported_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reported_by TEXT NOT NULL,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('near-miss', 'first-aid', 'medical-treatment', 'lost-time', 'fatality', 'property-damage')),
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'serious', 'critical')),
  location TEXT NOT NULL,
  gps_coordinates POINT,
  description TEXT NOT NULL,
  injured_person TEXT,
  injury_type TEXT,
  body_part_affected TEXT,
  medical_treatment_required BOOLEAN DEFAULT false,
  hospital_name TEXT,
  days_away_from_work INTEGER DEFAULT 0,
  immediate_cause TEXT,
  root_cause TEXT,
  corrective_actions TEXT,
  preventive_measures TEXT,
  witnesses TEXT[],
  photos TEXT[],
  documents TEXT[],
  osha_recordable BOOLEAN DEFAULT false,
  regulatory_notification_required BOOLEAN DEFAULT false,
  investigation_required BOOLEAN DEFAULT true,
  investigation_completed BOOLEAN DEFAULT false,
  investigation_date DATE,
  investigator TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'closed')),
  follow_up_required BOOLEAN DEFAULT true,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quality inspections table
CREATE TABLE public.quality_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  work_order_id TEXT REFERENCES public.work_orders(id),
  inspection_type TEXT NOT NULL,
  inspector_name TEXT NOT NULL,
  inspection_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT NOT NULL,
  station_reference TEXT,
  specification_reference TEXT,
  acceptance_criteria TEXT,
  test_results JSONB,
  measurements JSONB,
  pass_fail TEXT CHECK (pass_fail IN ('pass', 'fail', 'conditional')),
  deficiencies TEXT[],
  corrective_actions_required TEXT,
  re_inspection_required BOOLEAN DEFAULT false,
  re_inspection_date DATE,
  photos TEXT[],
  documents TEXT[],
  notes TEXT,
  approved_by TEXT,
  approval_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Environmental conditions logging
CREATE TABLE public.environmental_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  temperature NUMERIC,
  humidity NUMERIC,
  wind_speed NUMERIC,
  wind_direction NUMERIC,
  precipitation TEXT,
  visibility TEXT,
  air_quality_index NUMERIC,
  noise_level NUMERIC,
  dust_level TEXT,
  work_impact TEXT CHECK (work_impact IN ('none', 'minor', 'moderate', 'severe', 'stop-work')),
  recommendations TEXT,
  recorded_by TEXT NOT NULL,
  weather_source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tool assignments and tracking
CREATE TABLE public.tool_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_type TEXT NOT NULL,
  serial_number TEXT,
  project_id UUID REFERENCES public.projects(id),
  site_id UUID REFERENCES public.field_sites(id),
  assigned_to_worker_id UUID REFERENCES public.field_workers(id),
  assigned_to_crew_id UUID REFERENCES public.field_crews(id),
  checkout_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expected_return_date DATE,
  actual_return_date TIMESTAMP WITH TIME ZONE,
  condition_at_checkout TEXT DEFAULT 'good' CHECK (condition_at_checkout IN ('excellent', 'good', 'fair', 'poor', 'damaged')),
  condition_at_return TEXT CHECK (condition_at_return IN ('excellent', 'good', 'fair', 'poor', 'damaged')),
  checkout_notes TEXT,
  return_notes TEXT,
  maintenance_required BOOLEAN DEFAULT false,
  maintenance_notes TEXT,
  checked_out_by TEXT NOT NULL,
  returned_to TEXT,
  status TEXT DEFAULT 'checked-out' CHECK (status IN ('checked-out', 'returned', 'lost', 'damaged')),
  replacement_cost NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Dispatch assignments table
CREATE TABLE public.dispatch_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  work_order_id TEXT REFERENCES public.work_orders(id),
  assigned_to_worker_id UUID REFERENCES public.field_workers(id),
  assigned_to_crew_id UUID REFERENCES public.field_crews(id),
  assigned_to_name TEXT NOT NULL,
  assignment_type TEXT DEFAULT 'work_order' CHECK (assignment_type IN ('work_order', 'inspection', 'delivery', 'emergency', 'other')),
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location JSONB NOT NULL, -- {lat, lng, description}
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'en-route', 'on-site', 'completed', 'rejected')),
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_duration INTERVAL,
  actual_duration INTERVAL,
  gps_tracking_enabled BOOLEAN DEFAULT true,
  route_optimization BOOLEAN DEFAULT true,
  special_instructions TEXT,
  required_equipment TEXT[],
  required_materials JSONB,
  completion_notes TEXT,
  photos TEXT[],
  signature_required BOOLEAN DEFAULT false,
  signature_data TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.field_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.punchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_assignments ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for all operations
CREATE POLICY "Allow all operations on field_sites" ON public.field_sites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on site_visits" ON public.site_visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on punchlist_items" ON public.punchlist_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on work_orders" ON public.work_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on utility_adjustments" ON public.utility_adjustments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on field_workers" ON public.field_workers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on field_crews" ON public.field_crews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on crew_members" ON public.crew_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on subcontractors" ON public.subcontractors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on field_photos" ON public.field_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on equipment_tracking" ON public.equipment_tracking FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on material_inventory" ON public.material_inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on safety_incidents" ON public.safety_incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on quality_inspections" ON public.quality_inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on environmental_conditions" ON public.environmental_conditions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tool_assignments" ON public.tool_assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on dispatch_assignments" ON public.dispatch_assignments FOR ALL USING (true) WITH CHECK (true);

-- Create performance indexes
CREATE INDEX idx_field_sites_project_id ON public.field_sites(project_id);
CREATE INDEX idx_site_visits_project_id ON public.site_visits(project_id);
CREATE INDEX idx_site_visits_site_id ON public.site_visits(site_id);
CREATE INDEX idx_punchlist_items_project_id ON public.punchlist_items(project_id);
CREATE INDEX idx_punchlist_items_status ON public.punchlist_items(status);
CREATE INDEX idx_punchlist_items_severity ON public.punchlist_items(severity);
CREATE INDEX idx_work_orders_project_id ON public.work_orders(project_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_work_orders_assigned_to ON public.work_orders(assigned_to);
CREATE INDEX idx_utility_adjustments_project_id ON public.utility_adjustments(project_id);
CREATE INDEX idx_utility_adjustments_status ON public.utility_adjustments(status);
CREATE INDEX idx_field_workers_current_project_id ON public.field_workers(current_project_id);
CREATE INDEX idx_field_workers_status ON public.field_workers(status);
CREATE INDEX idx_equipment_tracking_project_id ON public.equipment_tracking(project_id);
CREATE INDEX idx_equipment_tracking_status ON public.equipment_tracking(status);
CREATE INDEX idx_safety_incidents_project_id ON public.safety_incidents(project_id);
CREATE INDEX idx_dispatch_assignments_project_id ON public.dispatch_assignments(project_id);
CREATE INDEX idx_dispatch_assignments_status ON public.dispatch_assignments(status);

-- Insert comprehensive sample data
INSERT INTO public.field_sites (project_id, name, address, coordinates, site_manager, access_instructions, safety_requirements) 
SELECT 
  id as project_id,
  name || ' Main Site' as name,
  location as address,
  POINT(33.7490, -84.3880) as coordinates, -- Atlanta coordinates as example
  'Site Manager' as site_manager,
  'Main entrance through construction gate. Check in at trailer.' as access_instructions,
  ARRAY['Hard hat required', 'Safety vest mandatory', 'Steel-toed boots required'] as safety_requirements
FROM public.projects 
LIMIT 5;

-- Insert field workers
INSERT INTO public.field_workers (employee_id, name, role, specialty, contact_phone, status) VALUES
('EMP-001', 'John Martinez', 'Foreman', ARRAY['Concrete', 'Paving'], '404-555-0101', 'active'),
('EMP-002', 'Sarah Johnson', 'Quality Inspector', ARRAY['Quality Control', 'Testing'], '404-555-0102', 'active'),
('EMP-003', 'Mike Davis', 'Equipment Operator', ARRAY['Heavy Equipment', 'Excavation'], '404-555-0103', 'active'),
('EMP-004', 'Lisa Williams', 'Safety Coordinator', ARRAY['Safety', 'Compliance'], '404-555-0104', 'active'),
('EMP-005', 'Carlos Rodriguez', 'Surveyor', ARRAY['Surveying', 'Layout'], '404-555-0105', 'active');

-- Insert subcontractors
INSERT INTO public.subcontractors (company_name, trade_specialty, contact_person, contact_phone, contact_email, safety_rating, quality_rating, status) VALUES
('Peachtree Paving LLC', 'Asphalt Paving', 'Tom Anderson', '678-555-0201', 'tom@peachtreepaving.com', 4.5, 4.3, 'active'),
('Atlanta Concrete Solutions', 'Concrete Work', 'Jennifer Lee', '770-555-0202', 'jennifer@atlantaconcrete.com', 4.8, 4.6, 'active'),
('Georgia Utilities Inc', 'Utility Work', 'Robert Kim', '404-555-0203', 'robert@georgiautils.com', 4.2, 4.1, 'active'),
('Southeast Excavation', 'Earthwork', 'Maria Gonzalez', '678-555-0204', 'maria@seexcavation.com', 4.7, 4.4, 'active');

-- Populate punchlist items with sample data
INSERT INTO public.punchlist_items (id, project_id, location, description, severity, assigned_to, due_date, reporter_name, status) 
SELECT 
  'PL-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0') as id,
  p.id as project_id,
  'Station 14+50' as location,
  'Edge of pavement showing raveling and needs repair' as description,
  'minor' as severity,
  'Paving Crew A' as assigned_to,
  CURRENT_DATE + INTERVAL '7 days' as due_date,
  'Quality Inspector' as reporter_name,
  'open' as status
FROM public.projects p 
LIMIT 3;

-- Populate work orders with sample data
INSERT INTO public.work_orders (id, project_id, title, description, assigned_to, priority, due_date, created_by, status) 
SELECT 
  'WO-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0') as id,
  p.id as project_id,
  'Mill and overlay section' as title,
  'Mill existing asphalt and overlay with new asphalt mix from Station 10+00 to 20+00' as description,
  'Paving Crew A' as assigned_to,
  'high' as priority,
  CURRENT_DATE + INTERVAL '5 days' as due_date,
  'Project Manager' as created_by,
  'in-progress' as status
FROM public.projects p 
LIMIT 3;

-- Populate utility adjustments with sample data
INSERT INTO public.utility_adjustments (id, project_id, utility_type, utility_company, location, description, scheduled_date, contact_name, contact_phone, status) 
SELECT 
  'UA-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0') as id,
  p.id as project_id,
  'water' as utility_type,
  'Atlanta Water Department' as utility_company,
  'Station 25+00' as location,
  'Water main lowering required for drainage installation' as description,
  CURRENT_DATE + INTERVAL '10 days' as scheduled_date,
  'Michael Johnson' as contact_name,
  '404-555-1234' as contact_phone,
  'scheduled' as status
FROM public.projects p 
LIMIT 3;

-- Enable realtime for critical tables
ALTER TABLE public.punchlist_items REPLICA IDENTITY FULL;
ALTER TABLE public.work_orders REPLICA IDENTITY FULL;
ALTER TABLE public.field_workers REPLICA IDENTITY FULL;
ALTER TABLE public.dispatch_assignments REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.punchlist_items;
ALTER publication supabase_realtime ADD TABLE public.work_orders;
ALTER publication supabase_realtime ADD TABLE public.field_workers;
ALTER publication supabase_realtime ADD TABLE public.dispatch_assignments;
