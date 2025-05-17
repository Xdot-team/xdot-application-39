
import { 
  Integration, 
  ApiKey, 
  ApiLog, 
  ApiEndpoint, 
  IntegrationSyncEvent 
} from '@/types/integrations';

// Mock integrations data
export const mockIntegrations: Integration[] = [
  {
    id: "int-quickbooks-001",
    type: "quickbooks",
    name: "QuickBooks Online",
    description: "Sync invoices, purchase orders, and financial data with QuickBooks Online",
    status: "connected",
    connectedAt: "2025-03-15T10:30:00Z",
    lastSyncAt: "2025-05-16T14:45:00Z",
    syncFrequency: "daily",
    config: {
      companyId: "12345678",
      environment: "production",
      syncInvoices: true,
      syncPurchaseOrders: true,
      syncVendors: true,
      syncClients: true
    }
  },
  {
    id: "int-procore-001",
    type: "procore",
    name: "Procore",
    description: "Sync projects, RFIs, submittals with Procore project management",
    status: "connected",
    connectedAt: "2025-02-20T15:20:00Z",
    lastSyncAt: "2025-05-16T08:15:00Z",
    syncFrequency: "daily",
    config: {
      projectIds: ["PRJ-123", "PRJ-456", "PRJ-789"],
      syncProjects: true,
      syncRFIs: true,
      syncSubmittals: true
    }
  },
  {
    id: "int-plangrid-001",
    type: "plangrid",
    name: "PlanGrid",
    description: "Sync drawings and markups with PlanGrid",
    status: "disconnected",
    config: {}
  },
  {
    id: "int-bluebeam-001",
    type: "bluebeam",
    name: "Bluebeam Revu",
    description: "Sync PDFs and annotations with Bluebeam",
    status: "error",
    connectedAt: "2025-04-10T09:15:00Z",
    lastSyncAt: "2025-05-15T22:30:00Z",
    syncFrequency: "weekly",
    config: {
      projectFolders: ["Georgia Office Building", "Atlanta Medical Center"],
      syncAnnotations: true,
      syncMarkups: true,
      errorMessage: "Authentication token expired"
    }
  },
  {
    id: "int-dropbox-001",
    type: "dropbox",
    name: "Dropbox",
    description: "Import files from Dropbox cloud storage",
    status: "connected",
    connectedAt: "2025-01-05T11:45:00Z",
    lastSyncAt: "2025-05-16T10:20:00Z",
    syncFrequency: "manual",
    config: {
      folderPaths: ["/Projects/2025/", "/Contracts/Active/"],
      autoImport: false
    }
  }
];

// Mock API keys
export const mockApiKeys: ApiKey[] = [
  {
    id: "apikey-001",
    name: "Production API Key",
    key: "xdot_live_Hj2p9zXqR5sT1vW7yK3mL8nB4cF6gD0e",
    createdAt: "2025-01-10T14:30:00Z",
    lastUsedAt: "2025-05-16T20:15:00Z",
    scopes: ["projects:read", "documents:read", "financials:read"],
    createdBy: "John Carpenter",
    isActive: true
  },
  {
    id: "apikey-002",
    name: "Procore Integration",
    key: "xdot_int_J8kL5mN3pQ7rT2sV9xW4zY6cB1dF0gA3",
    createdAt: "2025-02-20T15:20:00Z",
    lastUsedAt: "2025-05-16T08:15:00Z",
    scopes: ["projects:read", "projects:write", "documents:read"],
    createdBy: "System Integration",
    isActive: true
  },
  {
    id: "apikey-003",
    name: "Testing Key",
    key: "xdot_test_T5sR2qP9nM6kL3jH7gF4dS1aZ8xC0bV2",
    createdAt: "2025-03-05T09:45:00Z",
    expiresAt: "2025-07-05T09:45:00Z",
    scopes: ["all"],
    createdBy: "Emily Rodriguez",
    isActive: true
  },
  {
    id: "apikey-004",
    name: "QuickBooks Sync",
    key: "xdot_int_Q4wE5rT6yU7iO8pA9sD3fG2hJ1kL0zX3",
    createdAt: "2025-03-15T10:30:00Z",
    lastUsedAt: "2025-05-16T14:45:00Z",
    scopes: ["financials:read", "financials:write"],
    createdBy: "System Integration",
    isActive: true
  },
  {
    id: "apikey-005",
    name: "Revoked Key",
    key: "xdot_rev_X3zC2vB1nM0kL7jH5gF3dS8aZ6xQ4wE2",
    createdAt: "2025-01-15T11:30:00Z",
    lastUsedAt: "2025-04-20T16:45:00Z",
    scopes: ["documents:read"],
    createdBy: "Michael Johnson",
    isActive: false
  }
];

// Mock API logs
export const mockApiLogs: ApiLog[] = [
  {
    id: "log-001",
    timestamp: "2025-05-16T20:15:43Z",
    endpoint: "/api/v1/projects",
    method: "GET",
    statusCode: 200,
    responseTime: 123,
    apiKeyId: "apikey-001",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log-002",
    timestamp: "2025-05-16T14:45:22Z",
    endpoint: "/api/v1/financials/invoices",
    method: "POST",
    statusCode: 201,
    responseTime: 345,
    apiKeyId: "apikey-004",
    userAgent: "QuickBooks Integration/1.0",
    ipAddress: "10.0.0.15",
    requestPayload: JSON.stringify({
      invoiceNumber: "INV-12345",
      clientId: "CL-789",
      amount: 12500
    })
  },
  {
    id: "log-003",
    timestamp: "2025-05-16T08:15:11Z",
    endpoint: "/api/v1/projects/PRJ-456/rfis",
    method: "GET",
    statusCode: 200,
    responseTime: 87,
    apiKeyId: "apikey-002",
    userAgent: "Procore Integration/2.3",
    ipAddress: "52.45.67.89"
  },
  {
    id: "log-004",
    timestamp: "2025-05-15T22:30:05Z",
    endpoint: "/api/v1/documents/upload",
    method: "POST",
    statusCode: 401,
    responseTime: 56,
    apiKeyId: "apikey-005",
    userAgent: "Bluebeam Sync/1.0",
    ipAddress: "203.45.67.89",
    responsePayload: JSON.stringify({
      error: "Unauthorized",
      message: "API key has been revoked"
    })
  },
  {
    id: "log-005",
    timestamp: "2025-05-15T21:45:18Z",
    endpoint: "/api/v1/projects",
    method: "GET",
    statusCode: 429,
    responseTime: 23,
    apiKeyId: "apikey-003",
    userAgent: "Integration Test Suite",
    ipAddress: "192.168.5.25",
    responsePayload: JSON.stringify({
      error: "Rate limit exceeded",
      message: "Too many requests, please try again later"
    })
  }
];

// Mock integration sync events
export const mockSyncEvents: IntegrationSyncEvent[] = [
  {
    id: "sync-001",
    integrationType: "quickbooks",
    timestamp: "2025-05-16T14:45:00Z",
    status: "success",
    itemsProcessed: 15,
    itemsTotal: 15,
    details: {
      invoices: 5,
      purchaseOrders: 7,
      vendors: 3
    }
  },
  {
    id: "sync-002",
    integrationType: "procore",
    timestamp: "2025-05-16T08:15:00Z",
    status: "success",
    itemsProcessed: 12,
    itemsTotal: 12,
    details: {
      projects: 3,
      rfis: 6,
      submittals: 3
    }
  },
  {
    id: "sync-003",
    integrationType: "bluebeam",
    timestamp: "2025-05-15T22:30:00Z",
    status: "failed",
    itemsProcessed: 0,
    itemsTotal: 8,
    errorMessage: "Authentication token expired",
    details: {
      attemptedFiles: ["GEO-A-101.pdf", "GEO-S-201.pdf"]
    }
  },
  {
    id: "sync-004",
    integrationType: "dropbox",
    timestamp: "2025-05-16T10:20:00Z",
    status: "success",
    itemsProcessed: 4,
    itemsTotal: 4,
    details: {
      importedFiles: ["Contract_AMC_Rev3.pdf", "Schedule_May2025.xlsx", "Budget_Q2_2025.xlsx", "Proposal_GSU_Building.pdf"]
    }
  }
];

// Mock API endpoints documentation
export const mockApiEndpoints: ApiEndpoint[] = [
  {
    path: "/api/v1/projects",
    method: "GET",
    description: "Get a list of all projects",
    requiresAuth: true,
    scopes: ["projects:read", "all"],
    parameters: [
      {
        name: "status",
        in: "query",
        required: false,
        type: "string",
        description: "Filter projects by status (active, completed, upcoming)"
      },
      {
        name: "limit",
        in: "query",
        required: false,
        type: "number",
        description: "Limit the number of results returned"
      }
    ],
    responses: [
      {
        statusCode: 200,
        description: "A list of projects",
        example: JSON.stringify([
          {
            "id": "PRJ-123",
            "name": "Georgia Office Building",
            "status": "active",
            "contractValue": 2500000
          }
        ])
      }
    ]
  },
  {
    path: "/api/v1/projects/{projectId}",
    method: "GET",
    description: "Get details for a specific project",
    requiresAuth: true,
    scopes: ["projects:read", "all"],
    parameters: [
      {
        name: "projectId",
        in: "path",
        required: true,
        type: "string",
        description: "The ID of the project to retrieve"
      }
    ],
    responses: [
      {
        statusCode: 200,
        description: "Project details",
        example: JSON.stringify({
          "id": "PRJ-123",
          "name": "Georgia Office Building",
          "description": "10-story office building in downtown Atlanta",
          "status": "active",
          "location": "Atlanta, GA",
          "contractValue": 2500000,
          "startDate": "2025-01-15",
          "endDate": "2026-06-30",
          "clientName": "Atlanta Development Corp",
          "projectManager": "Emily Rodriguez"
        })
      },
      {
        statusCode: 404,
        description: "Project not found"
      }
    ]
  },
  {
    path: "/api/v1/financials/invoices",
    method: "GET",
    description: "Get a list of client invoices",
    requiresAuth: true,
    scopes: ["financials:read", "all"],
    parameters: [
      {
        name: "status",
        in: "query",
        required: false,
        type: "string",
        description: "Filter invoices by status (draft, sent, paid, overdue)"
      }
    ],
    responses: [
      {
        statusCode: 200,
        description: "A list of invoices",
        example: JSON.stringify([
          {
            "id": "INV-12345",
            "projectId": "PRJ-123",
            "clientName": "Atlanta Development Corp",
            "amount": 125000,
            "status": "sent"
          }
        ])
      }
    ]
  },
  {
    path: "/api/v1/documents",
    method: "GET",
    description: "Get a list of documents",
    requiresAuth: true,
    scopes: ["documents:read", "all"],
    parameters: [
      {
        name: "projectId",
        in: "query",
        required: false,
        type: "string",
        description: "Filter documents by project ID"
      },
      {
        name: "type",
        in: "query",
        required: false,
        type: "string",
        description: "Filter documents by type (contract, drawing, submittal, etc.)"
      }
    ],
    responses: [
      {
        statusCode: 200,
        description: "A list of documents",
        example: JSON.stringify([
          {
            "id": "DOC-456",
            "name": "Contract Agreement",
            "type": "contract",
            "projectId": "PRJ-123",
            "uploadedBy": "John Carpenter",
            "uploadedAt": "2025-02-15T10:30:00Z"
          }
        ])
      }
    ]
  }
];

// Sample QuickBooks invoices (for our Georgia contractor with 50 employees)
export const sampleQuickbooksInvoices = [
  {
    invoiceNumber: "INV-12345",
    clientName: "Atlanta Development Corp",
    projectName: "Georgia Office Building",
    amount: 125000.00,
    issueDate: "2025-05-01",
    dueDate: "2025-05-31",
    status: "sent",
    lineItems: [
      { description: "Steel structure installation - Phase 1", amount: 75000.00 },
      { description: "Electrical work - First floor", amount: 35000.00 },
      { description: "Project management fees", amount: 15000.00 }
    ]
  },
  {
    invoiceNumber: "INV-12346",
    clientName: "Georgia State University",
    projectName: "GSU Science Building",
    amount: 87500.00,
    issueDate: "2025-05-05",
    dueDate: "2025-06-04",
    status: "sent",
    lineItems: [
      { description: "Foundation work completion", amount: 45000.00 },
      { description: "Plumbing installation", amount: 32500.00 },
      { description: "Site management", amount: 10000.00 }
    ]
  },
  {
    invoiceNumber: "INV-12341",
    clientName: "Savannah Medical Center",
    projectName: "Medical Office Addition",
    amount: 68000.00,
    issueDate: "2025-04-15",
    dueDate: "2025-05-15",
    status: "paid",
    lineItems: [
      { description: "Interior framing", amount: 28000.00 },
      { description: "HVAC installation", amount: 35000.00 },
      { description: "Project supervision", amount: 5000.00 }
    ]
  },
  {
    invoiceNumber: "INV-12338",
    clientName: "Macon County School Board",
    projectName: "Macon Elementary Renovation",
    amount: 92500.00,
    issueDate: "2025-04-01",
    dueDate: "2025-05-01",
    status: "paid",
    lineItems: [
      { description: "Classroom modernization - Phase 2", amount: 65000.00 },
      { description: "Safety upgrades", amount: 27500.00 }
    ]
  },
  {
    invoiceNumber: "INV-12352",
    clientName: "Augusta Golf Resort",
    projectName: "Clubhouse Expansion",
    amount: 105000.00,
    issueDate: "2025-05-10",
    dueDate: "2025-06-09",
    status: "draft",
    lineItems: [
      { description: "Structural work", amount: 60000.00 },
      { description: "Interior finishing", amount: 35000.00 },
      { description: "Design consultation", amount: 10000.00 }
    ]
  }
];

// Sample Procore projects
export const sampleProcoreProjects = [
  {
    id: "PRJ-123",
    name: "Georgia Office Building",
    location: "Atlanta, GA",
    client: "Atlanta Development Corp",
    contractValue: 2500000.00,
    startDate: "2025-01-15",
    estimatedCompletion: "2026-06-30",
    status: "active",
    completionPercentage: 25,
    projectManager: "Emily Rodriguez",
    rfis: 8,
    submittals: 12,
    changeOrders: 3
  },
  {
    id: "PRJ-456",
    name: "GSU Science Building",
    location: "Atlanta, GA",
    client: "Georgia State University",
    contractValue: 4200000.00,
    startDate: "2025-03-01",
    estimatedCompletion: "2026-08-15",
    status: "active",
    completionPercentage: 10,
    projectManager: "Michael Johnson",
    rfis: 5,
    submittals: 9,
    changeOrders: 1
  },
  {
    id: "PRJ-789",
    name: "Medical Office Addition",
    location: "Savannah, GA",
    client: "Savannah Medical Center",
    contractValue: 1800000.00,
    startDate: "2025-02-10",
    estimatedCompletion: "2025-12-20",
    status: "active",
    completionPercentage: 35,
    projectManager: "Sarah Williams",
    rfis: 6,
    submittals: 8,
    changeOrders: 2
  }
];
