import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { 
  Wrench, 
  Plus, 
  Search, 
  QrCode, 
  Calendar, 
  MapPin, 
  LogIn, 
  LogOut,
  AlertTriangle,
  Clock,
  Package
} from 'lucide-react';

interface Tool {
  id: string;
  tool_name: string;
  tool_type: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  status: string;
  location?: string;
  assigned_to_worker_id?: string;
  assigned_to_project_id?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  purchase_cost?: number;
  current_value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ToolCheckout {
  id: string;
  tool_id: string;
  worker_name: string;
  checkout_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
  status: string;
  checkout_notes?: string;
  return_notes?: string;
}

export function ToolsManagement() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [checkouts, setCheckouts] = useState<ToolCheckout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const [newTool, setNewTool] = useState({
    tool_name: '',
    tool_type: '',
    brand: '',
    model: '',
    serial_number: '',
    location: '',
    purchase_cost: 0,
    notes: ''
  });

  const [checkoutForm, setCheckoutForm] = useState({
    worker_name: '',
    expected_return_date: '',
    checkout_notes: ''
  });

  useEffect(() => {
    fetchTools();
    fetchCheckouts();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tools_inventory')
        .select('*')
        .order('tool_name');

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckouts = async () => {
    try {
      const { data, error } = await supabase
        .from('tool_checkouts')
        .select('*')
        .eq('status', 'checked_out')
        .order('checkout_date', { ascending: false });

      if (error) throw error;
      setCheckouts(data || []);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
    }
  };

  const addTool = async () => {
    try {
      const { error } = await supabase
        .from('tools_inventory')
        .insert([{
          ...newTool,
          status: 'available',
          current_value: newTool.purchase_cost
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool added successfully",
      });

      setNewTool({
        tool_name: '',
        tool_type: '',
        brand: '',
        model: '',
        serial_number: '',
        location: '',
        purchase_cost: 0,
        notes: ''
      });
      setIsAddDialogOpen(false);
      fetchTools();
    } catch (error) {
      console.error('Error adding tool:', error);
      toast({
        title: "Error",
        description: "Failed to add tool",
        variant: "destructive",
      });
    }
  };

  const checkoutTool = async () => {
    if (!selectedTool) return;

    try {
      // Create checkout record
      const { error: checkoutError } = await supabase
        .from('tool_checkouts')
        .insert([{
          tool_id: selectedTool.id,
          worker_name: checkoutForm.worker_name,
          expected_return_date: checkoutForm.expected_return_date || null,
          checkout_notes: checkoutForm.checkout_notes || null,
          status: 'checked_out'
        }]);

      if (checkoutError) throw checkoutError;

      // Update tool status
      const { error: updateError } = await supabase
        .from('tools_inventory')
        .update({ 
          status: 'in_use',
          assigned_to_worker_id: null // We'd need to look up worker ID if we had it
        })
        .eq('id', selectedTool.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Tool checked out successfully",
      });

      setCheckoutForm({
        worker_name: '',
        expected_return_date: '',
        checkout_notes: ''
      });
      setIsCheckoutDialogOpen(false);
      setSelectedTool(null);
      fetchTools();
      fetchCheckouts();
    } catch (error) {
      console.error('Error checking out tool:', error);
      toast({
        title: "Error",
        description: "Failed to check out tool",
        variant: "destructive",
      });
    }
  };

  const returnTool = async (toolId: string, checkoutId: string) => {
    try {
      // Update checkout record
      const { error: checkoutError } = await supabase
        .from('tool_checkouts')
        .update({ 
          status: 'returned',
          actual_return_date: new Date().toISOString()
        })
        .eq('id', checkoutId);

      if (checkoutError) throw checkoutError;

      // Update tool status
      const { error: updateError } = await supabase
        .from('tools_inventory')
        .update({ 
          status: 'available',
          assigned_to_worker_id: null
        })
        .eq('id', toolId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Tool returned successfully",
      });

      fetchTools();
      fetchCheckouts();
    } catch (error) {
      console.error('Error returning tool:', error);
      toast({
        title: "Error",
        description: "Failed to return tool",
        variant: "destructive",
      });
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tool_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tool.brand && tool.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toolTypes = [
    'Power Tool', 'Hand Tool', 'Measuring Tool', 'Safety Equipment', 
    'Testing Equipment', 'Heavy Equipment', 'Vehicle', 'Other'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'in_use': return 'bg-blue-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'retired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tools & Equipment Management</h1>
          <p className="text-muted-foreground">
            Track, manage, and assign tools and equipment
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tool
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tool</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tool_name">Tool Name *</Label>
                  <Input
                    id="tool_name"
                    value={newTool.tool_name}
                    onChange={(e) => setNewTool(prev => ({ ...prev, tool_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tool_type">Tool Type *</Label>
                  <Select
                    value={newTool.tool_type}
                    onValueChange={(value) => setNewTool(prev => ({ ...prev, tool_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {toolTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={newTool.brand}
                    onChange={(e) => setNewTool(prev => ({ ...prev, brand: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newTool.model}
                    onChange={(e) => setNewTool(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial_number">Serial Number</Label>
                  <Input
                    id="serial_number"
                    value={newTool.serial_number}
                    onChange={(e) => setNewTool(prev => ({ ...prev, serial_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newTool.location}
                    onChange={(e) => setNewTool(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_cost">Purchase Cost ($)</Label>
                <Input
                  id="purchase_cost"
                  type="number"
                  value={newTool.purchase_cost}
                  onChange={(e) => setNewTool(prev => ({ ...prev, purchase_cost: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newTool.notes}
                  onChange={(e) => setNewTool(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addTool}>
                  Add Tool
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tools.length}</div>
            <div className="text-xs text-muted-foreground">
              All tools in inventory
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {tools.filter(t => t.status === 'available').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Ready for use
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {tools.filter(t => t.status === 'in_use').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Currently checked out
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {tools.filter(t => t.status === 'maintenance').length}
            </div>
            <div className="text-xs text-muted-foreground">
              Being serviced
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in_use">In Use</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="checkouts">Active Checkouts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Tools Inventory</CardTitle>
              <CardDescription>
                {filteredTools.length} tools found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Brand/Model</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell>
                        <div className="font-medium">{tool.tool_name}</div>
                        {tool.serial_number && (
                          <div className="text-xs text-muted-foreground">
                            S/N: {tool.serial_number}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{tool.tool_type}</TableCell>
                      <TableCell>
                        {tool.brand && tool.model ? `${tool.brand} ${tool.model}` : 
                         tool.brand || tool.model || '-'}
                      </TableCell>
                      <TableCell>{tool.location || '-'}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(tool.status)} text-white`}>
                          {tool.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tool.status === 'available' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedTool(tool);
                              setIsCheckoutDialogOpen(true);
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-1" />
                            Check Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkouts">
          <Card>
            <CardHeader>
              <CardTitle>Active Checkouts</CardTitle>
              <CardDescription>
                {checkouts.length} tools currently checked out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Checkout Date</TableHead>
                    <TableHead>Expected Return</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkouts.map((checkout) => {
                    const tool = tools.find(t => t.id === checkout.tool_id);
                    const isOverdue = checkout.expected_return_date && 
                      new Date(checkout.expected_return_date) < new Date();
                    
                    return (
                      <TableRow key={checkout.id}>
                        <TableCell>
                          <div className="font-medium">{tool?.tool_name || 'Unknown Tool'}</div>
                        </TableCell>
                        <TableCell>{checkout.worker_name}</TableCell>
                        <TableCell>
                          {new Date(checkout.checkout_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className={isOverdue ? 'text-red-600 font-medium' : ''}>
                            {checkout.expected_return_date ? 
                              new Date(checkout.expected_return_date).toLocaleDateString() : 
                              'No date set'}
                          </div>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={isOverdue ? 'bg-red-500' : 'bg-blue-500'}>
                            {checkout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => returnTool(checkout.tool_id, checkout.id)}
                          >
                            <LogIn className="h-4 w-4 mr-1" />
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check Out Tool</DialogTitle>
          </DialogHeader>
          {selectedTool && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="font-medium">{selectedTool.tool_name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedTool.brand} {selectedTool.model}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="worker_name">Worker Name *</Label>
                <Input
                  id="worker_name"
                  value={checkoutForm.worker_name}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, worker_name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expected_return_date">Expected Return Date</Label>
                <Input
                  id="expected_return_date"
                  type="date"
                  value={checkoutForm.expected_return_date}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, expected_return_date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="checkout_notes">Notes</Label>
                <Textarea
                  id="checkout_notes"
                  value={checkoutForm.checkout_notes}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, checkout_notes: e.target.value }))}
                  placeholder="Any special instructions or notes..."
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={checkoutTool}>
                  Check Out Tool
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}