
export interface SiteVisit {
  id: string;
  date: string;
  project: string;
  inspector: string;
  notes: string;
  status: 'completed' | 'pending' | 'needs-review';
  photos?: string[];
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
}
