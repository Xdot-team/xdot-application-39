export type EstimateStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type EstimateItemCategory = 'material' | 'labor' | 'equipment' | 'subcontractor' | 'overhead';
export type EstimateVersion = 'current' | 'previous' | 'baseline';
export type FormulaType = 'simple' | 'complex' | 'reference' | 'conditional';

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
  versions?: EstimateVersionInfo[];
  currentVersion?: string;
  templateId?: string;
  isTemplate?: boolean;
  collaborators?: string[];
  lastSyncedAt?: string;
}

export interface EstimateVersionInfo {
  id: string;
  estimateId: string;
  versionNumber: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
  totalCost: number;
  isBaseline?: boolean;
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
  formula?: string;
  hasError?: boolean;
  errorMessage?: string;
  parentId?: string;
  children?: EstimateItem[];
  vendorId?: string;
  vendorName?: string;
  costCode?: string;
  markupPercentage?: number;
  productionRate?: number;
  createdBy?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  isLocked?: boolean;
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

export interface EstimateTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  items: EstimateTemplateItem[];
  createdBy: string;
  createdAt: string;
  modifiedAt?: string;
  isPublic: boolean;
}

export interface EstimateTemplateItem {
  id: string;
  description: string;
  category: EstimateItemCategory;
  unit?: string;
  formula?: string;
  notes?: string;
  children?: EstimateTemplateItem[];
}

export interface MaterialCostDatabase {
  id: string;
  name: string;
  description?: string;
  materials: MaterialCost[];
  lastUpdated: string;
  region: string;
  source?: string;
}

export interface MaterialCost {
  id: string;
  name: string;
  description?: string;
  unit: string;
  cost: number;
  region?: string;
  supplier?: string;
  effectiveDate: string;
  expirationDate?: string;
  category?: string;
  notes?: string;
}

export interface EstimateCollaborator {
  userId: string;
  username: string;
  role: 'viewer' | 'editor' | 'approver' | 'owner';
  lastActive?: string;
  activeSection?: string;
}

export interface EstimateCell {
  rowId: string;
  columnId: string;
  value: string | number;
  formula?: string;
  isEditing?: boolean;
  isError?: boolean;
  errorMessage?: string;
  dataType?: 'text' | 'number' | 'formula' | 'currency' | 'percentage';
  validation?: CellValidation;
  comments?: CellComment[];
  style?: CellStyle;
}

export interface CellValidation {
  type: 'range' | 'list' | 'custom';
  params: any;
  message?: string;
}

export interface CellComment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
  resolved?: boolean;
}

export interface CellStyle {
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  border?: string;
  alignment?: string;
}

export interface EstimateImportSource {
  id: string;
  name: string;
  type: 'dot' | 'excel' | 'csv' | 'historical' | 'template';
  url?: string;
  apiKey?: string;
  lastSyncDate?: string;
  mappings?: {[key: string]: string};
}
