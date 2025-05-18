
export type EmployeeRole = 
  | 'project_manager'
  | 'foreman'
  | 'laborer'
  | 'operator'
  | 'carpenter'
  | 'electrician'
  | 'plumber'
  | 'welder'
  | 'mason'
  | 'superintendent'
  | 'safety_officer'
  | 'estimator'
  | 'accountant'
  | 'hr_specialist'
  | 'admin';

export type CertificationType =
  | 'CDL'
  | 'OSHA'
  | 'First Aid'
  | 'CPR'
  | 'Welding'
  | 'Electrical'
  | 'Plumbing'
  | 'Crane Operation'
  | 'Forklift'
  | 'Scaffold'
  | 'Confined Space'
  | 'Fall Protection'
  | 'Hazmat'
  | 'Project Management'
  | 'SHRM-CP'   // Added for HR certification
  | 'CPE'       // Added for estimator certification
  | 'CPA';      // Added for accountant certification

export type OnboardingStatus =
  | 'pending'
  | 'documents_submitted'
  | 'background_check'
  | 'training'
  | 'completed';

export type WorkforceStatus = 'active' | 'on_leave' | 'terminated' | 'retired';

export interface Certification {
  id: string;
  type: CertificationType;
  issuedDate: string;
  expiryDate: string;
  issuingAuthority: string;
  documentUrl?: string;
  verified: boolean;
}

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: string;
  hireDate: string;
  status: WorkforceStatus;
  payRate: number;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  certifications: Certification[];
  skills: string[];
  profileImage?: string;
  currentProject?: string;
  supervisorId?: string;
}

export interface Onboarding {
  id: string;
  employeeId: string;
  status: OnboardingStatus;
  startDate: string;
  completedDate?: string;
  documents: {
    id: string;
    name: string;
    status: 'pending' | 'submitted' | 'approved' | 'rejected';
    url?: string;
    submittedDate?: string;
    notes?: string;
  }[];
  trainingCompleted: {
    id: string;
    name: string;
    date: string;
    instructor?: string;
  }[];
  notes: string;
}

export interface TimeCard {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  projectId?: string;
  projectName?: string;
  hoursWorked: number;
  overtimeHours: number;
  tasks: {
    taskId: string;
    description: string;
    hours: number;
  }[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface LaborTracking {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  employeeId: string;
  employeeName: string;
  taskId: string;
  taskName: string;
  hoursWorked: number;
  unitsCompleted?: number;
  productivity?: number; // units per hour
  quality?: number; // 1-5 rating
  notes?: string;
}

export interface EmployeeAppreciation {
  id: string;
  employeeId: string;
  employeeName: string;
  message: string;
  givenBy: string;
  givenByName: string;
  date: string;
  type: 'performance' | 'safety' | 'innovation' | 'teamwork' | 'milestone';
  public: boolean;
  reactions?: {
    userId: string;
    reaction: 'like' | 'celebrate' | 'thank';
  }[];
}

export interface Subcontractor {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  specialties: string[];
  contractStart: string;
  contractEnd?: string;
  insuranceExpiry: string;
  rate: {
    amount: number;
    unit: 'hourly' | 'daily' | 'project';
  };
  currentProjects: {
    projectId: string;
    projectName: string;
    role: string;
  }[];
  documents: {
    id: string;
    name: string;
    url: string;
    uploadDate: string;
    expiryDate?: string;
  }[];
  performance: {
    rating: number; // 1-5
    completedProjects: number;
    notes?: string;
  };
}

// New type for Employee Health records
export type HealthStatus = 'fit_for_duty' | 'restricted_duty' | 'not_fit_for_duty' | 'pending_evaluation';
export type HealthRecordType = 'routine_check' | 'injury_assessment' | 'return_to_work' | 'wellness_program';

export interface EmployeeHealth {
  id: string;
  employeeId: string;
  employeeName: string;
  recordDate: string;
  recordType: HealthRecordType;
  healthStatus: HealthStatus;
  medicalNotes: string;
  restrictions?: string;
  followUpDate?: string;
  clearanceDate?: string;
  recordedBy: string;
  confidential: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
    uploadDate: string;
  }[];
  wellnessPrograms?: {
    programId: string;
    programName: string;
    startDate: string;
    endDate?: string;
    status: 'active' | 'completed' | 'withdrawn';
    notes?: string;
  }[];
}
