
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { FilePlus, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import estimate components
import QuickEstimate from '@/components/estimating/QuickEstimate';
import DetailedEstimate from '@/components/estimating/DetailedEstimate';
import VendorEngagement from '@/components/estimating/VendorEngagement';
import CostAnalysis from '@/components/estimating/CostAnalysis';
import { Estimate, EstimateStatus } from '@/types/estimates';

// Mock data for the estimates
const mockEstimates: Estimate[] = [
  {
    id: "EST-10001",
    projectId: "PRJ-001",
    projectName: "GA-400 Repaving",
    client: "Georgia DOT",
    dateCreated: "2025-04-10",
    dateModified: "2025-04-10",
    status: "approved",
    totalCost: 1250000,
    createdBy: "John Smith"
  },
  {
    id: "EST-10002",
    projectId: "PRJ-002",
    projectName: "I-85 Bridge Repair",
    client: "Georgia DOT",
    dateCreated: "2025-04-15",
    dateModified: "2025-04-15",
    status: "submitted",
    totalCost: 875000,
    createdBy: "Sarah Johnson"
  },
  {
    id: "EST-10003",
    projectId: "PRJ-003",
    projectName: "Peachtree Street Improvements",
    client: "City of Atlanta",
    dateCreated: "2025-04-18",
    dateModified: "2025-04-18",
    status: "draft",
    totalCost: 450000,
    createdBy: "Robert Williams"
  },
  {
    id: "EST-10004",
    projectId: "PRJ-004",
    projectName: "Gwinnett County Sidewalk Project",
    client: "Gwinnett County",
    dateCreated: "2025-04-22",
    dateModified: "2025-04-22",
    status: "draft",
    totalCost: 325000,
    createdBy: "Emily Davis"
  },
  {
    id: "EST-10005",
    projectId: "PRJ-005",
    projectName: "Augusta Highway Extension",
    client: "Georgia DOT",
    dateCreated: "2025-04-25",
    dateModified: "2025-04-25",
    status: "rejected",
    totalCost: 2100000,
    createdBy: "Michael Brown"
  }
];

const Estimating = () => {
  const [estimates, setEstimates] = useState<Estimate[]>(mockEstimates);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("estimates");
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
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
  const getCountByStatus = (status: EstimateStatus) => 
    estimates.filter(est => est.status === status).length;
  
  // Format currency
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  
  const handleCreateEstimate = () => {
    setActiveTab("quickEstimate");
    toast.info("Creating a new estimate.");
  };
  
  const handleEstimateSelect = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setActiveTab("detailedEstimate");
    toast.info(`Viewing estimate ${estimate.id} details.`);
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
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="estimates">Estimates List</TabsTrigger>
          <TabsTrigger value="quickEstimate">Quick Estimate</TabsTrigger>
          <TabsTrigger value="detailedEstimate">Detailed Estimate</TabsTrigger>
          <TabsTrigger value="vendorEngagement">Vendor Engagement</TabsTrigger>
          <TabsTrigger value="costAnalysis">Cost Analysis</TabsTrigger>
        </TabsList>

        {/* Estimates List Tab */}
        <TabsContent value="estimates">
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Estimate ID</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Project Name</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Client</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Total Cost</th>
                      <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEstimates.length > 0 ? (
                      filteredEstimates.map((estimate) => (
                        <tr key={estimate.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-2 align-middle">{estimate.id}</td>
                          <td className="p-2 align-middle">{estimate.projectName}</td>
                          <td className="p-2 align-middle">{estimate.client}</td>
                          <td className="p-2 align-middle">{estimate.dateModified}</td>
                          <td className="p-2 align-middle">
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
                          </td>
                          <td className="p-2 align-middle text-right">{formatCurrency(estimate.totalCost)}</td>
                          <td className="p-2 align-middle text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEstimateSelect(estimate)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          No estimates found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <div className="border-t px-6 py-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredEstimates.length} of {estimates.length} estimates
              </p>
              <p className="text-xs text-muted-foreground italic">
                Construct for Centuries
              </p>
            </div>
          </Card>
        </TabsContent>
        
        {/* Quick Estimate Tab */}
        <TabsContent value="quickEstimate">
          <QuickEstimate />
        </TabsContent>
        
        {/* Detailed Estimate Tab */}
        <TabsContent value="detailedEstimate">
          <DetailedEstimate />
        </TabsContent>
        
        {/* Vendor Engagement Tab */}
        <TabsContent value="vendorEngagement">
          <VendorEngagement />
        </TabsContent>
        
        {/* Cost Analysis Tab */}
        <TabsContent value="costAnalysis">
          <CostAnalysis />
        </TabsContent>
      </Tabs>
      
      <footer className="text-center py-4 text-xs text-muted-foreground italic">
        Construct for Centuries
      </footer>
    </div>
  );
};

export default Estimating;
