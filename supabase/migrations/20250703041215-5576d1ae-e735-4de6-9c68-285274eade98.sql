-- Populate test data for materials inventory
INSERT INTO material_inventory (material_name, material_code, category, unit, quantity_on_hand, unit_cost, minimum_stock, supplier, location_on_site, notes) VALUES
('Asphalt Mix Type B', 'MAT-001', 'asphalt', 'tons', 45.5, 85.00, 10, 'Metro Asphalt Co', 'North Yard', 'Hot mix asphalt for road surfaces'),
('Concrete 3000 PSI', 'MAT-002', 'concrete', 'yards', 28.0, 120.00, 5, 'Superior Concrete', 'Bay 2', 'Standard concrete mix'),
('Rebar #4', 'MAT-003', 'steel', 'pounds', 2500, 0.75, 500, 'Steel Supply Inc', 'Warehouse A', '1/2 inch rebar'),
('Safety Vests', 'MAT-004', 'safety', 'each', 25, 15.00, 10, 'Safety First Co', 'Office Storage', 'High visibility safety vests'),
('Aggregate Base', 'MAT-005', 'aggregate', 'tons', 120.0, 35.00, 20, 'Rock Quarry LLC', 'South Yard', 'Crushed stone base material'),
('PVC Pipe 6"', 'MAT-006', 'general', 'feet', 850, 8.50, 100, 'Pipe Masters', 'Shed B', 'Drainage pipe'),
('Portland Cement', 'MAT-007', 'concrete', 'bags', 180, 12.00, 50, 'Cement Plus', 'Warehouse B', '94lb bags'),
('Traffic Cones', 'MAT-008', 'safety', 'each', 45, 25.00, 20, 'Traffic Safety Co', 'Equipment Bay', '28 inch orange cones');

-- Populate employee health records
INSERT INTO employee_health_records (employee_id, record_date, record_type, status, provider_name, restrictions, follow_up_date) VALUES
((SELECT id FROM employee_profiles LIMIT 1), '2024-01-15', 'routine_check', 'current', 'Dr. Smith Medical', NULL, '2025-01-15'),
((SELECT id FROM employee_profiles LIMIT 1), '2024-06-20', 'wellness_program', 'current', 'Wellness Center', NULL, NULL),
((SELECT id FROM employee_profiles LIMIT 1), '2024-03-10', 'injury_assessment', 'current', 'Occupational Health', 'Light duty only', '2024-04-10');

-- Populate training records
INSERT INTO employee_training_records (employee_id, training_name, training_type, start_date, completion_date, status, training_provider, cost, score) VALUES
((SELECT id FROM employee_profiles LIMIT 1), 'OSHA 10-Hour Construction', 'safety', '2024-01-10', '2024-01-12', 'completed', 'OSHA Training Institute', 150.00, 95),
((SELECT id FROM employee_profiles LIMIT 1), 'Forklift Operation Certification', 'equipment', '2024-02-15', '2024-02-16', 'completed', 'Equipment Training Co', 200.00, 88),
((SELECT id FROM employee_profiles LIMIT 1), 'First Aid/CPR', 'safety', '2024-03-20', '2024-03-20', 'completed', 'Red Cross', 75.00, 92),
((SELECT id FROM employee_profiles LIMIT 1), 'Confined Space Entry', 'safety', '2024-05-10', NULL, 'enrolled', 'Safety Training Center', 300.00, NULL);

-- Add more employee profiles for better testing
INSERT INTO employee_profiles (employee_id, first_name, last_name, email, phone, department, job_title, hire_date, pay_rate, pay_type, status) VALUES
('EMP-002', 'Sarah', 'Johnson', 'sarah.j@company.com', '555-0102', 'Operations', 'Equipment Operator', '2023-03-15', 28.50, 'hourly', 'active'),
('EMP-003', 'Mike', 'Rodriguez', 'mike.r@company.com', '555-0103', 'Safety', 'Safety Officer', '2022-08-20', 32.00, 'hourly', 'active'),
('EMP-004', 'Lisa', 'Chen', 'lisa.c@company.com', '555-0104', 'Administration', 'Project Coordinator', '2023-11-10', 55000, 'salary', 'active'),
('EMP-005', 'David', 'Brown', 'david.b@company.com', '555-0105', 'Field Operations', 'Foreman', '2021-05-12', 35.00, 'hourly', 'active');

-- Add more vehicles
INSERT INTO fleet_vehicles (vehicle_number, make, model, year, vehicle_type, status, current_mileage, fuel_type, license_plate) VALUES
('VEH-002', 'Caterpillar', '320E', 2022, 'excavator', 'available', 1250, 'diesel', 'CAT-001'),
('VEH-003', 'Ford', 'F-550', 2023, 'pickup_truck', 'available', 15420, 'diesel', 'FRD-550'),
('VEH-004', 'Volvo', 'A40G', 2021, 'dump_truck', 'in_use', 28750, 'diesel', 'VOL-040'),
('VEH-005', 'John Deere', '310L', 2023, 'backhoe', 'maintenance', 890, 'diesel', 'JD-310');

-- Add onboarding workflows
INSERT INTO onboarding_workflows (employee_id, workflow_template, assigned_hr_rep, total_steps, started_date, expected_completion_date, status) VALUES
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-002'), 'standard', 'HR Manager', 8, '2023-03-15', '2023-03-29', 'completed'),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-003'), 'manager', 'HR Manager', 12, '2022-08-20', '2022-09-15', 'completed'),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-004'), 'standard', 'HR Assistant', 8, '2023-11-10', '2023-11-24', 'completed'),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-005'), 'field_worker', 'HR Manager', 10, '2021-05-12', '2021-05-28', 'completed');