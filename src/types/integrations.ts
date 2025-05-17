
export type IntegrationType = 'quickbooks' | 'procore' | 'plangrid' | 'bluebeam' | 'dropbox' | 'custom';

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  description: string;
  status: IntegrationStatus;
  connectedAt?: string;
  lastSyncAt?: string;
  syncFrequency?: 'hourly' | 'daily' | 'weekly' | 'manual';
  config: Record<string, any>;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
  scopes: ApiScope[];
  createdBy: string;
  isActive: boolean;
}

export type ApiScope = 'projects:read' | 'projects:write' | 'documents:read' | 'documents:write' | 
  'financials:read' | 'financials:write' | 'users:read' | 'all';

export interface ApiLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  statusCode: number;
  responseTime: number;
  apiKeyId?: string;
  userAgent?: string;
  ipAddress?: string;
  requestPayload?: string;
  responsePayload?: string;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requiresAuth: boolean;
  scopes: ApiScope[];
  parameters?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: ApiResponse[];
}

export interface ApiParameter {
  name: string;
  in: 'path' | 'query' | 'header';
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
}

export interface ApiRequestBody {
  required: boolean;
  contentType: string;
  schema: Record<string, any>;
  example?: string;
}

export interface ApiResponse {
  statusCode: number;
  description: string;
  schema?: Record<string, any>;
  example?: string;
}

export interface IntegrationSyncEvent {
  id: string;
  integrationType: IntegrationType;
  timestamp: string;
  status: 'success' | 'failed' | 'in_progress';
  itemsProcessed?: number;
  itemsTotal?: number;
  errorMessage?: string;
  details?: Record<string, any>;
}

export interface IntegrationSyncConfig {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  syncTypes: IntegrationSyncType[];
  lastSync?: string;
  nextScheduledSync?: string;
}

export type IntegrationSyncType = 
  'projects' | 'invoices' | 'purchase_orders' | 'rfis' | 
  'drawings' | 'documents' | 'users';
