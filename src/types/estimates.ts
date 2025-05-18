
export type EstimateStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type EstimateItemCategory = 'material' | 'labor' | 'equipment' | 'subcontractor' | 'overhead';

export interface Estimate {
  id: string;
  projectId: string;
  projectName: string;
  client: string;
  dateCreated: string;
  dateModified: string;
  status: EstimateStatus;
  totalCost: number;
  createdBy: string;
  notes?: string;
  items?: EstimateItem[];
  vendorBids?: VendorBid[];
  costBreakdown?: CostBreakdown;
  quickEstimateParams?: QuickEstimateParams;
  bidDocuments?: BidDocument[];
  buyoutPackages?: BuyoutPackage[];
}

export interface EstimateItem {
  id: string;
  estimateId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  category: EstimateItemCategory;
  notes?: string;
  takeoffReference?: string;
}

export interface VendorBid {
  id: string;
  estimateId: string;
  vendorId: string;
  vendorName: string;
  bidAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  submissionDate: string;
  expirationDate?: string;
  items?: VendorBidItem[];
  notes?: string;
  contactInfo?: string;
  files?: string[];
  communicationLogs?: CommunicationLog[];
}

export interface VendorBidItem {
  id: string;
  bidId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CommunicationLog {
  id: string;
  date: string;
  contactName: string;
  method: 'email' | 'phone' | 'meeting' | 'other';
  summary: string;
  notes?: string;
}

export interface CostBreakdown {
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
  subcontractorCost: number;
  otherCost: number;
  overhead: number;
  profit: number;
}

export interface QuickEstimateParams {
  id: string;
  estimateId: string;
  projectType: string;
  parameters: {
    [key: string]: {
      name: string;
      value: number;
      unit: string;
    }
  };
  calculatedTotal: number;
}

export interface TakeoffMeasurement {
  id: string;
  estimateId: string;
  drawingId: string;
  drawingName: string;
  type: 'length' | 'area' | 'count' | 'volume';
  value: number;
  unit: string;
  notes?: string;
  coordinates?: string; // JSON string of coordinates
  linkedItemId?: string;
}

export interface PreliminaryVendor {
  id: string;
  estimateId: string;
  vendorId: string;
  vendorName: string;
  category: EstimateItemCategory;
  notes?: string;
  contactInfo?: string;
}

// New interfaces for Bid Documents
export interface BidDocument {
  id: string;
  estimateId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  fileSize: number;
  fileUrl: string;
  extractedData?: {
    [key: string]: any;
  };
  tags?: string[];
  notes?: string;
}

// New interfaces for Buyout
export interface BuyoutPackage {
  id: string;
  estimateId: string;
  packageName: string;
  description?: string;
  scope: string;
  status: 'pending' | 'approved' | 'rejected' | 'awarded';
  vendor?: {
    id: string;
    name: string;
    contact: string;
  };
  amount: number;
  originalEstimate: number;
  variance: number;
  dueDate: string;
  awardDate?: string;
  notes?: string;
}

