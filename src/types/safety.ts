
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
