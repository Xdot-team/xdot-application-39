
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Eye, Edit, Trash2, Plus, Search, DollarSign } from "lucide-react";
import { toast } from "sonner";

// Mock change order data
const mockChangeOrders = [
  {
    id: 'co-001',
    number: 'CO-001',
    title: 'Additional Drainage Work',
    description: 'Install additional storm drains per city requirements',
    type: 'addition',
    costImpact: 15000,
    timeImpact: 5,
    status: 'approved',
    requestDate: '2023-10-15',
    approvalDate: '2023-10-18',
    requestedBy: 'Site Engineer'
  },
  {
    id: 'co-002',
    number: 'CO-002',
    title: 'Concrete Specification Change',
    description: 'Change concrete mix design per structural engineer',
    type: 'modification',
    costImpact: -5000,
    timeImpact: 0,
    status: 'pending',
    requestDate: '2023-11-01',
    approvalDate: null,
    requestedBy: 'Project Manager'
  },
  {
    id: 'co-003',
    number: 'CO-003',
    title: 'Remove Landscaping Scope',
    description: 'Owner to handle landscaping separately',
    type: 'deletion',
    costImpact: -25000,
    timeImpact: -10,
    status: 'draft',
    requestDate: null,
    approvalDate: null,
    requestedBy: 'Project Manager'
  }
];

interface ChangeOrderListProps {
  projectId: string;
}

const ChangeOrderList = ({ projectId }: ChangeOrderListProps) => {
  const [changeOrders, setChangeOrders] = useState(mockChangeOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filter change orders based on search and status
  const filteredOrders = changeOrders.filter(order => {
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500">Draft</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'addition':
        return <Badge variant="outline" className="text-green-600 border-green-600">Addition</Badge>;
      case 'modification':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Modification</Badge>;
      case 'deletion':
        return <Badge variant="outline" className="text-red-600 border-red-600">Deletion</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (orderId: string) => {
    setChangeOrders(changeOrders.filter(order => order.id !== orderId));
    toast.success("Change order deleted successfully");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search change orders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Change Orders Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CO Number</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cost Impact</TableHead>
              <TableHead>Time Impact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.number}</TableCell>
                  <TableCell>{order.title}</TableCell>
                  <TableCell>{getTypeBadge(order.type)}</TableCell>
                  <TableCell className={order.costImpact >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(order.costImpact)}
                  </TableCell>
                  <TableCell className={order.timeImpact >= 0 ? "text-orange-600" : "text-green-600"}>
                    {order.timeImpact >= 0 ? `+${order.timeImpact}` : order.timeImpact} days
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.requestDate || 'Not submitted'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
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
                  No change orders found matching your search criteria.
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
              {isEditing ? 'Edit' : 'View'} Change Order - {selectedOrder?.number}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edit the details of this change order' : 'View the details of this change order'}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CO Number</Label>
                  <Input value={selectedOrder.number} readOnly={!isEditing} />
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="mt-2">{getTypeBadge(selectedOrder.type)}</div>
                </div>
              </div>
              
              <div>
                <Label>Title</Label>
                <Input value={selectedOrder.title} readOnly={!isEditing} />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={selectedOrder.description} readOnly={!isEditing} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cost Impact</Label>
                  <Input value={formatCurrency(selectedOrder.costImpact)} readOnly={!isEditing} />
                </div>
                <div>
                  <Label>Time Impact (days)</Label>
                  <Input value={selectedOrder.timeImpact >= 0 ? `+${selectedOrder.timeImpact}` : selectedOrder.timeImpact} readOnly={!isEditing} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-2">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <Label>Requested By</Label>
                  <Input value={selectedOrder.requestedBy} readOnly />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast.success("Change order updated successfully");
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

export default ChangeOrderList;
