-- Insert seed data for Safety & Risk Management and Schedule modules

-- Safety incidents seed data
INSERT INTO public.safety_incidents (
  incident_number, incident_date, location, incident_type, severity, description, 
  reported_by, project_id, status, corrective_actions, estimated_cost, lost_time_hours, recordable, osha_reportable
) VALUES
('SI-2025-001', '2025-01-15 10:30:00', 'GA-400 Mile Marker 15', 'near_miss', 'medium', 
 'Worker nearly struck by moving equipment during paving operations', 'John Smith', 
 (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'resolved', 
 'Implemented additional spotters and communication protocols', 500.00, 0, false, false),

('SI-2025-002', '2025-01-20 14:15:00', 'I-85 Bridge Site', 'injury', 'low', 
 'Minor cut on hand while handling steel reinforcement', 'Sarah Johnson', 
 (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'closed', 
 'Additional safety training on proper handling techniques', 150.00, 2.5, true, false),

('SI-2025-003', '2025-01-25 09:45:00', 'Peachtree Street Downtown', 'property_damage', 'medium', 
 'Construction equipment damaged parked vehicle', 'Mike Davis', 
 (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 'investigating', 
 'Review of equipment operation procedures', 2500.00, 0, false, false),

('SI-2025-004', '2025-02-01 16:00:00', 'Augusta Highway Extension', 'environmental', 'high', 
 'Fuel spill from equipment malfunction', 'Emily Brown', 
 (SELECT id FROM projects WHERE name = 'Augusta Highway Extension' LIMIT 1), 'open', 
 'Immediate containment and cleanup, equipment inspection', 5000.00, 0, true, true);

-- Hazard reports seed data
INSERT INTO public.hazard_reports (
  hazard_number, reported_date, location, hazard_type, priority, description, 
  reported_by, project_id, status, recommended_actions, affected_workers
) VALUES
('HR-2025-001', '2025-01-12 08:00:00', 'GA-400 Staging Area', 'physical', 'high', 
 'Loose gravel creating slip hazards in high traffic area', 'Tom Wilson', 
 (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'resolved', 
 'Install temporary walkways and improve drainage', 15),

('HR-2025-002', '2025-01-18 11:30:00', 'I-85 Bridge Deck', 'ergonomic', 'medium', 
 'Heavy lifting required without proper mechanical aids', 'Lisa Chen', 
 (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'in_progress', 
 'Provide lifting equipment and additional personnel', 8),

('HR-2025-003', '2025-01-22 13:15:00', 'Peachtree Street Intersection', 'environmental', 'high', 
 'Poor air quality due to dust generation during demolition', 'Robert Johnson', 
 (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 'assigned', 
 'Implement dust suppression measures and provide respirators', 12),

('HR-2025-004', '2025-01-28 07:45:00', 'Gwinnett County Site', 'chemical', 'critical', 
 'Potential asbestos in existing pavement to be removed', 'Jane Smith', 
 (SELECT id FROM projects WHERE name = 'Gwinnett County Sidewalk Project' LIMIT 1), 'open', 
 'Conduct testing and implement proper abatement procedures', 20);

-- Risk assessments seed data
INSERT INTO public.risk_assessments (
  assessment_number, assessment_date, project_id, assessed_by, assessment_type, 
  scope_description, status, overall_risk_rating, recommendations
) VALUES
('RA-2025-001', '2025-01-10', (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 
 'Safety Manager John Doe', 'project_startup', 
 'Comprehensive risk assessment for highway repaving project including traffic management', 
 'approved', 'medium', 'Implement enhanced traffic control measures and worker safety protocols'),

('RA-2025-002', '2025-01-15', (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 
 'Safety Engineer Sarah Lee', 'project_startup', 
 'Bridge repair operations risk assessment covering work at height and structural work', 
 'active', 'high', 'Mandatory fall protection, structural engineering oversight, weather monitoring'),

('RA-2025-003', '2025-01-20', (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 
 'Risk Analyst Mike Brown', 'periodic', 
 'Urban construction risks including pedestrian safety and utility conflicts', 
 'review', 'medium', 'Enhanced pedestrian barriers, utility locating, noise control measures');

-- Driver safety records seed data
INSERT INTO public.driver_safety_records (
  driver_name, vehicle_id, record_date, record_type, driving_score, speed_violations, 
  harsh_braking_events, miles_driven, license_status
) VALUES
('John Smith', (SELECT id FROM fleet_vehicles WHERE vehicle_number = 'T-001' LIMIT 1), 
 '2025-01-15', 'performance_review', 92.5, 0, 2, 1250.5, 'valid'),

('Sarah Johnson', (SELECT id FROM fleet_vehicles WHERE vehicle_number = 'T-002' LIMIT 1), 
 '2025-01-16', 'performance_review', 88.3, 1, 5, 1890.2, 'valid'),

('Mike Davis', (SELECT id FROM fleet_vehicles WHERE vehicle_number = 'E-001' LIMIT 1), 
 '2025-01-17', 'incident', 75.0, 2, 8, 945.8, 'valid'),

('Emily Brown', (SELECT id FROM fleet_vehicles WHERE vehicle_number = 'T-003' LIMIT 1), 
 '2025-01-18', 'performance_review', 95.7, 0, 1, 1456.3, 'valid');

-- Schedule events seed data
INSERT INTO public.schedule_events (
  title, description, event_type, category, priority, status, start_date, end_date, 
  all_day, location, project_id, created_by, color_code
) VALUES
('GA-400 Project Kickoff', 'Initial project meeting and site mobilization', 'project_milestone', 'project', 'high', 
 'completed', '2025-01-15 08:00:00', '2025-01-15 17:00:00', true, 'GA-400 Mile Marker 12', 
 (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'Project Manager', '#10b981'),

('Weekly Safety Meeting', 'Regular safety briefing for all project teams', 'meeting', 'meeting', 'medium', 
 'scheduled', '2025-02-05 07:30:00', '2025-02-05 08:30:00', false, 'Main Office Conference Room', 
 NULL, 'Safety Manager', '#f59e0b'),

('Equipment Maintenance - Paver 1', 'Scheduled maintenance for primary paving equipment', 'equipment_maintenance', 'equipment', 'high', 
 'scheduled', '2025-02-10 06:00:00', '2025-02-10 18:00:00', true, 'Equipment Yard', 
 (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'Fleet Manager', '#ef4444'),

('Bridge Inspection Training', 'Specialized training for bridge inspection techniques', 'training_session', 'training', 'medium', 
 'scheduled', '2025-02-15 08:00:00', '2025-02-15 16:00:00', false, 'Training Center', 
 (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'Training Coordinator', '#3b82f6'),

('Monthly Progress Review', 'Review of all active projects and milestone updates', 'meeting', 'meeting', 'high', 
 'scheduled', '2025-02-28 09:00:00', '2025-02-28 12:00:00', false, 'Executive Conference Room', 
 NULL, 'Operations Manager', '#8b5cf6');

-- Resource allocations seed data
INSERT INTO public.resource_allocations (
  resource_type, resource_id, resource_name, project_id, allocation_start, allocation_end, 
  hours_per_day, quantity_allocated, status, created_by, cost_per_hour, total_estimated_cost
) VALUES
('employee', (SELECT id FROM employee_profiles WHERE first_name = 'John' LIMIT 1), 'John Smith - Foreman', 
 (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), '2025-01-15 00:00:00', '2025-06-30 00:00:00', 
 8, 1, 'scheduled', 'Project Manager', 45.00, 50400.00),

('equipment', (SELECT id FROM fleet_vehicles WHERE vehicle_number = 'T-001' LIMIT 1), 'Truck T-001', 
 (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), '2025-01-20 00:00:00', '2025-05-15 00:00:00', 
 10, 1, 'in_progress', 'Fleet Manager', 25.00, 27500.00),

('employee', (SELECT id FROM employee_profiles WHERE first_name = 'Sarah' LIMIT 1), 'Sarah Johnson - Engineer', 
 (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), '2025-02-01 00:00:00', '2025-07-31 00:00:00', 
 8, 1, 'scheduled', 'Project Manager', 55.00, 67760.00),

('equipment', (SELECT id FROM fleet_vehicles WHERE vehicle_number = 'E-001' LIMIT 1), 'Excavator E-001', 
 (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), '2025-02-15 00:00:00', '2025-04-30 00:00:00', 
 8, 1, 'scheduled', 'Fleet Manager', 75.00, 43200.00);

-- Meetings seed data
INSERT INTO public.meetings (
  title, description, meeting_type, date, start_time, end_time, location, 
  is_virtual, organizer, project_id, status
) VALUES
('Daily Standup - GA-400', 'Daily coordination meeting for GA-400 project team', 'team_standup', 
 '2025-02-05', '07:00:00', '07:30:00', 'Site Trailer', false, 'John Smith', 
 (SELECT id FROM projects WHERE name = 'GA-400 Repaving' LIMIT 1), 'scheduled'),

('Client Progress Review', 'Monthly progress review with Georgia DOT', 'client_meeting', 
 '2025-02-15', '10:00:00', '12:00:00', 'DOT District Office', false, 'Project Manager', 
 (SELECT id FROM projects WHERE name = 'I-85 Bridge Repair' LIMIT 1), 'scheduled'),

('Safety Committee Meeting', 'Monthly safety committee review', 'safety_meeting', 
 '2025-02-20', '14:00:00', '16:00:00', 'Main Office', true, 'Safety Manager', 
 NULL, 'scheduled'),

('Project Kickoff - Peachtree', 'Initial project planning and team coordination', 'project_kickoff', 
 '2025-02-25', '09:00:00', '17:00:00', 'Project Site', false, 'Mike Davis', 
 (SELECT id FROM projects WHERE name = 'Peachtree Street Improvements' LIMIT 1), 'scheduled');

-- Schedule conflicts seed data
INSERT INTO public.schedule_conflicts (
  conflict_type, severity, description, affected_resources, status
) VALUES
('resource_double_booked', 'medium', 'Equipment E-001 scheduled for two different projects on same date', 
 ARRAY['Excavator E-001'], 'unresolved'),

('overlapping_events', 'low', 'Safety training conflicts with scheduled project meeting', 
 ARRAY['Training Room A'], 'acknowledged'),

('deadline_conflict', 'high', 'Material delivery scheduled after required start date', 
 ARRAY['Concrete Supplier'], 'unresolved');