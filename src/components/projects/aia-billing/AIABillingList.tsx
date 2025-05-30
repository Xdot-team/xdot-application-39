
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
import { CalendarIcon, Eye, Edit, Trash2, Plus, Search, Download, FileText } from "lucide-react";
import { toast } from "sonner";

// Mock AIA billing data
const mockAIAApplications = [
  {
    id: 'aia-001',
    applicationNumber: 'G702-001',
    period: 'October 2023',
    contractSum: 1500000,
    completedWork: 750000,
    materialsPreviously: 200000,
    materialsPresently: 50000,
    retainage: 75000,
    currentPayment: 525000,
    status: 'approved',
    submitDate: '2023-10-15',
    approvalDate: '2023-10-18'
  },
  {
    id: 'aia-002',
    applicationNumber: 'G702-002',
    period: 'November 2023',
    contractSum: 1500000,
    completedWork: 950000,
    materialsPreviously: 250000,
    materialsPresently: 75000,
    retainage: 95000,
    currentPayment: 730000,
    status: 'pending',
    submitDate: '2023-11-15',
    approvalDate: null
  },
  {
    id: 'aia-003',
    applicationNumber: 'G702-003',
    period: 'December 2023',
    contractSum: 1500000,
    completedWork: 1200000,
    materialsPreviously: 325000,
    materialsPresently: 100000,
    retainage: 120000,
    currentPayment: 955000,
    status: 'draft',
    submitDate: null,
    approvalDate: null
  }
];

interface AIABillingListProps {
  projectId: string;
}

const AIABillingList = ({ projectId }: AIABillingListProps) => {
  const [applications, setApplications] = useState(mockAIAApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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

  const handleView = (app: any) => {
    setSelectedApp(app);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (app: any) => {
    setSelectedApp(app);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (appId: string) => {
    setApplications(applications.filter(app => app.id !== appId));
    toast.success("Application deleted successfully");
  };

  const handleDownload = (app: any) => {
    toast.info(`Downloading ${app.applicationNumber} as PDF`);
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
              placeholder="Search applications..."
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

      {/* Applications Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application #</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Contract Sum</TableHead>
              <TableHead>Completed Work</TableHead>
              <TableHead>Current Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submit Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.applicationNumber}</TableCell>
                  <TableCell>{application.period}</TableCell>
                  <TableCell>{formatCurrency(application.contractSum)}</TableCell>
                  <TableCell>{formatCurrency(application.completedWork)}</TableCell>
                  <TableCell>{formatCurrency(application.currentPayment)}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>{application.submitDate || 'Not submitted'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(application)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(application)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(application)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(application.id)}
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
                  No applications found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit' : 'View'} AIA Application - {selectedApp?.applicationNumber}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edit the details of this AIA G702/G703 application' : 'View the details of this AIA G702/G703 application'}
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Application Number</Label>
                  <Input value={selectedApp.applicationNumber} readOnly={!isEditing} />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input value={selectedApp.period} readOnly={!isEditing} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contract Sum</Label>
                  <Input value={formatCurrency(selectedApp.contractSum)} readOnly={!isEditing} />
                </div>
                <div>
                  <Label>Completed Work</Label>
                  <Input value={formatCurrency(selectedApp.completedWork)} readOnly={!isEditing} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Materials Previously Stored</Label>
                  <Input value={formatCurrency(selectedApp.materialsPreviously)} readOnly={!isEditing} />
                </div>
                <div>
                  <Label>Materials Presently Stored</Label>
                  <Input value={formatCurrency(selectedApp.materialsPresently)} readOnly={!isEditing} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Retainage</Label>
                  <Input value={formatCurrency(selectedApp.retainage)} readOnly={!isEditing} />
                </div>
                <div>
                  <Label>Current Payment Due</Label>
                  <Input value={formatCurrency(selectedApp.currentPayment)} readOnly={!isEditing} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-2">{getStatusBadge(selectedApp.status)}</div>
                </div>
                <div>
                  <Label>Submit Date</Label>
                  <Input value={selectedApp.submitDate || 'Not submitted'} readOnly />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast.success("Application updated successfully");
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

export default AIABillingList;
