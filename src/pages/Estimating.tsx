
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { BarChart2, FilePlus, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils'; // Added import for cn function

interface EstimateItem {
  id: string;
  projectName: string;
  client: string;
  date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  totalCost: number;
}

// Mock data for the estimates
const mockEstimates: EstimateItem[] = [
  {
    id: "EST-10001",
    projectName: "GA-400 Repaving",
    client: "Georgia DOT",
    date: "2025-04-10",
    status: "approved",
    totalCost: 1250000
  },
  {
    id: "EST-10002",
    projectName: "I-85 Bridge Repair",
    client: "Georgia DOT",
    date: "2025-04-15",
    status: "submitted",
    totalCost: 875000
  },
  {
    id: "EST-10003",
    projectName: "Peachtree Street Improvements",
    client: "City of Atlanta",
    date: "2025-04-18",
    status: "draft",
    totalCost: 450000
  },
  {
    id: "EST-10004",
    projectName: "Gwinnett County Sidewalk Project",
    client: "Gwinnett County",
    date: "2025-04-22",
    status: "draft",
    totalCost: 325000
  },
  {
    id: "EST-10005",
    projectName: "Augusta Highway Extension",
    client: "Georgia DOT",
    date: "2025-04-25",
    status: "rejected",
    totalCost: 2100000
  }
];

const Estimating = () => {
  const [estimates, setEstimates] = useState<EstimateItem[]>(mockEstimates);
  const [searchTerm, setSearchTerm] = useState("");
  const { authState } = useAuth();
  
  // Filter estimates based on search term
  const filteredEstimates = estimates.filter(estimate => 
    estimate.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate total estimated value
  const totalEstimatedValue = estimates.reduce((acc, curr) => acc + curr.totalCost, 0);
  
  // Get counts by status
  const getCountByStatus = (status: EstimateItem['status']) => 
    estimates.filter(est => est.status === status).length;
  
  // Format currency
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  
  const handleCreateEstimate = () => {
    toast.info("This feature will be available once Supabase integration is set up.");
  };
  
  const handleEditEstimate = (id: string) => {
    toast.info(`Estimate ${id} details will be editable once Supabase integration is set up.`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estimating</h1>
          <p className="text-muted-foreground">Manage cost estimations and bidding processes</p>
        </div>
        <Button onClick={handleCreateEstimate}>
          <FilePlus className="mr-2 h-4 w-4" />
          New Estimate
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Estimated Value</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalEstimatedValue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Across {estimates.length} estimates</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Draft Estimates</CardDescription>
            <CardTitle className="text-2xl">{getCountByStatus('draft')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ready for review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Submitted Estimates</CardDescription>
            <CardTitle className="text-2xl">{getCountByStatus('submitted')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved Estimates</CardDescription>
            <CardTitle className="text-2xl">{getCountByStatus('approved')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ready for execution</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Estimates</CardTitle>
          <CardDescription>View and manage all project estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search estimates..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Estimates Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estimate ID</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstimates.length > 0 ? (
                  filteredEstimates.map((estimate) => (
                    <TableRow key={estimate.id}>
                      <TableCell>{estimate.id}</TableCell>
                      <TableCell>{estimate.projectName}</TableCell>
                      <TableCell>{estimate.client}</TableCell>
                      <TableCell>{estimate.date}</TableCell>
                      <TableCell>
                        <div className={cn(
                          "w-fit rounded-full px-2 py-1 text-xs font-medium",
                          {
                            "bg-yellow-100 text-yellow-800": estimate.status === "draft",
                            "bg-blue-100 text-blue-800": estimate.status === "submitted",
                            "bg-green-100 text-green-800": estimate.status === "approved",
                            "bg-red-100 text-red-800": estimate.status === "rejected",
                          }
                        )}>
                          {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(estimate.totalCost)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditEstimate(estimate.id)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No estimates found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEstimates.length} of {estimates.length} estimates
          </p>
          <p className="text-xs text-muted-foreground italic">
            Construct for Centuries
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Estimating;
