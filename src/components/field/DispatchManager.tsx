
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Dispatch } from '@/types/field';
import { cn } from '@/lib/utils';

// Mock data for dispatch records
const mockDispatches: Dispatch[] = [
  {
    id: "DSP-1001",
    projectId: "PRJ-101",
    workOrderId: "WO-3001",
    assignedToId: "worker1",
    assignedToName: "John Smith",
    description: "Inspect milling quality at Station 15+00",
    priority: "high",
    dueDate: "2025-05-18T14:00:00Z",
    location: {
      lat: 33.754246, 
      lng: -84.386830,
      description: "GA-400 Repaving, Station 15+00"
    },
    status: "pending",
    createdAt: "2025-05-17T08:30:00Z",
    updatedAt: "2025-05-17T08:30:00Z"
  },
  {
    id: "DSP-1002",
    projectId: "PRJ-102",
    workOrderId: "WO-3002",
    assignedToId: "worker2",
    assignedToName: "Maria Rodriguez",
    description: "Verify elevation points for expansion joint replacement",
    priority: "medium",
    dueDate: "2025-05-19T11:00:00Z",
    location: {
      lat: 33.755746, 
      lng: -84.387230,
      description: "I-85 Bridge Repair, North Abutment"
    },
    status: "accepted",
    createdAt: "2025-05-17T09:15:00Z",
    updatedAt: "2025-05-17T09:30:00Z"
  },
  {
    id: "DSP-1003",
    projectId: "PRJ-103",
    workOrderId: "WO-3003",
    assignedToId: "worker3",
    assignedToName: "David Williams",
    description: "Prepare site for traffic signal foundation installation",
    priority: "medium",
    dueDate: "2025-05-20T09:00:00Z",
    location: {
      lat: 33.757046, 
      lng: -84.388930,
      description: "Peachtree Street Improvements, 10th Street Intersection"
    },
    status: "completed",
    createdAt: "2025-05-16T14:45:00Z",
    updatedAt: "2025-05-17T10:20:00Z"
  },
  {
    id: "DSP-1004",
    projectId: "PRJ-104",
    assignedToId: "worker1",
    assignedToName: "John Smith",
    description: "Verify ADA ramp slope corrections at Station 5+75",
    priority: "high",
    dueDate: "2025-05-18T16:00:00Z",
    location: {
      lat: 33.982746, 
      lng: -84.076330,
      description: "Gwinnett County Sidewalk Project, Station 5+75"
    },
    status: "pending",
    createdAt: "2025-05-17T11:00:00Z",
    updatedAt: "2025-05-17T11:00:00Z"
  },
  {
    id: "DSP-1005",
    projectId: "PRJ-105",
    workOrderId: "WO-3005",
    assignedToId: "worker3",
    assignedToName: "David Williams",
    description: "Prepare for installation of drainage structure at Station 45+00",
    priority: "low",
    dueDate: "2025-05-21T10:30:00Z",
    location: {
      lat: 33.456546, 
      lng: -82.038430,
      description: "Augusta Highway Extension, Station 45+00"
    },
    status: "rejected",
    createdAt: "2025-05-17T08:00:00Z",
    updatedAt: "2025-05-17T09:45:00Z"
  }
];

export const DispatchManager = () => {
  const [dispatches, setDispatches] = useState<Dispatch[]>(mockDispatches);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter data based on search term
  const filteredDispatches = dispatches.filter(dispatch => 
    dispatch.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.location.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateDispatch = () => {
    toast.info("Dispatch creation functionality will be available once Supabase integration is set up.");
  };
  
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return 'Invalid date';
    }
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

  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    let badgeClasses = "";
    
    switch(status) {
      case 'pending':
        badgeClasses = "bg-yellow-100 text-yellow-800";
        break;
      case 'accepted':
        badgeClasses = "bg-blue-100 text-blue-800";
        break;
      case 'completed':
        badgeClasses = "bg-green-100 text-green-800";
        break;
      case 'rejected':
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
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Field Dispatch</CardTitle>
          <CardDescription>Assign and track tasks for field workers</CardDescription>
        </div>
        <Button onClick={handleCreateDispatch}>
          <Plus className="mr-2 h-4 w-4" />
          Create Dispatch
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dispatches..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Dispatches Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDispatches.length > 0 ? (
                filteredDispatches.map((dispatch) => (
                  <TableRow key={dispatch.id}>
                    <TableCell>{dispatch.id}</TableCell>
                    <TableCell>{dispatch.assignedToName}</TableCell>
                    <TableCell className="max-w-xs truncate">{dispatch.description}</TableCell>
                    <TableCell>{renderPriorityBadge(dispatch.priority)}</TableCell>
                    <TableCell>{formatDateTime(dispatch.dueDate)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{dispatch.location.description || 'GPS Location'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{renderStatusBadge(dispatch.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No dispatches found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredDispatches.length} of {dispatches.length} dispatches
        </p>
        <p className="text-xs text-muted-foreground italic">
          Construct for Centuries
        </p>
      </CardFooter>
    </Card>
  );
};
