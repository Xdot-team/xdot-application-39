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

// New type definitions for Project Notes
export interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  tags: string[];
  attachments?: string[];
}

// New type definitions for Scope of Work in Progress
export interface ScopeWIP {
  id: string;
  projectId: string;
  taskId: string;
  scopeDescription: string;
  progressPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  assignedTo: string[];
  notes?: string;
  lastUpdated: string;
}

// Existing type definitions for AIA Billing
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

// New type definitions for Progress Schedule
export interface ProgressScheduleData {
  id: string;
  projectId: string;
  date: string;
  plannedProgress: number; // percentage
  actualProgress: number; // percentage
  plannedCost: number;
  actualCost: number;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  otherCost: number;
}

// New type definitions for Cost to Completion
export interface CostToCompletion {
  id: string;
  projectId: string;
  estimatedDate: string;
  remainingTasks: number;
  completedValue: number;
  remainingValue: number;
  originalBudget: number;
  revisedBudget: number;
  actualCostToDate: number;
  estimatedCostToComplete: number;
  forecastTotalCost: number;
  costVariance: number;
  laborRemaining: number;
  materialsRemaining: number;
  equipmentRemaining: number;
  subcontractorRemaining: number;
  otherRemaining: number;
  riskFactors?: string[];
  notes?: string;
  lastUpdated: string;
  updatedBy: string;
}
