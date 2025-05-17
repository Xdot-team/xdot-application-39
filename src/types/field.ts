
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

// New interfaces for Assets module
export interface Vehicle {
  id: string;
  name: string;
  type: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: 'in-use' | 'available' | 'maintenance' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  currentProject?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  maintenanceHistory?: MaintenanceRecord[];
  assignedTo?: string;
  notes?: string;
  fuelLevel?: number;
  mileage?: number;
  purchaseDate?: string;
  purchaseCost?: number;
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  brand: string;
  model?: string;
  serialNumber?: string;
  status: 'in-use' | 'available' | 'maintenance' | 'offline';
  currentLocation?: string;
  assignedTo?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  maintenanceHistory?: MaintenanceRecord[];
  checkoutHistory?: CheckoutRecord[];
  purchaseDate?: string;
  purchaseCost?: number;
  notes?: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string; // Yard or Warehouse location
  minimumStock?: number;
  supplier?: string;
  cost?: number;
  lastOrderDate?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetType: 'vehicle' | 'tool';
  date: string;
  description: string;
  performedBy: string;
  cost: number;
  notes?: string;
  parts?: string[];
}

export interface CheckoutRecord {
  id: string;
  assetId: string;
  assetType: 'vehicle' | 'tool' | 'material';
  checkedOutBy: string;
  checkedOutDate: string;
  returnDate?: string;
  returnedBy?: string;
  projectId: string;
  notes?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
}
