-- Add more comprehensive test data for various modules

-- Add more projects
INSERT INTO projects (name, project_id, description, client_name, status, location, start_date, end_date, contract_value, budget_allocated, progress_percentage) VALUES
('Downtown Bridge Reconstruction', 'PROJ-007', 'Complete reconstruction of downtown bridge infrastructure', 'City of Atlanta', 'active', 'Downtown Atlanta, GA', '2024-01-15', '2024-12-20', 2500000, 2400000, 35),
('Interstate 285 Expansion', 'PROJ-008', 'Highway expansion and resurfacing project', 'Georgia DOT', 'active', 'I-285 Perimeter', '2024-03-01', '2025-08-30', 15000000, 14500000, 22),
('Midtown Office Complex', 'PROJ-009', 'New 25-story office building construction', 'Midtown Development LLC', 'planning', 'Midtown Atlanta, GA', '2024-07-01', '2026-12-15', 45000000, 44000000, 5);

-- Add field workers
INSERT INTO field_workers (employee_id, name, role, specialty, status, hire_date, hourly_rate, contact_phone, contact_email, supervisor) VALUES
('FW-001', 'Carlos Martinez', 'Heavy Equipment Operator', ARRAY['excavator', 'bulldozer'], 'active', '2023-06-15', 32.50, '555-0201', 'carlos.m@company.com', 'David Brown'),
('FW-002', 'Jennifer Lee', 'Site Safety Coordinator', ARRAY['safety', 'osha'], 'active', '2023-02-20', 35.00, '555-0202', 'jennifer.l@company.com', 'Mike Rodriguez'),
('FW-003', 'Robert Johnson', 'Concrete Finisher', ARRAY['concrete', 'finishing'], 'active', '2022-11-10', 28.00, '555-0203', 'robert.j@company.com', 'David Brown'),
('FW-004', 'Maria Gonzalez', 'Survey Technician', ARRAY['surveying', 'gps'], 'active', '2023-08-05', 30.00, '555-0204', 'maria.g@company.com', 'Lisa Chen');

-- Add field crews
INSERT INTO field_crews (name, specialty, crew_leader_id, max_crew_size, current_crew_size, status, shift_start, shift_end) VALUES
('Excavation Crew Alpha', 'Excavation and Earthwork', (SELECT id FROM field_workers WHERE name = 'Carlos Martinez'), 8, 6, 'active', '07:00', '15:30'),
('Concrete Crew Beta', 'Concrete and Finishing', (SELECT id FROM field_workers WHERE name = 'Robert Johnson'), 6, 4, 'active', '06:00', '14:30'),
('Safety Team Gamma', 'Safety and Inspection', (SELECT id FROM field_workers WHERE name = 'Jennifer Lee'), 4, 3, 'active', '06:30', '15:00');

-- Add punchlist items
INSERT INTO punchlist_items (title, description, assigned_to, due_date, priority, status, category, location, project_id, created_by) VALUES
('Fix concrete surface irregularities', 'Smooth out concrete surface imperfections in Section C', 'Robert Johnson', '2024-07-15', 'medium', 'open', 'quality', 'Section C, North Side', (SELECT id FROM projects WHERE name = 'Downtown Bridge Reconstruction'), 'Site Inspector'),
('Install missing safety rails', 'Install 50ft of safety railing along east perimeter', 'Jennifer Lee', '2024-07-12', 'high', 'in_progress', 'safety', 'East Perimeter', (SELECT id FROM projects WHERE name = 'Downtown Bridge Reconstruction'), 'Safety Officer'),
('Repair damaged asphalt edge', 'Fix cracked asphalt along the construction joint', 'Carlos Martinez', '2024-07-20', 'low', 'open', 'defect', 'Lane 2, Mile Marker 15', (SELECT id FROM projects WHERE name = 'Interstate 285 Expansion'), 'Quality Control');

-- Add equipment tracking
INSERT INTO equipment_tracking (equipment_id, equipment_name, equipment_type, status, operator_id, operator_name, fuel_level, hours_operated, last_maintenance, next_maintenance) VALUES
('EQ-001', 'CAT 320E Excavator', 'excavator', 'in_use', (SELECT id FROM field_workers WHERE name = 'Carlos Martinez'), 'Carlos Martinez', 75.5, 1245.5, '2024-06-15', '2024-08-15'),
('EQ-002', 'Volvo A40G Dump Truck', 'dump_truck', 'available', NULL, NULL, 85.2, 2876.3, '2024-05-20', '2024-07-20'),
('EQ-003', 'JD 310L Backhoe', 'backhoe', 'maintenance', NULL, NULL, 45.0, 890.2, '2024-07-01', '2024-09-01');

-- Add employee schedules
INSERT INTO employee_schedules (employee_id, schedule_date, shift_start, shift_end, project_id, location, role_for_day, status, created_by) VALUES
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-002'), '2024-07-15', '07:00', '15:30', (SELECT id FROM projects WHERE name = 'Downtown Bridge Reconstruction'), 'Bridge Site', 'Equipment Operator', 'scheduled', (SELECT id FROM employee_profiles WHERE employee_id = 'EMP-005')),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-003'), '2024-07-15', '06:30', '15:00', (SELECT id FROM projects WHERE name = 'Downtown Bridge Reconstruction'), 'Bridge Site', 'Safety Officer', 'scheduled', (SELECT id FROM employee_profiles WHERE employee_id = 'EMP-005')),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-004'), '2024-07-15', '08:00', '16:30', (SELECT id FROM projects LIMIT 1), 'Office', 'Project Coordinator', 'scheduled', (SELECT id FROM employee_profiles WHERE employee_id = 'EMP-005'));

-- Add payroll calculations for testing
INSERT INTO payroll_calculations (employee_id, pay_period_start, pay_period_end, regular_hours, overtime_hours, regular_rate, overtime_rate, gross_pay, federal_tax, state_tax, social_security, medicare, net_pay, status) VALUES
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-002'), '2024-07-01', '2024-07-15', 80.0, 4.0, 28.50, 42.75, 2451.00, 294.12, 122.55, 151.96, 35.54, 1846.83, 'approved'),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-003'), '2024-07-01', '2024-07-15', 80.0, 2.0, 32.00, 48.00, 2656.00, 318.72, 132.80, 164.67, 38.51, 2001.30, 'approved'),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-005'), '2024-07-01', '2024-07-15', 80.0, 6.0, 35.00, 52.50, 3115.00, 373.80, 155.75, 193.13, 45.17, 2347.15, 'approved');