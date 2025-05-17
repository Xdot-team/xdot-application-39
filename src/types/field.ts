
export interface SiteVisit {
  id: string;
  date: string;
  project: string;
  inspector: string;
  notes: string;
  status: 'completed' | 'pending' | 'needs-review';
  photos?: string[];
  location?: {
    lat: number;
    lng: number;
  };
  followUpRequired?: boolean;
  actionsTaken?: string;
}

export interface PunchlistItem {
  id: string;
  project: string;
  location: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'closed';
  photos?: string[];
  severity: 'minor' | 'major' | 'critical';
  resolutionNotes?: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface WorkOrder {
  id: string;
  project: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  relatedDocuments?: string[];
  location?: {
    lat: number;
    lng: number;
  };
  estimatedHours?: number;
  actualHours?: number;
}

export interface UtilityAdjustment {
  id: string;
  project: string;
  utility: 'water' | 'gas' | 'electric' | 'telecom' | 'sewer';
  location: string;
  scheduledDate: string;
  contactName: string;
  contactPhone: string;
  notes: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  actualDate?: string;
  relatedDocuments?: string[];
}

export interface FieldWorker {
  id: string;
  name: string;
  role: string;
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  currentProject?: string;
  status: 'active' | 'inactive' | 'on-break';
  specialty?: string;
  certifications?: string[];
  contactInfo?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  currentProject?: string;
  status: 'in-use' | 'available' | 'maintenance' | 'offline';
  model?: string;
  serialNumber?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export interface Dispatch {
  id: string;
  projectId: string;
  workOrderId?: string;
  assignedToId: string;
  assignedToName: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  location: {
    lat: number;
    lng: number;
    description?: string;
  };
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
