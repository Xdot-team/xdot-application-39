
import { CustomReport, ReportTemplate, ScheduledReport } from '@/types/reports';

export const mockReports: CustomReport[] = [
  {
    id: '1',
    title: 'Q2 2025 Georgia Highway Projects Progress',
    description: 'Quarterly progress report for all active highway projects in Georgia',
    type: 'project',
    createdBy: 'John Smith',
    createdAt: '2025-04-01T09:00:00Z',
    lastGenerated: '2025-04-01T10:30:00Z',
    frequency: 'quarterly',
    parameters: {
      region: 'Georgia',
      projectType: 'Highway'
    },
    recipients: ['managers@xdot.example', 'executives@xdot.example'],
    fileUrl: '/reports/q2-2025-georgia-highway-progress.pdf',
    isAutomated: true,
    metrics: [
      {
        id: 'm1',
        name: 'Completion Percentage',
        category: 'project',
        dataSource: 'project_progress',
        description: 'Percentage of project completion against timeline'
      },
      {
        id: 'm2',
        name: 'Budget Utilization',
        category: 'financial',
        dataSource: 'project_financials',
        description: 'Percentage of budget utilized',
        unit: '%'
      },
      {
        id: 'm3',
        name: 'Schedule Variance',
        category: 'project',
        dataSource: 'project_schedule',
        description: 'Difference between planned and actual progress',
        unit: 'days'
      }
    ],
    filters: [
      {
        id: 'f1',
        field: 'region',
        operator: 'equals',
        value: 'Georgia'
      },
      {
        id: 'f2',
        field: 'projectType',
        operator: 'equals',
        value: 'Highway'
      }
    ],
    visualizations: [
      {
        id: 'v1',
        type: 'bar',
        title: 'Project Completion by Site',
        metrics: ['m1'],
        config: {
          xAxis: 'project_name',
          stacked: false
        }
      },
      {
        id: 'v2',
        type: 'pie',
        title: 'Budget Allocation',
        metrics: ['m2'],
        config: {
          showLegend: true,
          showTotal: true
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Monthly Labor Hours - GA-400 Expansion',
    description: 'Monthly report of labor hours for the GA-400 Expansion project',
    type: 'labor',
    createdBy: 'Alice Johnson',
    createdAt: '2025-04-10T08:00:00Z',
    lastGenerated: '2025-05-01T07:00:00Z',
    frequency: 'monthly',
    parameters: {
      projectId: 'GA-400-EXP',
      month: 'April 2025'
    },
    recipients: ['project-managers@xdot.example', 'hr@xdot.example'],
    fileUrl: '/reports/ga400-labor-april-2025.pdf',
    isAutomated: true,
    metrics: [
      {
        id: 'm4',
        name: 'Total Labor Hours',
        category: 'labor',
        dataSource: 'workforce_timecards',
        description: 'Total hours worked on the project',
        unit: 'hours'
      },
      {
        id: 'm5',
        name: 'Overtime Hours',
        category: 'labor',
        dataSource: 'workforce_timecards',
        description: 'Hours worked beyond standard time',
        unit: 'hours'
      }
    ],
    filters: [
      {
        id: 'f3',
        field: 'projectId',
        operator: 'equals',
        value: 'GA-400-EXP'
      },
      {
        id: 'f4',
        field: 'date',
        operator: 'in_range',
        value: {start: '2025-04-01', end: '2025-04-30'}
      }
    ],
    visualizations: [
      {
        id: 'v3',
        type: 'line',
        title: 'Labor Hours Trend',
        metrics: ['m4', 'm5'],
        config: {
          xAxis: 'date',
          showMarkers: true
        }
      }
    ]
  },
  {
    id: '3',
    title: 'Safety Incident Summary - Q1 2025',
    description: 'Summary of safety incidents across all Georgia projects in Q1 2025',
    type: 'safety',
    createdBy: 'Robert Davis',
    createdAt: '2025-01-05T11:30:00Z',
    lastGenerated: '2025-04-05T14:15:00Z',
    frequency: 'quarterly',
    parameters: {
      region: 'Georgia',
      period: 'Q1 2025'
    },
    recipients: ['safety-team@xdot.example', 'management@xdot.example'],
    fileUrl: '/reports/safety-q1-2025.pdf',
    isAutomated: false,
    metrics: [
      {
        id: 'm6',
        name: 'Incident Count',
        category: 'safety',
        dataSource: 'safety_incidents',
        description: 'Number of safety incidents reported'
      },
      {
        id: 'm7',
        name: 'Average Severity',
        category: 'safety',
        dataSource: 'safety_incidents',
        description: 'Average severity score of incidents',
        unit: 'score'
      }
    ],
    filters: [
      {
        id: 'f5',
        field: 'date',
        operator: 'in_range',
        value: {start: '2025-01-01', end: '2025-03-31'}
      }
    ],
    visualizations: [
      {
        id: 'v4',
        type: 'bar',
        title: 'Incidents by Project',
        metrics: ['m6'],
        config: {
          xAxis: 'project_name',
          stacked: true
        }
      },
      {
        id: 'v5',
        type: 'table',
        title: 'Incident Details',
        metrics: ['m6', 'm7'],
        config: {
          sortable: true,
          filterable: true
        }
      }
    ]
  },
  {
    id: '4',
    title: 'Equipment Utilization - I-85 Interchange',
    description: 'Monthly equipment usage and maintenance for I-85 Interchange project',
    type: 'equipment',
    createdBy: 'Mike Thomas',
    createdAt: '2025-03-15T10:00:00Z',
    lastGenerated: '2025-05-02T08:45:00Z',
    frequency: 'monthly',
    parameters: {
      projectId: 'I85-INT-21',
      month: 'April 2025'
    },
    recipients: ['fleet-manager@xdot.example', 'project-leads@xdot.example'],
    fileUrl: '/reports/i85-equipment-apr-2025.pdf',
    isAutomated: true,
    metrics: [
      {
        id: 'm8',
        name: 'Utilization Rate',
        category: 'equipment',
        dataSource: 'assets_tracking',
        description: 'Percentage of time equipment was in active use',
        unit: '%'
      },
      {
        id: 'm9',
        name: 'Maintenance Costs',
        category: 'financial',
        dataSource: 'assets_maintenance',
        description: 'Total cost of equipment maintenance',
        unit: 'USD'
      }
    ],
    filters: [
      {
        id: 'f6',
        field: 'projectId',
        operator: 'equals',
        value: 'I85-INT-21'
      },
      {
        id: 'f7',
        field: 'date',
        operator: 'in_range',
        value: {start: '2025-04-01', end: '2025-04-30'}
      }
    ],
    visualizations: [
      {
        id: 'v6',
        type: 'pie',
        title: 'Equipment Usage Distribution',
        metrics: ['m8'],
        config: {
          showLegend: true,
          showTotal: false
        }
      },
      {
        id: 'v7',
        type: 'bar',
        title: 'Maintenance Costs by Equipment Type',
        metrics: ['m9'],
        config: {
          xAxis: 'equipment_type',
          stacked: false
        }
      }
    ]
  },
  {
    id: '5',
    title: 'Financial Performance - US-29 Highway Project',
    description: 'Detailed financial analysis of the US-29 Highway reconstruction project',
    type: 'financial',
    createdBy: 'Sarah Williams',
    createdAt: '2025-02-20T14:00:00Z',
    lastGenerated: '2025-05-05T09:30:00Z',
    frequency: 'monthly',
    parameters: {
      projectId: 'US29-HWY',
      month: 'April 2025'
    },
    recipients: ['finance@xdot.example', 'executives@xdot.example'],
    fileUrl: '/reports/us29-financial-apr-2025.pdf',
    isAutomated: true,
    metrics: [
      {
        id: 'm10',
        name: 'Actual vs Budget',
        category: 'financial',
        dataSource: 'project_financials',
        description: 'Comparison of actual spending against budgeted amounts',
        unit: 'USD'
      },
      {
        id: 'm11',
        name: 'Cost Variance',
        category: 'financial',
        dataSource: 'project_financials',
        description: 'Variance between planned and actual costs',
        unit: '%'
      }
    ],
    filters: [
      {
        id: 'f8',
        field: 'projectId',
        operator: 'equals',
        value: 'US29-HWY'
      },
      {
        id: 'f9',
        field: 'date',
        operator: 'in_range',
        value: {start: '2025-04-01', end: '2025-04-30'}
      }
    ],
    visualizations: [
      {
        id: 'v8',
        type: 'bar',
        title: 'Actual vs Budgeted Costs',
        metrics: ['m10'],
        config: {
          xAxis: 'category',
          stacked: false
        }
      },
      {
        id: 'v9',
        type: 'line',
        title: 'Cost Variance Trend',
        metrics: ['m11'],
        config: {
          xAxis: 'date',
          showMarkers: true
        }
      }
    ]
  },
  {
    id: '6',
    title: 'Georgia Bridge Projects ROI Analysis',
    description: 'Custom analysis of return on investment for bridge renovation projects',
    type: 'custom',
    createdBy: 'David Wilson',
    createdAt: '2025-03-05T11:15:00Z',
    lastGenerated: '2025-04-20T15:45:00Z',
    frequency: 'quarterly',
    parameters: {
      region: 'Georgia',
      projectType: 'Bridge',
      analysisType: 'ROI'
    },
    recipients: ['executives@xdot.example', 'investors@xdot.example'],
    fileUrl: '/reports/georgia-bridges-roi-q1-2025.pdf',
    isAutomated: false,
    metrics: [
      {
        id: 'm12',
        name: 'Project ROI',
        category: 'financial',
        dataSource: 'financial_analysis',
        description: 'Return on investment percentage',
        unit: '%'
      },
      {
        id: 'm13',
        name: 'Maintenance Cost Reduction',
        category: 'financial',
        dataSource: 'maintenance_forecasts',
        description: 'Projected reduction in maintenance costs',
        unit: 'USD'
      },
      {
        id: 'm14',
        name: 'Public Benefit Score',
        category: 'project',
        dataSource: 'benefit_analysis',
        description: 'Calculated public benefit score based on various factors',
        unit: 'score'
      }
    ],
    filters: [
      {
        id: 'f10',
        field: 'region',
        operator: 'equals',
        value: 'Georgia'
      },
      {
        id: 'f11',
        field: 'projectType',
        operator: 'equals',
        value: 'Bridge'
      },
      {
        id: 'f12',
        field: 'completionDate',
        operator: 'greater_than',
        value: '2024-01-01'
      }
    ],
    visualizations: [
      {
        id: 'v10',
        type: 'bar',
        title: 'ROI by Project',
        metrics: ['m12'],
        config: {
          xAxis: 'project_name',
          stacked: false
        }
      },
      {
        id: 'v11',
        type: 'line',
        title: 'Cost Reduction Over Time',
        metrics: ['m13'],
        config: {
          xAxis: 'year',
          showMarkers: false
        }
      },
      {
        id: 'v12',
        type: 'pie',
        title: 'Public Benefit Distribution',
        metrics: ['m14'],
        config: {
          showLegend: true,
          showTotal: true
        }
      }
    ]
  },
  {
    id: '7',
    title: 'Environmental Impact - GA-400 Expansion',
    description: 'Custom analysis of environmental impact metrics for the GA-400 Expansion project',
    type: 'custom',
    createdBy: 'Emily Chen',
    createdAt: '2025-02-15T09:30:00Z',
    lastGenerated: '2025-04-15T13:20:00Z',
    frequency: 'quarterly',
    parameters: {
      projectId: 'GA-400-EXP',
      quarter: 'Q1 2025'
    },
    recipients: ['environmental-team@xdot.example', 'management@xdot.example', 'regulators@state.gov'],
    fileUrl: '/reports/ga400-environmental-q1-2025.pdf',
    isAutomated: true,
    metrics: [
      {
        id: 'm15',
        name: 'Carbon Footprint',
        category: 'project',
        dataSource: 'environmental_tracking',
        description: 'Estimated carbon emissions from project activities',
        unit: 'tons CO2'
      },
      {
        id: 'm16',
        name: 'Water Usage',
        category: 'project',
        dataSource: 'resource_consumption',
        description: 'Total water consumption on project site',
        unit: 'gallons'
      },
      {
        id: 'm17',
        name: 'Habitat Preservation Score',
        category: 'project',
        dataSource: 'environmental_assessment',
        description: 'Score reflecting effectiveness of habitat preservation measures',
        unit: 'score'
      }
    ],
    filters: [
      {
        id: 'f13',
        field: 'projectId',
        operator: 'equals',
        value: 'GA-400-EXP'
      },
      {
        id: 'f14',
        field: 'date',
        operator: 'in_range',
        value: {start: '2025-01-01', end: '2025-03-31'}
      },
      {
        id: 'f15',
        field: 'measurementType',
        operator: 'in_range',
        value: ['air', 'water', 'habitat']
      }
    ],
    visualizations: [
      {
        id: 'v13',
        type: 'line',
        title: 'Carbon Emissions Trend',
        metrics: ['m15'],
        config: {
          xAxis: 'date',
          showMarkers: true
        }
      },
      {
        id: 'v14',
        type: 'bar',
        title: 'Resource Consumption by Type',
        metrics: ['m16'],
        config: {
          xAxis: 'resource_type',
          stacked: true
        }
      },
      {
        id: 'v15',
        type: 'table',
        title: 'Habitat Assessment Results',
        metrics: ['m17'],
        config: {
          sortable: true,
          filterable: true
        }
      }
    ]
  }
];

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: 't1',
    name: 'Monthly Project Progress',
    description: 'Standard template for monthly project progress reporting',
    type: 'project',
    metrics: [
      {
        id: 'tm1',
        name: 'Completion Percentage',
        category: 'project',
        dataSource: 'project_progress',
        description: 'Percentage of project completion against timeline'
      },
      {
        id: 'tm2',
        name: 'Tasks Completed',
        category: 'project',
        dataSource: 'project_tasks',
        description: 'Number of tasks completed in the period'
      },
      {
        id: 'tm3',
        name: 'Schedule Variance',
        category: 'project',
        dataSource: 'project_schedule',
        description: 'Difference between planned and actual progress',
        unit: 'days'
      }
    ],
    defaultFilters: [
      {
        id: 'tf1',
        field: 'date',
        operator: 'in_range',
        value: {start: '{{month_start}}', end: '{{month_end}}'}
      }
    ],
    defaultVisualizations: [
      {
        id: 'tv1',
        type: 'bar',
        title: 'Completion by Work Package',
        metrics: ['tm1'],
        config: {
          xAxis: 'work_package',
          stacked: false
        }
      },
      {
        id: 'tv2',
        type: 'line',
        title: 'Progress Over Time',
        metrics: ['tm1'],
        config: {
          xAxis: 'date',
          showMarkers: true
        }
      }
    ],
    createdBy: 'System',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 't2',
    name: 'Quarterly Financial Summary',
    description: 'Standard template for quarterly financial reporting',
    type: 'financial',
    metrics: [
      {
        id: 'tm4',
        name: 'Actual vs Budget',
        category: 'financial',
        dataSource: 'project_financials',
        description: 'Comparison of actual spending against budgeted amounts',
        unit: 'USD'
      },
      {
        id: 'tm5',
        name: 'Profit Margin',
        category: 'financial',
        dataSource: 'financial_analysis',
        description: 'Profit margin percentage',
        unit: '%'
      },
      {
        id: 'tm6',
        name: 'Cash Flow',
        category: 'financial',
        dataSource: 'financial_statements',
        description: 'Cash flow during the period',
        unit: 'USD'
      }
    ],
    defaultFilters: [
      {
        id: 'tf2',
        field: 'date',
        operator: 'in_range',
        value: {start: '{{quarter_start}}', end: '{{quarter_end}}'}
      }
    ],
    defaultVisualizations: [
      {
        id: 'tv3',
        type: 'bar',
        title: 'Budget vs Actual by Category',
        metrics: ['tm4'],
        config: {
          xAxis: 'category',
          stacked: false
        }
      },
      {
        id: 'tv4',
        type: 'line',
        title: 'Cash Flow Trend',
        metrics: ['tm6'],
        config: {
          xAxis: 'date',
          showMarkers: false
        }
      },
      {
        id: 'tv5',
        type: 'pie',
        title: 'Expense Distribution',
        metrics: ['tm4'],
        config: {
          showLegend: true,
          showTotal: true
        }
      }
    ],
    createdBy: 'System',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 't3',
    name: 'Safety Performance Report',
    description: 'Template for safety performance analysis',
    type: 'safety',
    metrics: [
      {
        id: 'tm7',
        name: 'Incident Count',
        category: 'safety',
        dataSource: 'safety_incidents',
        description: 'Number of safety incidents reported'
      },
      {
        id: 'tm8',
        name: 'Near Miss Count',
        category: 'safety',
        dataSource: 'safety_incidents',
        description: 'Number of near misses reported'
      },
      {
        id: 'tm9',
        name: 'Days Since Last Incident',
        category: 'safety',
        dataSource: 'safety_tracking',
        description: 'Days since last recordable incident',
        unit: 'days'
      }
    ],
    defaultFilters: [
      {
        id: 'tf3',
        field: 'date',
        operator: 'in_range',
        value: {start: '{{period_start}}', end: '{{period_end}}'}
      }
    ],
    defaultVisualizations: [
      {
        id: 'tv6',
        type: 'bar',
        title: 'Incidents by Type',
        metrics: ['tm7', 'tm8'],
        config: {
          xAxis: 'incident_type',
          stacked: true
        }
      },
      {
        id: 'tv7',
        type: 'line',
        title: 'Safety Trend',
        metrics: ['tm7'],
        config: {
          xAxis: 'date',
          showMarkers: true
        }
      }
    ],
    createdBy: 'System',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const mockScheduledReports: ScheduledReport[] = [
  {
    id: 's1',
    reportId: '1',
    reportName: 'Q2 2025 Georgia Highway Projects Progress',
    frequency: 'quarterly',
    time: '06:00',
    recipients: ['managers@xdot.example', 'executives@xdot.example'],
    nextScheduled: '2025-07-01T06:00:00Z',
    status: 'active'
  },
  {
    id: 's2',
    reportId: '2',
    reportName: 'Monthly Labor Hours - GA-400 Expansion',
    frequency: 'monthly',
    dayOfMonth: 1,
    time: '07:00',
    recipients: ['project-managers@xdot.example', 'hr@xdot.example'],
    lastSent: '2025-05-01T07:00:00Z',
    nextScheduled: '2025-06-01T07:00:00Z',
    status: 'active'
  },
  {
    id: 's3',
    reportId: '4',
    reportName: 'Equipment Utilization - I-85 Interchange',
    frequency: 'monthly',
    dayOfMonth: 2,
    time: '08:45',
    recipients: ['fleet-manager@xdot.example', 'project-leads@xdot.example'],
    lastSent: '2025-05-02T08:45:00Z',
    nextScheduled: '2025-06-02T08:45:00Z',
    status: 'active'
  },
  {
    id: 's4',
    reportId: '5',
    reportName: 'Financial Performance - US-29 Highway Project',
    frequency: 'monthly',
    dayOfMonth: 5,
    time: '09:30',
    recipients: ['finance@xdot.example', 'executives@xdot.example'],
    lastSent: '2025-05-05T09:30:00Z',
    nextScheduled: '2025-06-05T09:30:00Z',
    status: 'active'
  },
  {
    id: 's5',
    reportId: '7',
    reportName: 'Environmental Impact - GA-400 Expansion',
    frequency: 'quarterly',
    dayOfMonth: 15,
    time: '13:20',
    recipients: ['environmental-team@xdot.example', 'management@xdot.example', 'regulators@state.gov'],
    lastSent: '2025-04-15T13:20:00Z',
    nextScheduled: '2025-07-15T13:20:00Z',
    status: 'active'
  }
];

export function getReportsData() {
  return {
    reports: mockReports,
    templates: mockReportTemplates,
    scheduledReports: mockScheduledReports
  };
}
