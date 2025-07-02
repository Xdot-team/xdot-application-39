// Enhanced Employee and Workforce Management Types

export interface EmployeeProfile {
  id: string;
  employee_id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  hire_date: string;
  termination_date?: string;
  job_title: string;
  department: string;
  pay_rate: number;
  pay_type: string; // Database stores as string
  supervisor_id?: string;
  status: string; // Database stores as string
  profile_photo?: string;
  skills?: string[];
  certifications?: any; // JSONB
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeClockRecord {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  lunch_start?: string;
  lunch_end?: string;
  total_hours?: number;
  regular_hours?: number;
  overtime_hours?: number;
  project_id?: string;
  location?: any; // Database POINT type
  clock_in_photo?: string;
  clock_out_photo?: string;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  status: string; // Database stores as string
  created_at: string;
}

export interface EmployeeSchedule {
  id: string;
  employee_id: string;
  schedule_date: string;
  shift_start: string; // TIME format
  shift_end: string; // TIME format
  project_id?: string;
  location?: string;
  role_for_day?: string;
  notes?: string;
  status: string; // Database stores as string
  created_by: string;
  created_at: string;
}

export interface EmployeePerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string;
  review_period_start: string;
  review_period_end: string;
  overall_rating?: number; // 1-5
  goals_met?: number; // 1-5
  quality_of_work?: number; // 1-5
  teamwork?: number; // 1-5
  punctuality?: number; // 1-5
  safety_compliance?: number; // 1-5
  strengths?: string;
  areas_for_improvement?: string;
  goals_for_next_period?: string;
  employee_comments?: string;
  review_date: string;
  status: ReviewStatus;
  created_at: string;
}

export interface EmployeeTrainingRecord {
  id: string;
  employee_id: string;
  training_name: string;
  training_type: string; // Database stores as string
  training_provider?: string;
  start_date: string;
  completion_date?: string;
  expiry_date?: string;
  certification_number?: string;
  cost: number;
  status: string; // Database stores as string
  score?: number;
  instructor?: string;
  location?: string;
  attachments?: string[];
  notes?: string;
  created_at: string;
}

export interface EmployeePayrollRecord {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  regular_hours: number;
  overtime_hours: number;
  holiday_hours: number;
  sick_hours: number;
  vacation_hours: number;
  gross_pay: number;
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  other_deductions: number;
  net_pay: number;
  pay_date?: string;
  status: PayrollStatus;
  notes?: string;
  created_at: string;
}

// Analytics and Dashboard Types
export interface WorkforceMetrics {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  terminatedEmployees: number;
  averageHoursPerWeek: number;
  overtimePercentage: number;
  totalPayrollCost: number;
  trainingCompletionRate: number;
  performanceAverageRating: number;
  turnoverRate: number;
}

export interface EmployeeMetrics {
  employee: EmployeeProfile;
  hoursWorkedThisWeek: number;
  hoursWorkedThisMonth: number;
  overtimeHoursThisMonth: number;
  performanceRating?: number;
  trainingStatus: {
    completed: number;
    inProgress: number;
    overdue: number;
  };
  attendanceRate: number;
  productivityScore?: number;
}

export interface DepartmentMetrics {
  department: string;
  employeeCount: number;
  averageRating: number;
  totalPayrollCost: number;
  averageHoursPerWeek: number;
  trainingCompletionRate: number;
  turnoverRate: number;
}

// Scheduling Types
export interface ScheduleConflict {
  employee_id: string;
  conflict_type: 'overlap' | 'overtime' | 'unavailable';
  conflicting_schedules: EmployeeSchedule[];
  severity: 'low' | 'medium' | 'high';
}

export interface ShiftTemplate {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  break_duration: number; // minutes
  lunch_duration: number; // minutes
  is_default: boolean;
}

// Time Clock Types
export interface TimeClockSummary {
  employee_id: string;
  date: string;
  regular_hours: number;
  overtime_hours: number;
  break_time: number;
  lunch_time: number;
  total_hours: number;
  status: TimeRecordStatus;
}

// GPS and Location Types (reused from fleet)
export interface GpsCoordinate {
  lat: number;
  lng: number;
}

// Enums
export type PayType = 'hourly' | 'salary';

export type EmployeeStatus = 
  | 'active' 
  | 'inactive' 
  | 'terminated' 
  | 'on_leave';

export type TimeRecordStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected';

export type ScheduleStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'modified' 
  | 'cancelled';

export type ReviewStatus = 
  | 'draft' 
  | 'completed' 
  | 'acknowledged';

export type TrainingType = 
  | 'safety' 
  | 'skills' 
  | 'certification' 
  | 'orientation';

export type TrainingStatus = 
  | 'enrolled' 
  | 'in_progress' 
  | 'completed' 
  | 'failed' 
  | 'expired';

export type PayrollStatus = 
  | 'draft' 
  | 'processed' 
  | 'paid';

// Performance and Development Types
export interface EmployeeGoal {
  id: string;
  employee_id: string;
  title: string;
  description: string;
  target_date: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface SkillAssessment {
  id: string;
  employee_id: string;
  skill_name: string;
  current_level: number; // 1-5
  target_level: number; // 1-5
  assessment_date: string;
  assessor_id: string;
  notes?: string;
}

// Notification and Alert Types
export interface WorkforceAlert {
  id: string;
  type: 'training_due' | 'performance_review_due' | 'schedule_conflict' | 'time_clock_issue';
  employee_id?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  acknowledged: boolean;
}