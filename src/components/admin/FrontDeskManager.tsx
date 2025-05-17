
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Package, UserRound, ArrowRight } from 'lucide-react';
import { mockFrontDeskLogs } from '@/data/mockAdminData';
import { FrontDeskLog } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export function FrontDeskManager() {
  const [logs, setLogs] = useState<FrontDeskLog[]>(mockFrontDeskLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [logType, setLogType] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLog, setNewLog] = useState<Partial<FrontDeskLog>>({
    type: 'visitor',
    checkedIn: true,
  });
  
  const { authState } = useAuth();
  const currentUser = authState.user;

  // Filter logs based on search query and type
  const filteredLogs = logs.filter(log => {
    const matchesType = logType === 'all' || log.type === logType;
    
    const searchFields = [
      log.visitorName, 
      log.company, 
      log.contactPerson,
      log.purpose,
      log.deliveryCompany,
      log.packageDescription,
      log.recipientName,
      log.notes
    ].filter(Boolean).join(' ').toLowerCase();
    
    const matchesSearch = searchQuery === '' || searchFields.includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const handleCreateLog = () => {
    if (!validateLogFields()) {
      return;
    }

    const createdLog: FrontDeskLog = {
      id: `log_${Date.now()}`,
      type: newLog.type as 'visitor' | 'delivery' | 'pickup' | 'other',
      visitorName: newLog.visitorName,
      company: newLog.company,
      contactPerson: newLog.contactPerson,
      purpose: newLog.purpose,
      deliveryCompany: newLog.deliveryCompany,
      packageDescription: newLog.packageDescription,
      recipientName: newLog.recipientName,
      timestamp: new Date().toISOString(),
      checkedIn: newLog.checkedIn || true,
      notes: newLog.notes,
      loggedById: currentUser?.id || '1'
    };

    setLogs([createdLog, ...logs]);
    resetNewLog();
    setDialogOpen(false);
    toast.success(`${capitalizeFirstLetter(createdLog.type)} log created successfully`);
  };

  const validateLogFields = (): boolean => {
    const { type } = newLog;
    
    if (type === 'visitor' && (!newLog.visitorName || !newLog.purpose)) {
      toast.error("Please enter visitor name and purpose");
      return false;
    } else if (type === 'delivery' && (!newLog.deliveryCompany || !newLog.packageDescription)) {
      toast.error("Please enter delivery company and package description");
      return false;
    } else if (type === 'pickup' && (!newLog.packageDescription)) {
      toast.error("Please enter package description");
      return false;
    } else if (type === 'other' && (!newLog.purpose)) {
      toast.error("Please enter purpose");
      return false;
    }
    
    return true;
  };

  const resetNewLog = () => {
    setNewLog({
      type: 'visitor',
      checkedIn: true,
    });
  };

  const handleCheckOut = (logId: string) => {
    const updatedLogs = logs.map(log => {
      if (log.id === logId && log.checkedIn && !log.checkedOut) {
        return {
          ...log,
          checkedOut: new Date().toISOString()
        };
      }
      return log;
    });
    
    setLogs(updatedLogs);
    toast.success("Checked out successfully");
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Front Desk Manager</CardTitle>
              <CardDescription>
                Track visitors, deliveries, and other front desk activities
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Log
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Front Desk Log</DialogTitle>
                  <DialogDescription>
                    Record a new visitor, delivery, pickup, or other front desk activity
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Log Type*</label>
                    <Select 
                      value={newLog.type} 
                      onValueChange={(value) => setNewLog({...newLog, type: value as 'visitor' | 'delivery' | 'pickup' | 'other'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select log type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visitor">Visitor</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Dynamic fields based on log type */}
                  {newLog.type === 'visitor' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Visitor Name*</label>
                        <Input
                          placeholder="Enter visitor name"
                          value={newLog.visitorName || ''}
                          onChange={(e) => setNewLog({...newLog, visitorName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <Input
                          placeholder="Enter company name"
                          value={newLog.company || ''}
                          onChange={(e) => setNewLog({...newLog, company: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Contact Person</label>
                        <Input
                          placeholder="Who are they here to see?"
                          value={newLog.contactPerson || ''}
                          onChange={(e) => setNewLog({...newLog, contactPerson: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Purpose*</label>
                        <Input
                          placeholder="Purpose of visit"
                          value={newLog.purpose || ''}
                          onChange={(e) => setNewLog({...newLog, purpose: e.target.value})}
                        />
                      </div>
                    </>
                  )}
                  
                  {newLog.type === 'delivery' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Delivery Company*</label>
                        <Input
                          placeholder="Enter delivery company"
                          value={newLog.deliveryCompany || ''}
                          onChange={(e) => setNewLog({...newLog, deliveryCompany: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Package Description*</label>
                        <Input
                          placeholder="Describe the package"
                          value={newLog.packageDescription || ''}
                          onChange={(e) => setNewLog({...newLog, packageDescription: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Recipient</label>
                        <Input
                          placeholder="Who is the package for?"
                          value={newLog.recipientName || ''}
                          onChange={(e) => setNewLog({...newLog, recipientName: e.target.value})}
                        />
                      </div>
                    </>
                  )}
                  
                  {newLog.type === 'pickup' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Delivery Company</label>
                        <Input
                          placeholder="Enter delivery company"
                          value={newLog.deliveryCompany || ''}
                          onChange={(e) => setNewLog({...newLog, deliveryCompany: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Package Description*</label>
                        <Input
                          placeholder="Describe the package"
                          value={newLog.packageDescription || ''}
                          onChange={(e) => setNewLog({...newLog, packageDescription: e.target.value})}
                        />
                      </div>
                    </>
                  )}
                  
                  {newLog.type === 'other' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Purpose*</label>
                      <Input
                        placeholder="Purpose of the log"
                        value={newLog.purpose || ''}
                        onChange={(e) => setNewLog({...newLog, purpose: e.target.value})}
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <Textarea
                      placeholder="Additional notes"
                      rows={2}
                      value={newLog.notes || ''}
                      onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="checked-in"
                      checked={newLog.checkedIn}
                      onCheckedChange={(checked) => setNewLog({...newLog, checkedIn: checked})}
                    />
                    <label htmlFor="checked-in">Checked In</label>
                  </div>
                  
                  <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateLog}>Create Log</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={logType} onValueChange={setLogType}>
              <TabsList className="grid grid-cols-5 w-full md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="visitor">Visitors</TabsTrigger>
                <TabsTrigger value="delivery">Deliveries</TabsTrigger>
                <TabsTrigger value="pickup">Pickups</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {log.type === 'visitor' && <UserRound className="h-4 w-4 mr-2" />}
                        {log.type === 'delivery' && <Package className="h-4 w-4 mr-2" />}
                        {log.type === 'pickup' && <ArrowRight className="h-4 w-4 mr-2" />}
                        {capitalizeFirstLetter(log.type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {log.type === 'visitor' && (
                          <div>
                            <p className="font-medium truncate">{log.visitorName}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {log.company && `${log.company} • `}
                              {log.purpose}
                            </p>
                          </div>
                        )}
                        {log.type === 'delivery' && (
                          <div>
                            <p className="font-medium truncate">{log.deliveryCompany}</p>
                            <p className="text-sm text-muted-foreground truncate">{log.packageDescription}</p>
                            {log.recipientName && <p className="text-xs">For: {log.recipientName}</p>}
                          </div>
                        )}
                        {log.type === 'pickup' && (
                          <div>
                            <p className="font-medium truncate">{log.deliveryCompany || 'Package Pickup'}</p>
                            <p className="text-sm text-muted-foreground truncate">{log.packageDescription}</p>
                          </div>
                        )}
                        {log.type === 'other' && (
                          <div>
                            <p className="font-medium truncate">{log.purpose}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {log.checkedOut ? (
                        <span className="text-sm inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                          Checked out
                        </span>
                      ) : log.checkedIn ? (
                        <span className="text-sm inline-flex items-center px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                          Checked in
                        </span>
                      ) : (
                        <span className="text-sm inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.checkedIn && !log.checkedOut && (
                        <Button variant="outline" size="sm" onClick={() => handleCheckOut(log.id)}>
                          Check Out
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
