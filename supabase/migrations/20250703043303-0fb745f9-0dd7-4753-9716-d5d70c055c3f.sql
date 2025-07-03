-- Insert seed data for Finance module

-- Insert sample client invoices
INSERT INTO public.client_invoices (invoice_number, client_name, issue_date, due_date, amount, status, project_id, notes) VALUES
('INV-2025-001', 'Georgia DOT', '2025-01-15', '2025-02-14', 125000.00, 'sent', (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'Monthly progress billing'),
('INV-2025-002', 'City of Atlanta', '2025-01-20', '2025-02-19', 45000.00, 'paid', (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 'First milestone payment'),
('INV-2025-003', 'Gwinnett County', '2025-01-25', '2025-02-24', 32500.00, 'draft', (SELECT id FROM projects WHERE name = 'Gwinnett County Sidewalk Project' LIMIT 1), 'Initial billing'),
('INV-2025-004', 'Georgia DOT', '2025-01-10', '2025-01-25', 87500.00, 'overdue', (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'Overdue payment'),
('INV-2025-005', 'City of Augusta', '2025-01-28', '2025-02-27', 210000.00, 'sent', (SELECT id FROM projects WHERE name = 'Augusta Highway Extension' LIMIT 1), 'Progress billing Q1');

-- Insert sample vendor invoices
INSERT INTO public.vendor_invoices (invoice_number, vendor_name, issue_date, due_date, amount, status, project_id, po_number, notes) VALUES
('VND-001-2025', 'ABC Materials Supply', '2025-01-15', '2025-02-14', 25000.00, 'approved', (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'PO-2025-001', 'Asphalt materials'),
('VND-002-2025', 'Heavy Equipment Rental Co', '2025-01-20', '2025-02-19', 15000.00, 'paid', (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'PO-2025-002', 'Equipment rental'),
('VND-003-2025', 'Concrete Solutions Inc', '2025-01-22', '2025-02-21', 32000.00, 'pending', (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 'PO-2025-003', 'Concrete work'),
('VND-004-2025', 'Safety Supply Co', '2025-01-25', '2025-02-24', 5500.00, 'approved', NULL, 'PO-2025-004', 'Safety equipment'),
('VND-005-2025', 'Fuel Express', '2025-01-28', '2025-02-27', 8750.00, 'pending', NULL, 'PO-2025-005', 'Fleet fuel');

-- Insert sample purchase orders
INSERT INTO public.purchase_orders (po_number, vendor_name, issue_date, expected_delivery_date, total_amount, status, project_id, approved_by, notes) VALUES
('PO-2025-001', 'ABC Materials Supply', '2025-01-10', '2025-01-20', 25000.00, 'received', (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'John Smith', 'Asphalt materials'),
('PO-2025-002', 'Heavy Equipment Rental Co', '2025-01-12', '2025-01-25', 15000.00, 'received', (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'Sarah Johnson', 'Equipment rental'),
('PO-2025-003', 'Concrete Solutions Inc', '2025-01-15', '2025-01-30', 32000.00, 'issued', (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 'Mike Davis', 'Concrete work'),
('PO-2025-004', 'Safety Supply Co', '2025-01-18', '2025-02-01', 5500.00, 'received', NULL, 'Emily Brown', 'Safety equipment'),
('PO-2025-005', 'Fuel Express', '2025-01-20', '2025-02-05', 8750.00, 'issued', NULL, 'Robert Wilson', 'Fleet fuel'),
('PO-2025-006', 'Steel Works Inc', '2025-01-25', '2025-02-10', 45000.00, 'draft', (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), NULL, 'Steel materials');

-- Insert sample financial transactions
INSERT INTO public.financial_transactions (date, type, category, amount, description, account_name, project_id, reference, status, created_by) VALUES
('2025-01-15', 'income', 'Revenue', 45000.00, 'Client payment received', 'Operating Account', (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 'DEP-001', 'cleared', 'Finance Team'),
('2025-01-16', 'expense', 'Materials', 25000.00, 'Payment to ABC Materials', 'Operating Account', (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'CHK-001', 'cleared', 'Finance Team'),
('2025-01-17', 'expense', 'Equipment', 15000.00, 'Equipment rental payment', 'Operating Account', (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'CHK-002', 'cleared', 'Finance Team'),
('2025-01-18', 'expense', 'Fuel', 3250.00, 'Fleet fuel purchase', 'Operating Account', NULL, 'CHK-003', 'cleared', 'Finance Team'),
('2025-01-20', 'income', 'Revenue', 87500.00, 'Georgia DOT payment', 'Operating Account', (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'DEP-002', 'pending', 'Finance Team'),
('2025-01-22', 'expense', 'Labor', 12500.00, 'Payroll - Week 3', 'Payroll Account', NULL, 'PAY-003', 'cleared', 'HR Team'),
('2025-01-25', 'expense', 'Administrative', 2500.00, 'Office supplies', 'Operating Account', NULL, 'CHK-004', 'cleared', 'Admin Team');

-- Insert sample budgets
INSERT INTO public.budgets (project_id, total_budget, start_date, end_date, status) VALUES
((SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 1250000.00, '2025-01-01', '2025-06-30', 'active'),
((SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 875000.00, '2025-02-01', '2025-07-31', 'approved'),
((SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 450000.00, '2025-01-15', '2025-05-15', 'active'),
((SELECT id FROM projects WHERE name = 'Gwinnett County Sidewalk Project' LIMIT 1), 325000.00, '2025-03-01', '2025-08-31', 'draft'),
((SELECT id FROM projects WHERE name = 'Augusta Highway Extension' LIMIT 1), 2100000.00, '2025-04-01', '2025-12-31', 'approved');

-- Insert sample budget categories
INSERT INTO public.budget_categories (budget_id, name, budgeted_amount, spent_amount, type) VALUES
-- GA-400 Repaving budget categories
((SELECT id FROM budgets WHERE project_id = (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1) LIMIT 1), 'Materials', 500000.00, 125000.00, 'expense'),
((SELECT id FROM budgets WHERE project_id = (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1) LIMIT 1), 'Labor', 400000.00, 87500.00, 'expense'),
((SELECT id FROM budgets WHERE project_id = (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1) LIMIT 1), 'Equipment', 200000.00, 45000.00, 'expense'),
((SELECT id FROM budgets WHERE project_id = (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1) LIMIT 1), 'Overhead', 150000.00, 32500.00, 'expense'),
-- I-85 Bridge Repair budget categories
((SELECT id FROM budgets WHERE project_id = (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1) LIMIT 1), 'Materials', 350000.00, 75000.00, 'expense'),
((SELECT id FROM budgets WHERE project_id = (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1) LIMIT 1), 'Labor', 300000.00, 62500.00, 'expense'),
((SELECT id FROM budgets WHERE project_id = (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1) LIMIT 1), 'Equipment', 150000.00, 28000.00, 'expense'),
((SELECT id FROM budgets WHERE project_id = (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1) LIMIT 1), 'Subcontractors', 75000.00, 15000.00, 'expense');

-- Insert sample cash flow records
INSERT INTO public.cash_flow (date, inflows, outflows, net_cash_flow, running_balance, category, description) VALUES
('2025-01-01', 0.00, 0.00, 0.00, 500000.00, 'Opening Balance', 'Starting cash position'),
('2025-01-15', 45000.00, 0.00, 45000.00, 545000.00, 'Revenue', 'Client payment received'),
('2025-01-16', 0.00, 25000.00, -25000.00, 520000.00, 'Materials', 'Payment to suppliers'),
('2025-01-17', 0.00, 15000.00, -15000.00, 505000.00, 'Equipment', 'Equipment rental'),
('2025-01-18', 0.00, 3250.00, -3250.00, 501750.00, 'Fuel', 'Fleet fuel'),
('2025-01-20', 87500.00, 0.00, 87500.00, 589250.00, 'Revenue', 'Project payment'),
('2025-01-22', 0.00, 12500.00, -12500.00, 576750.00, 'Payroll', 'Employee wages'),
('2025-01-25', 0.00, 2500.00, -2500.00, 574250.00, 'Administrative', 'Office expenses');

-- Insert sample tax filings
INSERT INTO public.tax_filings (form_number, form_name, tax_year, due_date, status, assigned_to, amount, notes) VALUES
('941', 'Employers Quarterly Federal Tax Return', '2024', '2025-01-31', 'filed', 'Finance Team', 12500.00, 'Q4 2024 filed'),
('940', 'Employers Annual Federal Unemployment Tax Return', '2024', '2025-01-31', 'ready_for_review', 'Finance Team', 3200.00, 'Ready for final review'),
('1099-MISC', 'Miscellaneous Income', '2024', '2025-01-31', 'in_progress', 'Finance Team', 0.00, 'Preparing contractor forms'),
('W-2', 'Wage and Tax Statement', '2024', '2025-01-31', 'filed', 'HR Team', 0.00, 'Employee W-2s completed'),
('941', 'Employers Quarterly Federal Tax Return', '2025', '2025-04-30', 'not_started', 'Finance Team', 0.00, 'Q1 2025 upcoming'),
('State-Sales', 'Georgia Sales Tax Return', '2025', '2025-02-20', 'not_started', 'Finance Team', 8750.00, 'Monthly sales tax');

-- Insert seed data for Estimating module

-- Insert sample estimates
INSERT INTO public.estimates (estimate_number, project_name, client_name, status, total_cost, created_by, project_id, notes) VALUES
('EST-2025-001', 'GA-400 Repaving', 'Georgia DOT', 'approved', 1250000.00, 'John Smith', (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'Main highway repaving project'),
('EST-2025-002', 'I-85 Bridge Repair', 'Georgia DOT', 'submitted', 875000.00, 'Sarah Johnson', (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'Bridge structural repairs'),
('EST-2025-003', 'Peachtree Street Improvements', 'City of Atlanta', 'approved', 450000.00, 'Mike Davis', (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 'Street improvements downtown'),
('EST-2025-004', 'Gwinnett County Sidewalk Project', 'Gwinnett County', 'draft', 325000.00, 'Emily Brown', (SELECT id FROM projects WHERE name = 'Gwinnett County Sidewalk Project' LIMIT 1), 'New sidewalk installation'),
('EST-2025-005', 'Augusta Highway Extension', 'City of Augusta', 'rejected', 2100000.00, 'Robert Wilson', (SELECT id FROM projects WHERE name = 'Augusta Highway Extension' LIMIT 1), 'Highway extension project'),
('EST-2025-006', 'Downtown Parking Garage', 'City of Atlanta', 'draft', 750000.00, 'John Smith', NULL, 'New parking structure'),
('EST-2025-007', 'Airport Runway Resurfacing', 'Aviation Authority', 'submitted', 1850000.00, 'Sarah Johnson', NULL, 'Runway maintenance project');

-- Insert sample estimate items
INSERT INTO public.estimate_items (estimate_id, description, quantity, unit, unit_price, total_price, category, cost_code, created_by) VALUES
-- GA-400 Repaving items
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), 'Asphalt Paving - 2" thickness', 50000.00, 'sqft', 4.50, 225000.00, 'material', 'MAT-001', 'John Smith'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), 'Milling existing surface', 50000.00, 'sqft', 2.25, 112500.00, 'labor', 'LAB-001', 'John Smith'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), 'Traffic control setup', 1.00, 'lump', 75000.00, 75000.00, 'overhead', 'OVH-001', 'John Smith'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), 'Equipment rental - Paver', 30.00, 'days', 2500.00, 75000.00, 'equipment', 'EQP-001', 'John Smith'),
-- I-85 Bridge items
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-002' LIMIT 1), 'Structural steel repair', 500.00, 'lbs', 125.00, 62500.00, 'material', 'MAT-002', 'Sarah Johnson'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-002' LIMIT 1), 'Concrete deck repair', 2500.00, 'sqft', 45.00, 112500.00, 'material', 'MAT-003', 'Sarah Johnson'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-002' LIMIT 1), 'Bridge inspection specialist', 80.00, 'hours', 150.00, 12000.00, 'subcontractor', 'SUB-001', 'Sarah Johnson'),
-- Peachtree Street items
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-003' LIMIT 1), 'Concrete sidewalk', 5000.00, 'sqft', 12.50, 62500.00, 'material', 'MAT-004', 'Mike Davis'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-003' LIMIT 1), 'Street lighting installation', 25.00, 'each', 2500.00, 62500.00, 'equipment', 'EQP-002', 'Mike Davis'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-003' LIMIT 1), 'Traffic signal upgrades', 8.00, 'each', 15000.00, 120000.00, 'equipment', 'EQP-003', 'Mike Davis');

-- Insert sample vendor bids
INSERT INTO public.vendor_bids (estimate_id, vendor_name, bid_amount, status, submission_date, contact_info, notes) VALUES
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), 'ABC Asphalt Co', 1180000.00, 'pending', '2025-01-15', 'john@abcasphalt.com', 'Competitive pricing on materials'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), 'Superior Paving Inc', 1225000.00, 'pending', '2025-01-16', 'bid@superiorpaving.com', 'Premium quality guarantee'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-002' LIMIT 1), 'Bridge Masters LLC', 825000.00, 'accepted', '2025-01-18', 'quotes@bridgemasters.com', 'Specialized bridge expertise'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-002' LIMIT 1), 'Structural Solutions', 890000.00, 'rejected', '2025-01-20', 'bids@structuralsolutions.com', 'Higher cost, longer timeline'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-003' LIMIT 1), 'City Contractors', 425000.00, 'pending', '2025-01-22', 'info@citycontractors.com', 'Local contractor with good reputation');

-- Insert sample material costs
INSERT INTO public.material_costs (name, unit, cost, category, region, supplier, effective_date) VALUES
('Asphalt - Hot Mix', 'ton', 85.50, 'Paving', 'Georgia', 'ABC Materials', '2025-01-01'),
('Concrete - 4000 PSI', 'cubic yard', 125.00, 'Concrete', 'Georgia', 'Concrete Supply Co', '2025-01-01'),
('Rebar - #4 Grade 60', 'pound', 0.85, 'Steel', 'Georgia', 'Steel Works Inc', '2025-01-01'),
('Aggregate - 57 Stone', 'ton', 28.50, 'Base Material', 'Georgia', 'Quarry Direct', '2025-01-01'),
('Portland Cement', 'bag', 12.75, 'Concrete', 'Georgia', 'Cement Supply', '2025-01-01'),
('Traffic Paint', 'gallon', 45.00, 'Marking', 'Georgia', 'Safety Supply Co', '2025-01-01'),
('PVC Pipe - 12"', 'linear foot', 35.50, 'Utilities', 'Georgia', 'Pipe Supply Inc', '2025-01-01'),
('LED Street Light', 'each', 850.00, 'Electrical', 'Georgia', 'Lighting Solutions', '2025-01-01');

-- Insert sample labor rates
INSERT INTO public.labor_rates (trade, classification, base_rate, overtime_rate, region, effective_date) VALUES
('Heavy Equipment Operator', 'Journey Level', 32.50, 48.75, 'Georgia', '2025-01-01'),
('Concrete Finisher', 'Journey Level', 28.75, 43.13, 'Georgia', '2025-01-01'),
('Laborer', 'General', 18.50, 27.75, 'Georgia', '2025-01-01'),
('Carpenter', 'Journey Level', 35.00, 52.50, 'Georgia', '2025-01-01'),
('Electrician', 'Journey Level', 42.50, 63.75, 'Georgia', '2025-01-01'),
('Iron Worker', 'Journey Level', 38.25, 57.38, 'Georgia', '2025-01-01'),
('Truck Driver', 'Commercial', 22.00, 33.00, 'Georgia', '2025-01-01'),
('Foreman', 'Supervisor', 45.00, 67.50, 'Georgia', '2025-01-01');

-- Insert sample site visit reports
INSERT INTO public.site_visit_reports (estimate_id, project_id, visit_date, visited_by, duration_hours, weather_conditions, site_conditions, access_notes, recommendations) VALUES
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), '2024-12-15', 'John Smith', 3.5, 'Clear, 45°F', 'Good access, existing pavement cracked', 'Will need traffic control setup by mile marker 15', 'Recommend milling before paving, drainage looks adequate'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-002' LIMIT 1), (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), '2024-12-18', 'Sarah Johnson', 4.0, 'Overcast, 52°F', 'Bridge shows stress fractures on south side', 'Access limited during peak hours 7-9am, 4-6pm', 'Major structural work needed, recommend full lane closure'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-003' LIMIT 1), (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), '2024-12-20', 'Mike Davis', 2.5, 'Sunny, 38°F', 'Urban setting, heavy pedestrian traffic', 'Multiple utility conflicts identified', 'Coordinate with city utilities, phased construction recommended'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-004' LIMIT 1), (SELECT id FROM projects WHERE name = 'Gwinnett County Sidewalk Project' LIMIT 1), '2025-01-05', 'Emily Brown', 2.0, 'Light rain, 42°F', 'Residential area, good drainage', 'Some tree removal may be required', 'Check with county on tree removal permits');

-- Insert sample buyout packages
INSERT INTO public.buyout_packages (estimate_id, package_name, scope, amount, original_estimate, variance, due_date, status, vendor_name) VALUES
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), 'Asphalt Materials', 'All hot mix asphalt for main roadway', 225000.00, 250000.00, -25000.00, '2025-02-15', 'pending', 'ABC Asphalt Co'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-001' LIMIT 1), 'Traffic Control', 'Full traffic management and signage', 75000.00, 80000.00, -5000.00, '2025-02-01', 'awarded', 'Safety First Traffic'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-002' LIMIT 1), 'Structural Steel', 'Bridge steel repair and replacement', 85000.00, 90000.00, -5000.00, '2025-03-01', 'pending', 'Steel Works Inc'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-003' LIMIT 1), 'Electrical Work', 'Street lighting and signal installation', 180000.00, 175000.00, 5000.00, '2025-02-20', 'approved', 'Lighting Solutions'),
((SELECT id FROM estimates WHERE estimate_number = 'EST-2025-003' LIMIT 1), 'Concrete Work', 'Sidewalk and curb installation', 125000.00, 130000.00, -5000.00, '2025-02-10', 'pending', 'Concrete Supply Co');

-- Insert sample estimate templates
INSERT INTO public.estimate_templates (name, description, category, created_by, is_public) VALUES
('Highway Paving Standard', 'Standard template for highway paving projects', 'Paving', 'John Smith', true),
('Bridge Repair Basic', 'Basic bridge repair and maintenance template', 'Bridge Work', 'Sarah Johnson', true),
('Urban Street Improvements', 'Template for city street improvement projects', 'Street Work', 'Mike Davis', true),
('Parking Lot Construction', 'Commercial parking lot construction template', 'Paving', 'Emily Brown', false),
('Utility Installation', 'Underground utility installation template', 'Utilities', 'Robert Wilson', true);