
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { FileText, Search, MapPin, CheckSquare, ClipboardCheck, Truck, Clock } from 'lucide-react';

// Types for field data
interface SiteVisit {
  id: string;
  date: string;
  project: string;
  inspector: string;
  notes: string;
  status: 'completed' | 'pending' | 'needs-review';
}

interface PunchlistItem {
  id: string;
  project: string;
  location: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'closed';
}

interface WorkOrder {
  id: string;
  project: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// Mock data
const mockSiteVisits: SiteVisit[] = [
  {
    id: "SV-1001",
    date: "2025-05-15",
    project: "GA-400 Repaving",
    inspector: "John Smith",
    notes: "Initial site survey completed. Area marked for utility locates.",
    status: 'completed'
  },
  {
    id: "SV-1002",
    date: "2025-05-14",
    project: "I-85 Bridge Repair",
    inspector: "Maria Rodriguez",
    notes: "Structural assessment completed. Identified 3 critical repair areas.",
    status: 'needs-review'
  },
  {
    id: "SV-1003",
    date: "2025-05-13",
    project: "Peachtree Street Improvements",
    inspector: "David Williams",
    notes: "Sidewalk condition assessment. Multiple ADA compliance issues identified.",
    status: 'completed'
  },
  {
    id: "SV-1004",
    date: "2025-05-16",
    project: "Gwinnett County Sidewalk Project",
    inspector: "Sarah Johnson",
    notes: "Pre-construction meeting with utilities. Need to relocate water main.",
    status: 'pending'
  },
  {
    id: "SV-1005",
    date: "2025-05-12",
    project: "Augusta Highway Extension",
    inspector: "Robert Chen",
    notes: "Environmental review completed. Wetland mitigation plan required.",
    status: 'completed'
  }
];

const mockPunchlistItems: PunchlistItem[] = [
  {
    id: "PL-2001",
    project: "GA-400 Repaving",
    location: "Station 14+50",
    description: "Edge of pavement showing raveling",
    assignedTo: "Paving Crew A",
    dueDate: "2025-05-20",
    status: 'open'
  },
  {
    id: "PL-2002",
    project: "GA-400 Repaving",
    location: "Station 23+75",
    description: "Drainage inlet not at proper elevation",
    assignedTo: "Drainage Crew",
    dueDate: "2025-05-19",
    status: 'in-progress'
  },
  {
    id: "PL-2003",
    project: "I-85 Bridge Repair",
    location: "Abutment B",
    description: "Concrete spalling not fully removed",
    assignedTo: "Bridge Crew B",
    dueDate: "2025-05-18",
    status: 'closed'
  },
  {
    id: "PL-2004",
    project: "I-85 Bridge Repair",
    location: "Expansion Joint #3",
    description: "Joint material improperly installed",
    assignedTo: "Bridge Crew A",
    dueDate: "2025-05-17",
    status: 'open'
  },
  {
    id: "PL-2005",
    project: "Peachtree Street Improvements",
    location: "Intersection with 10th St",
    description: "ADA ramp slope exceeds 8.33%",
    assignedTo: "Concrete Crew",
    dueDate: "2025-05-18",
    status: 'open'
  },
  {
    id: "PL-2006",
    project: "Peachtree Street Improvements",
    location: "Mid-block crossing",
    description: "Tactile warning strip not aligned properly",
    assignedTo: "Concrete Crew",
    dueDate: "2025-05-19",
    status: 'in-progress'
  },
  {
    id: "PL-2007",
    project: "Gwinnett County Sidewalk Project",
    location: "Station 5+25",
    description: "Sidewalk width less than 5 feet",
    assignedTo: "Concrete Crew B",
    dueDate: "2025-05-22",
    status: 'open'
  },
  {
    id: "PL-2008",
    project: "Gwinnett County Sidewalk Project",
    location: "Station 10+50",
    description: "Tree root damage to new sidewalk",
    assignedTo: "Landscape Crew",
    dueDate: "2025-05-21",
    status: 'in-progress'
  },
  {
    id: "PL-2009",
    project: "Augusta Highway Extension",
    location: "Station 42+00",
    description: "Guardrail height incorrect",
    assignedTo: "Guardrail Crew",
    dueDate: "2025-05-17",
    status: 'closed'
  },
  {
    id: "PL-2010",
    project: "Augusta Highway Extension",
    location: "Culvert #4",
    description: "Erosion control measures insufficient",
    assignedTo: "Erosion Control Team",
    dueDate: "2025-05-16",
    status: 'closed'
  }
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-3001",
    project: "GA-400 Repaving",
    description: "Mill and overlay section from Station 10+00 to 20+00",
    assignedTo: "Paving Crew A",
    priority: 'high',
    dueDate: "2025-05-18",
    status: 'in-progress'
  },
  {
    id: "WO-3002",
    project: "I-85 Bridge Repair",
    description: "Replace expansion joints at north abutment",
    assignedTo: "Bridge Crew A",
    priority: 'medium',
    dueDate: "2025-05-20",
    status: 'pending'
  },
  {
    id: "WO-3003",
    project: "Peachtree Street Improvements",
    description: "Install new traffic signal at 10th Street intersection",
    assignedTo: "Traffic Signal Crew",
    priority: 'high',
    dueDate: "2025-05-25",
    status: 'pending'
  },
  {
    id: "WO-3004",
    project: "Gwinnett County Sidewalk Project",
    description: "Pour concrete for sidewalk section 3",
    assignedTo: "Concrete Crew B",
    priority: 'medium',
    dueDate: "2025-05-19",
    status: 'completed'
  },
  {
    id: "WO-3005",
    project: "Augusta Highway Extension",
    description: "Install drainage structures from Station 40+00 to 50+00",
    assignedTo: "Drainage Crew",
    priority: 'low',
    dueDate: "2025-05-30",
    status: 'in-progress'
  }
];

const FieldTools = () => {
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(mockSiteVisits);
  const [punchlistItems, setPunchlistItems] = useState<PunchlistItem[]>(mockPunchlistItems);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const { authState } = useAuth();
  
  // Filter data based on search term
  const filteredSiteVisits = siteVisits.filter(visit => 
    visit.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPunchlistItems = punchlistItems.filter(item => 
    item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredWorkOrders = workOrders.filter(order => 
    order.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get counts for statistics
  const openPunchlistItems = punchlistItems.filter(item => item.status === 'open').length;
  const pendingWorkOrders = workOrders.filter(order => order.status === 'pending').length;
  const completedSiteVisits = siteVisits.filter(visit => visit.status === 'completed').length;
  
  const handleNewSiteVisit = () => {
    toast.info("Site visit functionality will be available once Supabase integration is set up.");
  };
  
  const handleAddPunchlistItem = () => {
    toast.info("Punchlist management will be available once Supabase integration is set up.");
  };
  
  const handleCreateWorkOrder = () => {
    toast.info("Work order creation will be available once Supabase integration is set up.");
  };
  
  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    let badgeClasses = "";
    
    switch(status) {
      case 'open':
      case 'pending':
        badgeClasses = "bg-yellow-100 text-yellow-800";
        break;
      case 'in-progress':
        badgeClasses = "bg-blue-100 text-blue-800";
        break;
      case 'closed':
      case 'completed':
        badgeClasses = "bg-green-100 text-green-800";
        break;
      case 'needs-review':
        badgeClasses = "bg-red-100 text-red-800";
        break;
      default:
        badgeClasses = "bg-gray-100 text-gray-800";
    }
    
    return (
      <div className={cn(
        "w-fit rounded-full px-2 py-1 text-xs font-medium",
        badgeClasses
      )}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </div>
    );
  };
  
  // Priority badge renderer
  const renderPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    let badgeClasses = "";
    
    switch(priority) {
      case 'low':
        badgeClasses = "bg-blue-100 text-blue-800";
        break;
      case 'medium':
        badgeClasses = "bg-yellow-100 text-yellow-800";
        break;
      case 'high':
        badgeClasses = "bg-red-100 text-red-800";
        break;
      default:
        badgeClasses = "bg-gray-100 text-gray-800";
    }
    
    return (
      <div className={cn(
        "w-fit rounded-full px-2 py-1 text-xs font-medium",
        badgeClasses
      )}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Field Tools</h1>
          <p className="text-muted-foreground">Manage site visits, punchlists, and field operations</p>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardDescription>Open Punchlist Items</CardDescription>
              <CardTitle className="text-2xl">{openPunchlistItems}</CardTitle>
            </div>
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Across all active projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardDescription>Pending Work Orders</CardDescription>
              <CardTitle className="text-2xl">{pendingWorkOrders}</CardTitle>
            </div>
            <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardDescription>Recent Site Visits</CardDescription>
              <CardTitle className="text-2xl">{completedSiteVisits}</CardTitle>
            </div>
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Completed in the last 7 days</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different tools */}
      <Tabs defaultValue="site-visits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="site-visits">Site Visits</TabsTrigger>
          <TabsTrigger value="punchlist">Punchlist</TabsTrigger>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
        </TabsList>
        
        {/* Site Visits Tab */}
        <TabsContent value="site-visits">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Site Visits</CardTitle>
                <CardDescription>Track and manage site inspections</CardDescription>
              </div>
              <Button onClick={handleNewSiteVisit}>
                <MapPin className="mr-2 h-4 w-4" />
                New Site Visit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search site visits..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Site Visits Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSiteVisits.length > 0 ? (
                      filteredSiteVisits.map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell>{visit.id}</TableCell>
                          <TableCell>{visit.date}</TableCell>
                          <TableCell>{visit.project}</TableCell>
                          <TableCell>{visit.inspector}</TableCell>
                          <TableCell className="max-w-xs truncate">{visit.notes}</TableCell>
                          <TableCell>{renderStatusBadge(visit.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No site visits found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Punchlist Tab */}
        <TabsContent value="punchlist">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Punchlist Items</CardTitle>
                <CardDescription>Track defects and corrections needed</CardDescription>
              </div>
              <Button onClick={handleAddPunchlistItem}>
                <CheckSquare className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search punchlist items..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Punchlist Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPunchlistItems.length > 0 ? (
                      filteredPunchlistItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.project}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                          <TableCell>{item.assignedTo}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell>{renderStatusBadge(item.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No punchlist items found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Work Orders Tab */}
        <TabsContent value="work-orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Work Orders</CardTitle>
                <CardDescription>Manage and assign tasks to field crews</CardDescription>
              </div>
              <Button onClick={handleCreateWorkOrder}>
                <FileText className="mr-2 h-4 w-4" />
                Create Work Order
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search work orders..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Work Orders Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkOrders.length > 0 ? (
                      filteredWorkOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.project}</TableCell>
                          <TableCell className="max-w-xs truncate">{order.description}</TableCell>
                          <TableCell>{order.assignedTo}</TableCell>
                          <TableCell>{renderPriorityBadge(order.priority)}</TableCell>
                          <TableCell>{order.dueDate}</TableCell>
                          <TableCell>{renderStatusBadge(order.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No work orders found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredWorkOrders.length} of {workOrders.length} work orders
              </p>
              <p className="text-xs text-muted-foreground italic">
                Construct for Centuries
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-xs text-muted-foreground mt-8">
        <p>For full functionality including location tracking, dispatch management, and offline support, Supabase integration is required.</p>
      </div>
    </div>
  );
};

export default FieldTools;
