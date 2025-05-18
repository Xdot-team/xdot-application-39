
export type IncidentSeverity = 'low' | 'medium' | 'high';

export type IncidentStatus = 'reported' | 'investigating' | 'resolved' | 'closed';

export type HazardType = 
  | 'fall' 
  | 'electrical' 
  | 'chemical' 
  | 'fire' 
  | 'structural' 
  | 'equipment' 
  | 'environmental'
  | 'other';

export interface SafetyIncident {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  projectId?: string;
  projectName?: string;
  reportedBy: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedTo?: string;
  photos?: string[];
  witnesses?: string[];
  actions?: {
    id: string;
    description: string;
    assignedTo?: string;
    dueDate?: string;
    completedDate?: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  relatedDocuments?: string[];
  followUpDate?: string;
  resolutionNotes?: string;
  oshaReportable: boolean;
}

export interface Hazard {
  id: string;
  type: HazardType;
  description: string;
  location: string;
  projectId?: string;
  projectName?: string;
  reportedBy: string;
  reportedDate: string;
  severity: IncidentSeverity;
  status: 'active' | 'mitigated' | 'resolved';
  photos?: string[];
  mitigationSteps?: string;
  mitigatedBy?: string;
  mitigatedDate?: string;
}

export interface SafetyTraining {
  id: string;
  title: string;
  description: string;
  requiredFor: string[];
  frequency: 'once' | 'monthly' | 'quarterly' | 'annually' | 'biannually';
  duration: number; // in minutes
  materials?: string[];
  certificationProduced?: boolean;
}

export interface SafetyCompliance {
  id: string;
  standard: string;
  description: string;
  applicableTo: string[];
  checklistItems: {
    id: string;
    description: string;
    required: boolean;
    status: 'compliant' | 'non-compliant' | 'not-applicable';
    lastChecked?: string;
    notes?: string;
  }[];
  nextReviewDate: string;
  lastReviewDate?: string;
  reviewedBy?: string;
  documentationRequired?: string[];
}

// New Risk Management Types
export type RiskProbability = 'low' | 'medium' | 'high' | 'very-high';
export type RiskImpact = 'minimal' | 'moderate' | 'significant' | 'severe';
export type RiskStatus = 'identified' | 'analyzing' | 'mitigating' | 'monitored' | 'monitoring' | 'closed';
export type RiskCategory = 
  | 'safety' 
  | 'schedule' 
  | 'budget' 
  | 'resource' 
  | 'equipment' 
  | 'environmental' 
  | 'regulatory'
  | 'driver'
  | 'other';
  
export type RiskSource = 
  | 'ai-prediction' 
  | 'manual-entry' 
  | 'incident-escalation'
  | 'compliance-issue'
  | 'driver-data'
  | 'jsa-analysis';

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: RiskProbability;
  impact: RiskImpact;
  riskScore: number; // Calculated from probability & impact
  status: RiskStatus;
  dateIdentified: string;
  projectId?: string;
  projectName?: string;
  identifiedBy: string;
  source: RiskSource;
  predictedTriggers?: string[];
  affectedAreas?: string[];
  mitigation?: RiskMitigation;
  relatedIncidents?: string[];
  relatedDriverData?: string[];
  relatedJsaData?: string[];
  relatedDocuments?: string[];
  lastUpdated: string;
  assignedTo?: string;
  isHighPriority?: boolean;
  aiConfidence?: number; // Added for AI confidence score
}

export interface RiskMitigation {
  id: string;
  riskId: string;
  strategy: 'avoid' | 'transfer' | 'mitigate' | 'accept';
  description: string;
  actions: RiskAction[];
  estimatedCost?: number;
  responsible?: string;
  status: 'draft' | 'active' | 'completed';
}

export interface RiskAction {
  id: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
}

export interface RiskAlert {
  id: string;
  riskId: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  requiresAcknowledgement: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

// Job Safety Analysis Types
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface JobSafetyAnalysisItem {
  id: string;
  jsaId: string;
  taskStep: string;
  potentialHazards: string[];
  controlMeasures: string[];
  responsible?: string;
  status: TaskStatus;
  photos?: string[];
}

export interface JobSafetyAnalysisData {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  location: string;
  taskDescription: string;
  createdBy: string;
  createdDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  requiredPPE: string[];
  requiredEquipment: string[];
  items: JobSafetyAnalysisItem[];
  templateId?: string;
  isTemplate: boolean;
  lastUpdated: string;
  comments?: string;
}

// Toolbox Meeting Types
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'pending';

export interface MeetingAttendee {
  id: string;
  meetingId: string;
  employeeId: string;
  employeeName: string;
  role?: string;
  status: AttendanceStatus;
  signatureTimestamp?: string;
  feedback?: string;
}

export interface ToolboxMeetingData {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  conductor: string;
  topics: string[];
  safetyFocus: string;
  status: MeetingStatus;
  attendees: MeetingAttendee[];
  notes?: string;
  attachments?: string[];
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  weatherConditions?: string;
  questionsAsked?: string[];
  followUpActions?: {
    id: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
}

export interface JSATemplate {
  id: string;
  title: string;
  category: string;
  taskDescription: string;
  items: {
    taskStep: string;
    potentialHazards: string[];
    controlMeasures: string[];
  }[];
  requiredPPE: string[];
  requiredEquipment: string[];
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
}

export interface ToolboxMeetingTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  topics: string[];
  safetyFocus: string;
  suggestedDuration: number; // in minutes
  materials: string[];
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
}

// New Driver Trends Types
export type VehicleType = 'truck' | 'car' | 'van' | 'heavy_equipment' | 'specialized';
export type ComplianceStatus = 'compliant' | 'minor_issues' | 'major_issues' | 'non_compliant';
export type IncidentType = 'near_miss' | 'collision' | 'damage' | 'injury' | 'violation';
export type TrendDirection = 'improving' | 'stable' | 'worsening';

export interface DriverData {
  id: string;
  driverId: string;
  driverName: string;
  employeeId: string;
  licenseNumber: string;
  licenseClass: string;
  licenseExpiry: string;
  endorsements: string[];
  restrictions: string[];
  trainingCompleted: {
    id: string;
    name: string;
    completionDate: string;
    expiryDate?: string;
  }[];
  complianceStatus: ComplianceStatus;
  complianceNotes?: string;
  lastReviewDate: string;
  reviewedBy?: string;
}

export interface VehicleData {
  id: string;
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  licensePlate: string;
  vin: string;
  department: string;
  assignedTo?: string;
  status: 'active' | 'maintenance' | 'repair' | 'out_of_service';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  mileage: number;
  fuelType: string;
}

export interface TripData {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  date: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  mileage: number;
  purpose: string;
  projectId?: string;
  projectName?: string;
  incidents?: IncidentData[];
  notes?: string;
}

export interface IncidentData {
  id: string;
  tripId: string;
  driverId: string;
  vehicleId: string;
  timestamp: string;
  type: IncidentType;
  description: string;
  location: string;
  severity: IncidentSeverity;
  reportedBy: string;
  reportedDate: string;
  status: IncidentStatus;
  relatedSafetyIncidentId?: string;
  photos?: string[];
  witnesses?: string[];
  followUpRequired: boolean;
  followUpNotes?: string;
}

export interface DriverTrendData {
  id: string;
  driverId: string;
  driverName: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  mileageDriven: number;
  fuelUsed: number;
  fuelEfficiency: number;
  incidentCount: number;
  incidentRate: number; // incidents per X miles
  harshBrakingEvents: number;
  harshAccelerationEvents: number;
  speedingEvents: number;
  idlingTime: number; // minutes
  distractionEvents: number;
  fatigueWarnings: number;
  safetyScore: number; // 0-100
  trendDirection: TrendDirection;
  riskLevel: 'low' | 'medium' | 'high';
  improvementSuggestions?: string[];
  lastUpdated: string;
}
