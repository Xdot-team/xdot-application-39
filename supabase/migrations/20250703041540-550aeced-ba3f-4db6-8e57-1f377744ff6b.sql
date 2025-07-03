-- Add more comprehensive test data for various modules (fixed)

-- Add more projects (using valid status values)
INSERT INTO projects (name, project_id, description, client_name, status, location, start_date, end_date, contract_value, budget_allocated, progress_percentage) VALUES
('Downtown Bridge Reconstruction', 'PROJ-007', 'Complete reconstruction of downtown bridge infrastructure', 'City of Atlanta', 'in_progress', 'Downtown Atlanta, GA', '2024-01-15', '2024-12-20', 2500000, 2400000, 35),
('Interstate 285 Expansion', 'PROJ-008', 'Highway expansion and resurfacing project', 'Georgia DOT', 'in_progress', 'I-285 Perimeter', '2024-03-01', '2025-08-30', 15000000, 14500000, 22),
('Midtown Office Complex', 'PROJ-009', 'New 25-story office building construction', 'Midtown Development LLC', 'upcoming', 'Midtown Atlanta, GA', '2024-07-01', '2026-12-15', 45000000, 44000000, 5);

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