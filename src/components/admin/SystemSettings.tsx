
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Save } from 'lucide-react';
import { mockSystemSettings } from '@/data/mockAdminData';
import { SystemSettings as SystemSettingsType } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsType[]>(mockSystemSettings);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('settings');
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});
  
  const { authState } = useAuth();
  const currentUser = authState.user;
  
  // Filter settings based on search query and category
  const filteredSettings = settings.filter(setting => {
    const matchesCategory = categoryFilter === 'all' || setting.category === categoryFilter;
    
    const searchFields = [
      setting.settingKey,
      setting.settingValue,
      setting.description
    ].join(' ').toLowerCase();
    
    const matchesSearch = searchQuery === '' || searchFields.includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleEditSetting = (id: string, value: string) => {
    setEditedSettings({
      ...editedSettings,
      [id]: value
    });
  };

  const handleSaveSettings = () => {
    const updatedSettings = settings.map(setting => {
      if (editedSettings[setting.id]) {
        return {
          ...setting,
          settingValue: editedSettings[setting.id],
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser?.name || 'Unknown'
        };
      }
      return setting;
    });
    
    setSettings(updatedSettings);
    setEditedSettings({});
    toast.success("Settings saved successfully");
  };

  const handleExportSettings = () => {
    // In a real app, this would generate a file for download
    toast.success("Settings exported successfully");
  };

  const isEditingAny = Object.keys(editedSettings).length > 0;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="backups">Backups & Recovery</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure global system settings and parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search settings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="notifications">Notifications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  {isEditingAny && (
                    <Button className="flex-1 md:flex-none" onClick={handleSaveSettings}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 md:flex-none" onClick={handleExportSettings}>
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Setting</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSettings.length > 0 ? (
                      filteredSettings.map((setting) => (
                        <TableRow key={setting.id}>
                          <TableCell className="font-medium">{setting.settingKey}</TableCell>
                          <TableCell>
                            {setting.category === 'api' || setting.category === 'security' ? (
                              <Input
                                type={setting.category === 'api' ? 'password' : 'text'}
                                value={editedSettings[setting.id] !== undefined ? editedSettings[setting.id] : setting.settingValue}
                                onChange={(e) => handleEditSetting(setting.id, e.target.value)}
                                className="w-full"
                              />
                            ) : (
                              <Input
                                value={editedSettings[setting.id] !== undefined ? editedSettings[setting.id] : setting.settingValue}
                                onChange={(e) => handleEditSetting(setting.id, e.target.value)}
                                className="w-full"
                              />
                            )}
                          </TableCell>
                          <TableCell>{setting.description}</TableCell>
                          <TableCell>
                            <span className="capitalize">{setting.category}</span>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(setting.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              By: {setting.updatedBy}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No settings found matching your search or filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle>Backups & Recovery</CardTitle>
              <CardDescription>
                Manage system backups and data recovery options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Manual Backup</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create an immediate backup of all system data including user information,
                    projects, settings, and documents.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={() => toast.success("Backup started. You'll be notified when complete.")}>
                      Create Backup Now
                    </Button>
                    <Button variant="outline" onClick={() => toast.success("Settings exported")}>
                      Export Settings Only
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Scheduled Backups</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure automatic backup schedule and retention policy.
                  </p>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Backup Frequency</label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Retention Period</label>
                        <Select defaultValue="30">
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={() => toast.success("Backup schedule updated")}>
                      Save Schedule
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Restore Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Restore system data from a previous backup.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Select Backup</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a backup" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="backup1">Daily Backup - {new Date().toLocaleDateString()}</SelectItem>
                          <SelectItem value="backup2">Daily Backup - {new Date(Date.now() - 86400000).toLocaleDateString()}</SelectItem>
                          <SelectItem value="backup3">Weekly Backup - {new Date(Date.now() - 604800000).toLocaleDateString()}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="destructive" onClick={() => toast.info("This would initiate a restore operation")}>
                      Restore Selected Backup
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                View and analyze system activity logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      className="w-[200px]"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md h-96 overflow-y-auto">
                  <Textarea 
                    readOnly 
                    className="font-mono text-xs h-full p-4" 
                    value={`[${new Date().toISOString()}] [INFO] System started
[${new Date(Date.now() - 60000).toISOString()}] [INFO] User admin@xdotcontractor.com logged in
[${new Date(Date.now() - 120000).toISOString()}] [INFO] System settings updated
[${new Date(Date.now() - 300000).toISOString()}] [WARN] Failed login attempt for user unknown@example.com
[${new Date(Date.now() - 600000).toISOString()}] [INFO] Scheduled backup completed successfully
[${new Date(Date.now() - 3600000).toISOString()}] [ERROR] Database query timeout in Projects module
[${new Date(Date.now() - 7200000).toISOString()}] [INFO] 5 new users added to the system
[${new Date(Date.now() - 14400000).toISOString()}] [INFO] Email notifications sent successfully
[${new Date(Date.now() - 86400000).toISOString()}] [INFO] System updated to version 2.3.1`}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Download Logs</Button>
                  <Button variant="outline">Clear Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
