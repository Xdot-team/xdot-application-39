
import React, { useState } from 'react';
import { Search, Copy, Key, Plus, ExternalLink, RefreshCw, Power, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { ApiKey, IntegrationStatus, Integration, ApiLog, ApiScope, ApiEndpoint } from '@/types/integrations';
import { mockApiKeys, mockIntegrations, mockApiLogs, mockApiEndpoints } from '@/data/mockIntegrationsData';

export function ApiSettings() {
  const [activeTab, setActiveTab] = useState('keys');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>(mockApiLogs);
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>(mockApiEndpoints);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<ApiScope[]>([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  
  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }
    
    if (selectedScopes.length === 0) {
      toast.error("Please select at least one scope for the API key");
      return;
    }
    
    setIsCreateLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newKey: ApiKey = {
        id: `apikey-${Math.floor(Math.random() * 1000)}`,
        name: newKeyName,
        key: `xdot_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        createdAt: new Date().toISOString(),
        scopes: selectedScopes,
        createdBy: "Current User", // In real app, use the logged-in user's name
        isActive: true
      };
      
      setApiKeys([newKey, ...apiKeys]);
      setShowApiKey({ ...showApiKey, [newKey.id]: true });
      setNewKeyName("");
      setSelectedScopes([]);
      setKeyDialogOpen(false);
      setIsCreateLoading(false);
      
      toast.success("API key created successfully");
    }, 1000);
  };
  
  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, isActive: false } : key
    ));
    
    toast.success("API key revoked successfully");
  };
  
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
      .then(() => toast.success("API key copied to clipboard"))
      .catch(() => toast.error("Failed to copy API key"));
  };
  
  const toggleShowKey = (keyId: string) => {
    setShowApiKey({ ...showApiKey, [keyId]: !showApiKey[keyId] });
  };
  
  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            connectedAt: integration.status === 'disconnected' ? new Date().toISOString() : integration.connectedAt
          } 
        : integration
    ));
    
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      const action = integration.status === 'connected' ? 'disconnected from' : 'connected to';
      toast.success(`Successfully ${action} ${integration.name}`);
    }
  };
  
  const handleSyncIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;
    
    toast.success(`Syncing ${integration.name}...`);
  };
  
  const filteredIntegrations = integrations.filter(integration => {
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         integration.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeColor = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected': return 'bg-green-500 hover:bg-green-600';
      case 'disconnected': return 'bg-slate-500 hover:bg-slate-600';
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'error': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };
  
  // Helper function to truncate API key for display
  const truncateKey = (key: string) => {
    return `${key.substring(0, 10)}...${key.substring(key.length - 5)}`;
  };
  
  // Helper function to format timestamp
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="logs">API Logs</TabsTrigger>
          <TabsTrigger value="documentation">API Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>
                Create and manage API keys for third-party integrations and custom applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search API keys..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={keyDialogOpen} onOpenChange={setKeyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 md:flex-none">
                      <Plus className="mr-2 h-4 w-4" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create new API Key</DialogTitle>
                      <DialogDescription>
                        API keys allow third-party applications to access our API endpoints.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="key-name">API Key Name</Label>
                        <Input 
                          id="key-name" 
                          placeholder="e.g., Procore Integration Key"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Give your key a descriptive name to identify its purpose
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Scopes</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="scope-projects-read" checked={selectedScopes.includes('projects:read')} 
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedScopes([...selectedScopes, 'projects:read']);
                                } else {
                                  setSelectedScopes(selectedScopes.filter(s => s !== 'projects:read'));
                                }
                              }} 
                            />
                            <Label htmlFor="scope-projects-read">Projects - Read</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="scope-projects-write" checked={selectedScopes.includes('projects:write')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedScopes([...selectedScopes, 'projects:write']);
                                } else {
                                  setSelectedScopes(selectedScopes.filter(s => s !== 'projects:write'));
                                }
                              }}
                            />
                            <Label htmlFor="scope-projects-write">Projects - Write</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="scope-documents-read" checked={selectedScopes.includes('documents:read')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedScopes([...selectedScopes, 'documents:read']);
                                } else {
                                  setSelectedScopes(selectedScopes.filter(s => s !== 'documents:read'));
                                }
                              }}
                            />
                            <Label htmlFor="scope-documents-read">Documents - Read</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="scope-documents-write" checked={selectedScopes.includes('documents:write')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedScopes([...selectedScopes, 'documents:write']);
                                } else {
                                  setSelectedScopes(selectedScopes.filter(s => s !== 'documents:write'));
                                }
                              }}
                            />
                            <Label htmlFor="scope-documents-write">Documents - Write</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="scope-financials-read" checked={selectedScopes.includes('financials:read')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedScopes([...selectedScopes, 'financials:read']);
                                } else {
                                  setSelectedScopes(selectedScopes.filter(s => s !== 'financials:read'));
                                }
                              }}
                            />
                            <Label htmlFor="scope-financials-read">Financials - Read</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="scope-financials-write" checked={selectedScopes.includes('financials:write')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedScopes([...selectedScopes, 'financials:write']);
                                } else {
                                  setSelectedScopes(selectedScopes.filter(s => s !== 'financials:write'));
                                }
                              }}
                            />
                            <Label htmlFor="scope-financials-write">Financials - Write</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="scope-users-read" checked={selectedScopes.includes('users:read')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedScopes([...selectedScopes, 'users:read']);
                                } else {
                                  setSelectedScopes(selectedScopes.filter(s => s !== 'users:read'));
                                }
                              }}
                            />
                            <Label htmlFor="scope-users-read">Users - Read</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="scope-all" checked={selectedScopes.includes('all')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedScopes(['all']);
                                } else {
                                  setSelectedScopes(selectedScopes.filter(s => s !== 'all'));
                                }
                              }}
                            />
                            <Label htmlFor="scope-all">All Access</Label>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Select the permissions this API key will have
                        </p>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setKeyDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateApiKey} disabled={isCreateLoading}>
                        {isCreateLoading ? "Creating..." : "Create Key"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Scopes</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.filter(key => 
                      key.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{apiKey.name}</div>
                            <div className="text-sm text-muted-foreground">
                              By {apiKey.createdBy}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              {showApiKey[apiKey.id] ? apiKey.key : truncateKey(apiKey.key)}
                            </code>
                            <Button variant="ghost" size="icon" onClick={() => toggleShowKey(apiKey.id)}>
                              {showApiKey[apiKey.id] ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                              }
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCopyKey(apiKey.key)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {apiKey.scopes.includes('all') ? (
                              <Badge variant="secondary">All Access</Badge>
                            ) : (
                              apiKey.scopes.map((scope) => (
                                <Badge key={scope} variant="secondary">
                                  {scope.replace(':', ' - ')}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(apiKey.createdAt)}
                          </div>
                          {apiKey.expiresAt && (
                            <div className="text-xs text-muted-foreground">
                              Expires: {formatDate(apiKey.expiresAt)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {apiKey.lastUsedAt ? formatDate(apiKey.lastUsedAt) : 'Never used'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            {apiKey.isActive ? (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRevokeKey(apiKey.id)}
                              >
                                Revoke
                              </Button>
                            ) : (
                              <Badge variant="outline" className="border-red-200 text-red-500">
                                Revoked
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Connect with external systems for seamless data flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search integrations..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="disconnected">Disconnected</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredIntegrations.map((integration) => (
                  <Card key={integration.id} className="overflow-hidden">
                    <CardHeader className="px-6 py-4 bg-slate-50 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {integration.name}
                        </CardTitle>
                        <CardDescription>
                          {integration.description}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusBadgeColor(integration.status)} capitalize`}>
                        {integration.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="px-6 py-4">
                      {integration.status === 'error' && integration.config.errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                          Error: {integration.config.errorMessage}
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {integration.status === 'connected' && (
                          <>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Connected since</span>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(integration.connectedAt)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Last sync</span>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(integration.lastSyncAt)}
                              </span>
                            </div>
                            {integration.syncFrequency && (
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">Sync frequency</span>
                                <span className="text-sm text-muted-foreground capitalize">
                                  {integration.syncFrequency}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        
                        {integration.type === 'quickbooks' && integration.status === 'connected' && (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Syncing</span>
                            <span className="text-sm text-muted-foreground">
                              {integration.config.syncInvoices ? 'Invoices, ' : ''}
                              {integration.config.syncPurchaseOrders ? 'Purchase Orders, ' : ''}
                              {integration.config.syncVendors ? 'Vendors, ' : ''}
                              {integration.config.syncClients ? 'Clients' : ''}
                            </span>
                          </div>
                        )}
                        
                        {integration.type === 'procore' && integration.status === 'connected' && (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Projects</span>
                            <span className="text-sm text-muted-foreground">
                              {integration.config.projectIds.length} project(s) connected
                            </span>
                          </div>
                        )}
                        
                        {integration.type === 'dropbox' && integration.status === 'connected' && (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Import folders</span>
                            <span className="text-sm text-muted-foreground">
                              {integration.config.folderPaths.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 py-4 bg-slate-50 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleIntegration(integration.id)}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                      
                      {integration.status === 'connected' && (
                        <Button
                          variant="secondary"
                          onClick={() => handleSyncIntegration(integration.id)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </Button>
                      )}
                      
                      <Button variant="ghost">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Logs</CardTitle>
              <CardDescription>
                Monitor API activity and troubleshoot integration issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by endpoint or status..."
                      className="pl-9"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status Codes</SelectItem>
                      <SelectItem value="200">Successful (200)</SelectItem>
                      <SelectItem value="400">Bad Request (400)</SelectItem>
                      <SelectItem value="401">Unauthorized (401)</SelectItem>
                      <SelectItem value="403">Forbidden (403)</SelectItem>
                      <SelectItem value="404">Not Found (404)</SelectItem>
                      <SelectItem value="429">Rate Limited (429)</SelectItem>
                      <SelectItem value="500">Server Error (500)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">Export Logs</Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>API Key</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiLogs.map((log) => {
                      const apiKey = apiKeys.find(key => key.id === log.apiKeyId);
                      return (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.timestamp)}</TableCell>
                          <TableCell>
                            <code className="text-sm">{log.endpoint}</code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              log.method === 'GET' ? 'border-blue-200 text-blue-600' :
                              log.method === 'POST' ? 'border-green-200 text-green-600' :
                              log.method === 'PUT' ? 'border-amber-200 text-amber-600' :
                              log.method === 'DELETE' ? 'border-red-200 text-red-600' : ''
                            }>
                              {log.method}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              log.statusCode >= 200 && log.statusCode < 300 ? 'default' :
                              log.statusCode >= 400 && log.statusCode < 500 ? 'destructive' :
                              'outline'
                            }>
                              {log.statusCode}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.responseTime}ms</TableCell>
                          <TableCell>
                            {apiKey ? (
                              <div className="flex items-center">
                                <div className="text-sm">
                                  {apiKey.name}
                                  {!apiKey.isActive && (
                                    <span className="text-xs text-muted-foreground ml-1">(revoked)</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Unknown</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Reference documentation for all available API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                  <p className="text-muted-foreground mb-4">
                    The xDOTContractor API allows you to access and manage your construction data programmatically.
                    Use our API to integrate with third-party applications or build your own custom tools.
                  </p>
                  <div className="p-4 bg-slate-50 rounded-md">
                    <h4 className="font-medium mb-2">Base URL</h4>
                    <code className="block p-2 bg-slate-100 rounded">
                      https://api.xdotcontractor.com/v1
                    </code>
                    <p className="mt-2 text-sm text-muted-foreground">
                      All API requests should be sent to this base URL with the appropriate endpoint path.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                  <p className="text-muted-foreground mb-4">
                    All API requests require authentication using an API key. Pass your API key in the request header:
                  </p>
                  <code className="block p-2 bg-slate-100 rounded">
                    X-API-Key: your_api_key_here
                  </code>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold">API Endpoints</h3>
                  
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={`${endpoint.path}-${endpoint.method}`} className="my-6">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={
                          endpoint.method === 'GET' ? 'border-blue-200 text-blue-600' :
                          endpoint.method === 'POST' ? 'border-green-200 text-green-600' :
                          endpoint.method === 'PUT' ? 'border-amber-200 text-amber-600' :
                          endpoint.method === 'DELETE' ? 'border-red-200 text-red-600' : ''
                        }>
                          {endpoint.method}
                        </Badge>
                        <code className="text-base font-semibold">{endpoint.path}</code>
                      </div>
                      
                      <p className="mt-1 mb-3 text-muted-foreground">{endpoint.description}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Required Authentication</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {endpoint.requiresAuth ? 'API Key Required' : 'Public'}
                            </Badge>
                            {endpoint.scopes.map(scope => (
                              <Badge key={scope} variant="secondary">
                                {scope.replace(':', ' - ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Parameters</h4>
                            <div className="border rounded-md overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>In</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Required</TableHead>
                                    <TableHead>Description</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {endpoint.parameters.map(param => (
                                    <TableRow key={param.name}>
                                      <TableCell className="font-mono">{param.name}</TableCell>
                                      <TableCell>{param.in}</TableCell>
                                      <TableCell>{param.type}</TableCell>
                                      <TableCell>{param.required ? 'Yes' : 'No'}</TableCell>
                                      <TableCell>{param.description}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                        
                        {endpoint.responses && endpoint.responses.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Responses</h4>
                            <div className="space-y-2">
                              {endpoint.responses.map(response => (
                                <div key={response.statusCode} className="border rounded-md p-3">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant={
                                      response.statusCode >= 200 && response.statusCode < 300 ? 'default' :
                                      response.statusCode >= 400 && response.statusCode < 500 ? 'destructive' :
                                      'outline'
                                    }>
                                      {response.statusCode}
                                    </Badge>
                                    <span className="font-medium">{response.description}</span>
                                  </div>
                                  
                                  {response.example && (
                                    <div className="bg-slate-50 p-3 rounded-md overflow-auto max-h-60">
                                      <pre className="text-xs">
                                        {response.example}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {index < apiEndpoints.length - 1 && <Separator className="my-6" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Download API Docs</Button>
              <Button>Request Access</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
