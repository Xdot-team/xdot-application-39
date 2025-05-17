
export type EstimateStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

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
}

export interface EstimateItem {
  id: string;
  estimateId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  category: 'material' | 'labor' | 'equipment' | 'subcontractor' | 'other';
}

export interface VendorBid {
  id: string;
  estimateId: string;
  vendorId: string;
  vendorName: string;
  bidAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  submissionDate: string;
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
