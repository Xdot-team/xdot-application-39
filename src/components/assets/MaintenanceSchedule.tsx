
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Wrench, FileText, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Vehicle, Tool } from '@/types/field';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface MaintenanceScheduleProps {
  vehicles: Vehicle[];
  tools: Tool[];
}

type MaintenanceItem = {
  id: string;
  assetId: string;
  assetName: string;
  assetType: 'vehicle' | 'tool';
  date: string;
  assetDetails: string;
  status: 'scheduled' | 'overdue' | 'completed';
};

export const MaintenanceSchedule = ({ vehicles, tools }: MaintenanceScheduleProps) => {
  // Create a unified maintenance schedule from vehicles and tools
  const createMaintenanceItems = (): MaintenanceItem[] => {
    const items: MaintenanceItem[] = [];
    
    // Add vehicle maintenance
    vehicles.forEach(vehicle => {
      if (vehicle.nextMaintenance) {
        const maintenanceDate = new Date(vehicle.nextMaintenance);
        const today = new Date();
        
        items.push({
          id: `maint-v-${vehicle.id}`,
          assetId: vehicle.id,
          assetName: vehicle.name,
          assetType: 'vehicle',
          date: vehicle.nextMaintenance,
          assetDetails: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
          status: maintenanceDate < today ? 'overdue' : 'scheduled'
        });
      }
    });
    
    // Add tool maintenance
    tools.forEach(tool => {
      if (tool.nextMaintenance) {
        const maintenanceDate = new Date(tool.nextMaintenance);
        const today = new Date();
        
        items.push({
          id: `maint-t-${tool.id}`,
          assetId: tool.id,
          assetName: tool.name,
          assetType: 'tool',
          date: tool.nextMaintenance,
          assetDetails: `${tool.brand} ${tool.model || ''}`,
          status: maintenanceDate < today ? 'overdue' : 'scheduled'
        });
      }
    });
    
    // Add a few completed maintenance items for demonstration
    items.push(
      {
        id: 'maint-v-past1',
        assetId: vehicles[0].id,
        assetName: vehicles[0].name,
        assetType: 'vehicle',
        date: '2025-04-15',
        assetDetails: `${vehicles[0].make} ${vehicles[0].model} (Oil Change)`,
        status: 'completed'
      },
      {
        id: 'maint-t-past1',
        assetId: tools[0].id,
        assetName: tools[0].name,
        assetType: 'tool',
        date: '2025-05-02',
        assetDetails: `${tools[0].brand} (Blade replacement)`,
        status: 'completed'
      }
    );
    
    // Sort by date (overdue first, then by date)
    return items.sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };
  
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(createMaintenanceItems());
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
    
    const sorted = [...maintenanceItems].sort((a, b) => {
      if (field === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (field === 'assetName') {
        return sortDirection === 'asc'
          ? a.assetName.localeCompare(b.assetName)
          : b.assetName.localeCompare(a.assetName);
      } else if (field === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (field === 'assetType') {
        return sortDirection === 'asc'
          ? a.assetType.localeCompare(b.assetType)
          : b.assetType.localeCompare(a.assetType);
      }
      return 0;
    });
    
    setMaintenanceItems(sorted);
  };
  
  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
  };
  
  const handleMarkAsComplete = (id: string) => {
    const updatedItems = maintenanceItems.map(item => 
      item.id === id ? { ...item, status: 'completed' as const } : item
    );
    setMaintenanceItems(updatedItems);
    toast.success("Maintenance marked as completed");
  };
  
  const handleReschedule = (id: string) => {
    // In a real app, this would open a modal to reschedule
    toast.info("Rescheduling feature would open here");
  };
  
  const filteredItems = filterStatus === 'all' 
    ? maintenanceItems 
    : maintenanceItems.filter(item => item.status === filterStatus);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {filterStatus === 'all' ? 'All Status' : 
               filterStatus === 'overdue' ? 'Overdue' :
               filterStatus === 'scheduled' ? 'Scheduled' : 'Completed'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange('all')}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('overdue')}>Overdue</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('scheduled')}>Scheduled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('completed')}>Completed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('assetName')}
              >
                Asset <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('assetType')}
              >
                Type <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('date')}
              >
                Date <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('status')}
              >
                Status <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No maintenance items found with the current filter
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.assetName}</p>
                      <p className="text-xs text-muted-foreground">{item.assetDetails}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {item.assetType === 'vehicle' ? (
                        <span className="capitalize">Vehicle</span>
                      ) : (
                        <span className="capitalize">Tool</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {item.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsComplete(item.id)}
                        >
                          <Wrench className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      {item.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleReschedule(item.id)}
                        >
                          Reschedule
                        </Button>
                      )}
                      {item.status === 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          Details
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
