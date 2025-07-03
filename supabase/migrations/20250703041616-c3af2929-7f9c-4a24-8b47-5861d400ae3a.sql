-- Add more comprehensive test data using correct status values

-- Add more projects (using correct status values: active, completed, upcoming)
INSERT INTO projects (name, project_id, description, client_name, status, location, start_date, end_date, contract_value, budget_allocated, progress_percentage) VALUES
('Downtown Bridge Reconstruction', 'PROJ-007', 'Complete reconstruction of downtown bridge infrastructure', 'City of Atlanta', 'active', 'Downtown Atlanta, GA', '2024-01-15', '2024-12-20', 2500000, 2400000, 35),
('Interstate 285 Expansion', 'PROJ-008', 'Highway expansion and resurfacing project', 'Georgia DOT', 'active', 'I-285 Perimeter', '2024-03-01', '2025-08-30', 15000000, 14500000, 22),
('Midtown Office Complex', 'PROJ-009', 'New 25-story office building construction', 'Midtown Development LLC', 'upcoming', 'Midtown Atlanta, GA', '2024-07-01', '2026-12-15', 45000000, 44000000, 5);

-- Add more comprehensive payroll test data
INSERT INTO payroll_calculations (employee_id, pay_period_start, pay_period_end, regular_hours, overtime_hours, regular_rate, overtime_rate, gross_pay, federal_tax, state_tax, social_security, medicare, net_pay, status) VALUES
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-002'), '2024-07-01', '2024-07-15', 80.0, 4.0, 28.50, 42.75, 2451.00, 294.12, 122.55, 151.96, 35.54, 1846.83, 'approved'),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-003'), '2024-07-01', '2024-07-15', 80.0, 2.0, 32.00, 48.00, 2656.00, 318.72, 132.80, 164.67, 38.51, 2001.30, 'approved'),
((SELECT id FROM employee_profiles WHERE employee_id = 'EMP-005'), '2024-07-01', '2024-07-15', 80.0, 6.0, 35.00, 52.50, 3115.00, 373.80, 155.75, 193.13, 45.17, 2347.15, 'approved');