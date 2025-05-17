
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
