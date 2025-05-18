
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
export type RiskStatus = 'identified' | 'analyzing' | 'mitigating' | 'monitored' | 'closed';
export type RiskCategory = 
  | 'safety' 
  | 'schedule' 
  | 'budget' 
  | 'resource' 
  | 'equipment' 
  | 'environmental' 
  | 'regulatory'
  | 'other';
  
export type RiskSource = 
  | 'ai-prediction' 
  | 'manual-entry' 
  | 'incident-escalation'
  | 'compliance-issue';

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
  relatedDocuments?: string[];
  lastUpdated: string;
  assignedTo?: string;
  isHighPriority?: boolean;
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
