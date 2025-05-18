
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/finance/StatusBadge';
import { Vehicle, Tool, Dispatch } from '@/types/field';
import { Search, Plus, Truck, Package, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DispatchManagerProps {
  vehicles: Vehicle[];
  tools: Tool[];
}

export function DispatchManager({ vehicles, tools }: DispatchManagerProps) {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock dispatch data - in a real app, this would come from a database
  const [dispatchOrders, setDispatchOrders] = useState<Dispatch[]>([
    {
      id: "DISP-001",
      projectId: "PR-101",
      workOrderId: "WO-501",
      assignedToId: "EMP-201",
      assignedToName: "John Smith",
      description: "Deliver dump truck to I-85 Bridge Repair site",
      priority: "high",
      dueDate: "2025-05-20",
      location: {
        lat: 33.748997,
        lng: -84.387985,
        description: "I-85 Bridge Repair Site"
      },
      status: "pending",
      createdAt: "2025-05-18T08:30:00Z",
      updatedAt: "2025-05-18T08:30:00Z"
    },
    {
      id: "DISP-002",
      projectId: "PR-102",
      workOrderId: "WO-502",
      assignedToId: "EMP-202",
      assignedToName: "Maria Rodriguez",
      description: "Transport motor grader to GA-400 Repaving project",
      priority: "medium",
      dueDate: "2025-05-19",
      location: {
        lat: 33.751897,
        lng: -84.384985,
        description: "GA-400 Repaving Site"
      },
      status: "accepted",
      createdAt: "2025-05-17T14:45:00Z",
      updatedAt: "2025-05-17T15:20:00Z"
    },
    {
      id: "DISP-003",
      projectId: "PR-103",
      assignedToId: "EMP-203",
      assignedToName: "David Williams",
      description: "Deliver concrete tools to I-285 Bridge Project",
      priority: "low",
      dueDate: "2025-05-21",
      location: {
        lat: 33.755897,
        lng: -84.394985,
        description: "I-285 Bridge Project Site"
      },
      status: "completed",
      createdAt: "2025-05-16T09:10:00Z",
      updatedAt: "2025-05-17T16:30:00Z"
    },
    {
      id: "DISP-004",
      projectId: "PR-104",
      workOrderId: "WO-504",
      assignedToId: "EMP-204",
      assignedToName: "Sarah Johnson",
      description: "Relocate portable generator to downtown project",
      priority: "high",
      dueDate: "2025-05-19",
      location: {
        lat: 33.758997,
        lng: -84.377985,
        description: "Downtown Atlanta Construction Site"
      },
      status: "rejected",
      createdAt: "2025-05-17T11:30:00Z",
      updatedAt: "2025-05-17T13:15:00Z"
    }
  ]);

  // Filter dispatch orders by status and search query
  const filteredDispatchOrders = dispatchOrders
    .filter(order => activeTab === 'all' || order.status === activeTab)
    .filter(order => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return order.description.toLowerCase().includes(query) || 
        order.assignedToName.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        (order.location.description && order.location.description.toLowerCase().includes(query));
    });

  // Status styling map for the StatusBadge component
  const statusColorMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'accepted': 'bg-blue-100 text-blue-800 border-blue-300',
    'completed': 'bg-green-100 text-green-800 border-green-300',
    'rejected': 'bg-red-100 text-red-800 border-red-300',
  };

  // Priority styling
  const getPriorityBadge = (priority: string) => {
    let bg = '';
    
    switch(priority) {
      case 'high':
        bg = 'bg-red-100 text-red-800 border-red-300';
        break;
      case 'medium':
        bg = 'bg-amber-100 text-amber-800 border-amber-300';
        break;
      case 'low':
        bg = 'bg-green-100 text-green-800 border-green-300';
        break;
      default:
        bg = 'bg-gray-100 text-gray-800 border-gray-300';
    }
    
    return (
      <StatusBadge status={priority} colorMap={{ [priority]: bg }} />
    );
  };

  // Create a new dispatch entry (mock implementation)
  const handleCreateDispatch = (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const newDispatch: Partial<Dispatch> = {
      id: `DISP-00${dispatchOrders.length + 1}`,
      projectId: formData.get('project') as string,
      description: formData.get('description') as string,
      assignedToId: formData.get('assignee') as string,
      assignedToName: formData.get('assigneeName') as string,
      priority: formData.get('priority') as "low" | "medium" | "high",
      dueDate: formData.get('dueDate') as string,
      location: {
        lat: 33.748997, // In a real app, these would be determined from the project or address
        lng: -84.387985,
        description: formData.get('location') as string
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDispatchOrders([...dispatchOrders, newDispatch as Dispatch]);
    setIsDialogOpen(false);
    
    toast({
      title: "Dispatch created",
      description: "New dispatch order has been created successfully",
    });
  };

  // Update dispatch status (mock implementation)
  const handleUpdateStatus = (id: string, newStatus: 'accepted' | 'completed' | 'rejected') => {
    setDispatchOrders(dispatchOrders.map(order => {
      if (order.id === id) {
        return {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));

    toast({
      title: "Status updated",
      description: `Dispatch order ${id} has been marked as ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dispatch Manager</h2>
          <p className="text-muted-foreground">Manage the dispatching of assets to job sites</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search dispatches..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Dispatch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create Dispatch Order</DialogTitle>
                <DialogDescription>
                  Create a new dispatch order to send assets to a job site
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDispatch}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project" className="text-right">
                      Project
                    </Label>
                    <Select name="project" defaultValue="PR-101">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PR-101">I-85 Bridge Repair</SelectItem>
                        <SelectItem value="PR-102">GA-400 Repaving</SelectItem>
                        <SelectItem value="PR-103">I-285 Bridge Project</SelectItem>
                        <SelectItem value="PR-104">Downtown Atlanta Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      name="description"
                      placeholder="Describe what needs to be dispatched"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignee" className="text-right">
                      Assignee
                    </Label>
                    <Select name="assignee" defaultValue="EMP-201">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMP-201">John Smith</SelectItem>
                        <SelectItem value="EMP-202">Maria Rodriguez</SelectItem>
                        <SelectItem value="EMP-203">David Williams</SelectItem>
                        <SelectItem value="EMP-204">Sarah Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="assigneeName" value="John Smith" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">
                      Due Date
                    </Label>
                    <Input
                      name="dueDate"
                      type="date"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      name="location"
                      placeholder="Location description"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Dispatch</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDispatchOrders.length > 0 ? (
                    filteredDispatchOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.description}</TableCell>
                        <TableCell>{order.assignedToName}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>{new Date(order.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} colorMap={statusColorMap} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {order.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(order.id, 'accepted')}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(order.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {order.status === 'accepted' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(order.id, 'completed')}
                              >
                                Complete
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="p-0 w-8 h-8">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No dispatch orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Available Vehicles</CardTitle>
            <CardDescription>Vehicles ready for dispatch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vehicles
                .filter(vehicle => vehicle.status === 'available')
                .slice(0, 3)
                .map(vehicle => (
                  <div key={vehicle.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-blue-500 mr-2" />
                      <span>{vehicle.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">Dispatch</Button>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">View All Vehicles</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Available Tools</CardTitle>
            <CardDescription>Tools ready for dispatch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tools
                .filter(tool => tool.status === 'available')
                .slice(0, 3)
                .map(tool => (
                  <div key={tool.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-green-500 mr-2" />
                      <span>{tool.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">Dispatch</Button>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">View All Tools</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Upcoming Dispatches</CardTitle>
            <CardDescription>Scheduled for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredDispatchOrders
                .filter(order => order.status === 'pending')
                .slice(0, 3)
                .map(order => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="truncate max-w-[150px]">{order.description}</span>
                    </div>
                    <span className="text-sm">{new Date(order.dueDate).toLocaleDateString()}</span>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">View Schedule</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
