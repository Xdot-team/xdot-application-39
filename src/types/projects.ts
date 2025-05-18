
export type ProjectStatus = 'active' | 'completed' | 'upcoming';

export interface Project {
  id: string;
  name: string;
  projectId: string;
  description: string;
  status: ProjectStatus;
  location: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  clientName: string;
  projectManager: string;
  completedTasks: number;
  totalTasks: number;
  rfiCount: number;
  delayDays: number;
}

export interface RFI {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pending' | 'answered' | 'closed';
  createdBy: string;
  createdAt: string;
  respondedBy?: string;
  respondedAt?: string;
  response?: string;
  attachments?: string[];
}

export interface Submittal {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_required';
  createdBy: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  attachments?: string[];
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  requestDate: string;
  approvalDate?: string;
  reason: string;
  impactDays: number;
}

// New type definitions for AIA Billing
export interface AIABilling {
  id: string;
  projectId: string;
  formType: 'G702' | 'G703';
  applicationNumber: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  submissionDate: string;
  approvalDate?: string;
  approvedBy?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  originalContractSum: number;
  changeOrdersSum: number;
  contractSumToDate: number;
  totalCompletedStored: number;
  retainagePercentage: number;
  retainageAmount: number;
  totalEarnedLessRetainage: number;
  previousCertificates: number;
  currentPaymentDue: number;
  balanceToFinish: number;
  lineItems: AIABillingLineItem[];
  notes?: string;
  attachments?: string[];
}

export interface AIABillingLineItem {
  id: string;
  aiaBillingId: string;
  description: string;
  scheduledValue: number;
  workCompletedPrevious: number;
  workCompletedCurrent: number;
  materialsPresently: number;
  totalCompletedStored: number;
  percentComplete: number;
  balanceToFinish: number;
  retainage: number;
}

// Expanded Change Order type
export interface ExpandedChangeOrder {
  id: string;
  projectId: string;
  changeOrderNumber: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected';
  costImpact: number;
  timeImpact: number; // in days
  requestDate: string;
  submittedDate?: string;
  submittedBy?: string;
  approvalDate?: string;
  approvedBy?: string;
  rejectionDate?: string;
  rejectedBy?: string;
  reason: string;
  justification?: string;
  attachments?: string[];
  lineItems: ChangeOrderLineItem[];
  auditTrail: ChangeOrderAudit[];
}

export interface ChangeOrderLineItem {
  id: string;
  changeOrderId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  costCode?: string;
}

export interface ChangeOrderAudit {
  id: string;
  changeOrderId: string;
  actionType: 'created' | 'updated' | 'submitted' | 'approved' | 'rejected' | 'comment';
  actionBy: string;
  actionDate: string;
  details?: string;
}
