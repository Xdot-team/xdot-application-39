
export interface ReportMetric {
  id: string;
  name: string;
  category: 'financial' | 'project' | 'labor' | 'equipment' | 'safety' | 'custom';
  dataSource: string;
  description: string;
  unit?: string;
}

export interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range';
  value: any;
}

export interface ReportVisualization {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'table' | 'kpi';
  title: string;
  metrics: string[];
  config: Record<string, any>;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'project' | 'labor' | 'equipment' | 'safety' | 'custom';
  createdBy: string;
  createdAt: string;
  lastGenerated?: string;
  isAutomated?: boolean;
  frequency?: string;
}

export interface CustomReport extends Report {
  metrics: ReportMetric[];
  filters: ReportFilter[];
  visualizations: ReportVisualization[];
  parameters?: Record<string, any>;
  recipients?: string[];
  fileUrl?: string;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
    recipients: string[];
  };
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'financial' | 'labor' | 'equipment' | 'safety' | 'custom';
  metrics: ReportMetric[];
  defaultFilters: ReportFilter[];
  defaultVisualizations: ReportVisualization[];
  createdBy: string;
  createdAt: string;
}

export interface ScheduledReport {
  id: string;
  reportId: string;
  reportName: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  lastSent?: string;
  nextScheduled: string;
  status: 'active' | 'paused';
}
