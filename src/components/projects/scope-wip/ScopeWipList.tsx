
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Eye, Edit, Trash2, Plus, Search, BarChart } from "lucide-react";
import { toast } from "sonner";

// Mock scope/WIP data
const mockScopeItems = [
  {
    id: 'scope-001',
    description: 'Foundation Excavation',
    category: 'earthwork',
    originalValue: 50000,
    currentValue: 55000,
    percentComplete: 85,
    earnedValue: 46750,
    actualCost: 48000,
    status: 'in_progress',
    startDate: '2023-10-01',
    estimatedCompletion: '2023-10-25',
    assignedCrew: 'Excavation Team A'
  },
  {
    id: 'scope-002',
    description: 'Concrete Foundation Pour',
    category: 'concrete',
    originalValue: 75000,
    currentValue: 75000,
    percentComplete: 100,
    earnedValue: 75000,
    actualCost: 73500,
    status: 'completed',
    startDate: '2023-10-15',
    estimatedCompletion: '2023-10-20',
    assignedCrew: 'Concrete Team B'
  },
  {
    id: 'scope-003',
    description: 'Steel Frame Installation',
    category: 'structural',
    originalValue: 120000,
    currentValue: 125000,
    percentComplete: 45,
    earnedValue: 56250,
    actualCost: 58000,
    status: 'in_progress',
    startDate: '2023-10-20',
    estimatedCompletion: '2023-11-15',
    assignedCrew: 'Steel Team C'
  },
  {
    id: 'scope-004',
    description: 'Electrical Rough-in',
    category: 'electrical',
    originalValue: 35000,
    currentValue: 35000,
    percentComplete: 0,
    earnedValue: 0,
    actualCost: 0,
    status: 'pending',
    startDate: '2023-11-10',
    estimatedCompletion: '2023-11-25',
    assignedCrew: 'Electrical Team D'
  }
];

interface ScopeWipListProps {
  projectId: string;
}

const ScopeWipList = ({ projectId }: ScopeWipListProps) => {
  const [scopeItems, setScopeItems] = useState(mockScopeItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filter scope items based on search, category, and status
  const filteredItems = scopeItems.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.assignedCrew.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate project totals
  const projectTotals = scopeItems.reduce((acc, item) => ({
    originalValue: acc.originalValue + item.originalValue,
    currentValue: acc.currentValue + item.currentValue,
    earnedValue: acc.earnedValue + item.earnedValue,
    actualCost: acc.actualCost + item.actualCost
  }), { originalValue: 0, currentValue: 0, earnedValue: 0, actualCost: 0 });

  const overallProgress = projectTotals.currentValue > 0 
    ? (projectTotals.earnedValue / projectTotals.currentValue) * 100 
    : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'delayed':
        return <Badge className="bg-red-500">Delayed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Get category badge
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'earthwork':
        return <Badge variant="outline" className="text-brown-600 border-brown-600">Earthwork</Badge>;
      case 'concrete':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Concrete</Badge>;
      case 'structural':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Structural</Badge>;
      case 'electrical':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Electrical</Badge>;
      case 'plumbing':
        return <Badge variant="outline" className="text-cyan-600 border-cyan-600">Plumbing</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    setScopeItems(scopeItems.filter(item => item.id !== itemId));
    toast.success("Scope item deleted successfully");
  };

  const handleUpdateProgress = (itemId: string, newProgress: number) => {
    const updatedItems = scopeItems.map(item => {
      if (item.id === itemId) {
        const earnedValue = (newProgress / 100) * item.currentValue;
        let status = item.status;
        if (newProgress === 100) status = 'completed';
        else if (newProgress > 0) status = 'in_progress';
        else status = 'pending';
        
        return {
          ...item,
          percentComplete: newProgress,
          earnedValue,
          status
        };
      }
      return item;
    });
    
    setScopeItems(updatedItems);
    toast.success("Progress updated successfully");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Project Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Original Value</p>
              <p className="text-lg font-semibold">{formatCurrency(projectTotals.originalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-lg font-semibold">{formatCurrency(projectTotals.currentValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Earned Value</p>
              <p className="text-lg font-semibold">{formatCurrency(projectTotals.earnedValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actual Cost</p>
              <p className="text-lg font-semibold">{formatCurrency(projectTotals.actualCost)}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Overall Progress</p>
              <p className="text-sm text-muted-foreground">{overallProgress.toFixed(1)}%</p>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scope items..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="earthwork">Earthwork</SelectItem>
              <SelectItem value="concrete">Concrete</SelectItem>
              <SelectItem value="structural">Structural</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scope Items Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Earned Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Crew</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell>{getCategoryBadge(item.category)}</TableCell>
                  <TableCell>{formatCurrency(item.currentValue)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentComplete} className="w-16 h-2" />
                      <span className="text-sm">{item.percentComplete}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.earnedValue)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.assignedCrew}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No scope items found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit' : 'View'} Scope Item
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the scope item details' : 'View the scope item details and progress'}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div>
                <Label>Description</Label>
                <Input value={selectedItem.description} readOnly={!isEditing} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <div className="mt-2">{getCategoryBadge(selectedItem.category)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-2">{getStatusBadge(selectedItem.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Original Value</Label>
                  <Input value={formatCurrency(selectedItem.originalValue)} readOnly />
                </div>
                <div>
                  <Label>Current Value</Label>
                  <Input value={formatCurrency(selectedItem.currentValue)} readOnly={!isEditing} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Earned Value</Label>
                  <Input value={formatCurrency(selectedItem.earnedValue)} readOnly />
                </div>
                <div>
                  <Label>Actual Cost</Label>
                  <Input value={formatCurrency(selectedItem.actualCost)} readOnly={!isEditing} />
                </div>
              </div>

              <div>
                <Label>Progress (%)</Label>
                <div className="mt-2">
                  <div className="flex items-center gap-4">
                    <Progress value={selectedItem.percentComplete} className="flex-1" />
                    <span className="text-sm font-medium">{selectedItem.percentComplete}%</span>
                  </div>
                  {isEditing && (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedItem.percentComplete}
                      className="mt-2"
                      onChange={(e) => {
                        const progress = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                        handleUpdateProgress(selectedItem.id, progress);
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <Label>Assigned Crew</Label>
                <Input value={selectedItem.assignedCrew} readOnly={!isEditing} />
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast.success("Scope item updated successfully");
                    setIsDialogOpen(false);
                  }}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScopeWipList;
