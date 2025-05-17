
export interface KPI {
  id: string;
  name: string;
  category: 'financial' | 'productivity' | 'safety' | 'quality' | 'customer_satisfaction';
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastUpdated: string;
  description?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'financial' | 'labor' | 'safety' | 'custom';
  createdBy: string;
  createdAt: string;
  lastGenerated: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on_demand';
  parameters?: Record<string, any>;
  recipients?: string[];
  fileUrl?: string;
  isAutomated: boolean;
}

export interface EOSGoal {
  id: string;
  name: string;
  description: string;
  category: 'revenue' | 'profit' | 'projects' | 'expansion' | 'safety' | 'other';
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
  milestones: {
    id: string;
    name: string;
    dueDate: string;
    completed: boolean;
  }[];
  owner: string;
  status: 'not_started' | 'in_progress' | 'at_risk' | 'completed';
}

export interface Projection {
  id: string;
  name: string;
  category: 'revenue' | 'expenses' | 'profit' | 'projects';
  period: 'monthly' | 'quarterly' | 'yearly';
  data: {
    date: string;
    projected: number;
    actual?: number;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CostBreakdown {
  id: string;
  projectId?: string;
  projectName?: string;
  category: 'labor' | 'materials' | 'equipment' | 'subcontractors' | 'overhead' | 'other';
  amount: number;
  percentage: number;
  period: 'monthly' | 'quarterly' | 'yearly' | 'project';
  date: string;
}

export interface RevenueTarget {
  id: string;
  year: number;
  total: number;
  achieved: number;
  quarterly: {
    q1: { target: number; achieved: number };
    q2: { target: number; achieved: number };
    q3: { target: number; achieved: number };
    q4: { target: number; achieved: number };
  };
  byCategory: {
    category: 'highway' | 'bridge' | 'utility' | 'commercial' | 'residential' | 'other';
    target: number;
    achieved: number;
  }[];
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'table' | 'progress' | 'status' | 'custom';
  size: 'small' | 'medium' | 'large';
  dataSource: string;
  refreshInterval?: number; // in minutes
  position: { x: number; y: number };
  config: Record<string, any>;
}

export interface XDOTPluginData {
  id: string;
  name: string;
  category: 'labor_efficiency' | 'equipment_utilization' | 'project_compliance' | 'material_usage';
  metrics: {
    id: string;
    name: string;
    value: number;
    target?: number;
    unit: string;
  }[];
  lastSyncDate: string;
  status: 'active' | 'inactive' | 'error';
}
