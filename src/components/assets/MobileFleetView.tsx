
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Truck, 
  Wrench, 
  Package, 
  Clock,
  AlertTriangle,
  Filter,
  FileText,
  Smartphone
} from "lucide-react";
import { FleetVehicle } from "@/types/fleet";
import FleetMap from "./FleetMap";

interface MobileFleetViewProps {
  vehicles: FleetVehicle[];
}

const MobileFleetView = ({ vehicles }: MobileFleetViewProps) => {
  const [activeView, setActiveView] = useState<'map' | 'list' | 'requests'>('map');
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [offlineRequests, setOfflineRequests] = useState<any[]>([
    { id: 'REQ-001', type: 'Tool', name: 'Concrete Saw', status: 'pending', timestamp: '2025-05-17T14:30:00Z' },
    { id: 'REQ-002', type: 'Material', name: 'Portland Cement', quantity: '5 bags', status: 'syncing', timestamp: '2025-05-17T15:45:00Z' }
  ]);
  
  // Find vehicles with maintenance issues
  const vehiclesNeedingAttention = vehicles.filter(v => 
    v.status === 'maintenance' || 
    (v.registration_expiry && new Date(v.registration_expiry) < new Date())
  );
  
  // Request form state
  const [requestForm, setRequestForm] = useState({
    type: 'tool',
    item: '',
    quantity: '1',
    project: '',
    urgency: 'normal',
    notes: ''
  });
  
  // Toggle between views
  const handleViewChange = (view: 'map' | 'list' | 'requests') => {
    setActiveView(view);
    setSelectedVehicle(null);
  };
  
  // Handle request submission
  const handleSubmitRequest = () => {
    const newRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: requestForm.type === 'tool' ? 'Tool' : 'Material',
      name: requestForm.item,
      quantity: requestForm.quantity,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    setOfflineRequests([newRequest, ...offlineRequests]);
    setRequestForm({
      type: 'tool',
      item: '',
      quantity: '1',
      project: '',
      urgency: 'normal',
      notes: ''
    });
    
    // Show success message (would be implemented with toast in a real app)
    alert('Request submitted and will sync when online');
  };
  
  return (
    <div className="space-y-4">
      {/* Mobile navigation */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-medium">Fleet Mobile</h2>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
          Online
        </Badge>
      </div>
      
      {/* Tab buttons */}
      <div className="flex border rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 px-3 text-sm flex justify-center items-center gap-1.5 ${
            activeView === 'map' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
          onClick={() => handleViewChange('map')}
        >
          <MapPin className="h-4 w-4" />
          <span>Map</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm flex justify-center items-center gap-1.5 ${
            activeView === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
          onClick={() => handleViewChange('list')}
        >
          <Truck className="h-4 w-4" />
          <span>Vehicles</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm flex justify-center items-center gap-1.5 ${
            activeView === 'requests' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
          onClick={() => handleViewChange('requests')}
        >
          <Package className="h-4 w-4" />
          <span>Requests</span>
          {offlineRequests.length > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {offlineRequests.length}
            </Badge>
          )}
        </button>
      </div>
      
      {/* Map View */}
      {activeView === 'map' && (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 h-[400px]">
              <FleetMap vehicles={vehicles} />
            </CardContent>
          </Card>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              <span>Vehicles Needing Attention</span>
            </h3>
            
            {vehiclesNeedingAttention.length > 0 ? (
              <div className="space-y-2">
                {vehiclesNeedingAttention.map(vehicle => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                          <div className="text-xs text-muted-foreground">{vehicle.vehicle_type}</div>
                        </div>
                        <div className="flex items-center">
                          <Badge className={vehicle.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'}>
                            {vehicle.status === 'maintenance' ? 'Maintenance' : 'Overdue'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No maintenance issues found
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Vehicle List View */}
      {activeView === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">All Vehicles ({vehicles.length})</div>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Filter</span>
            </Button>
          </div>
          
          <div className="space-y-2">
            {vehicles.map(vehicle => (
              <Card 
                key={vehicle.id} 
                className={`overflow-hidden cursor-pointer ${
                  selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedVehicle(selectedVehicle?.id === vehicle.id ? null : vehicle)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                      <div className="text-xs text-muted-foreground">{vehicle.vehicle_type}</div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-1.5 ${
                        vehicle.status === 'in-use' ? 'bg-blue-500' :
                        vehicle.status === 'available' ? 'bg-green-500' :
                        vehicle.status === 'maintenance' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-xs capitalize">{vehicle.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                  
                  {selectedVehicle?.id === vehicle.id && (
                    <div className="mt-2 pt-2 border-t text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Location</div>
                          <div className="text-xs">{vehicle.currentProject || 'Unknown'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Assigned To</div>
                          <div className="text-xs">{vehicle.assignedTo || 'Unassigned'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Last Maintenance</div>
                          <div className="text-xs">{vehicle.lastMaintenance || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Next Maintenance</div>
                          <div className={`text-xs ${
                            vehicle.nextMaintenance && new Date(vehicle.nextMaintenance) < new Date() 
                              ? 'text-red-500 font-medium' 
                              : ''
                          }`}>
                            {vehicle.nextMaintenance || 'Not scheduled'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button variant="default" size="sm" className="flex-1 h-8">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">Locate</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-8">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">Details</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Requests View */}
      {activeView === 'requests' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Request Tool or Material</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleSubmitRequest(); }}>
                <div>
                  <label className="block text-sm font-medium mb-1">Request Type</label>
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-sm ${requestForm.type === 'tool' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setRequestForm({...requestForm, type: 'tool'})}
                    >
                      Tool
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-sm ${requestForm.type === 'material' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setRequestForm({...requestForm, type: 'material'})}
                    >
                      Material
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {requestForm.type === 'tool' ? 'Tool Name' : 'Material Name'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={requestForm.type === 'tool' ? 'e.g., Concrete Saw' : 'e.g., Portland Cement'}
                    value={requestForm.item}
                    onChange={(e) => setRequestForm({...requestForm, item: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 1, 5 bags, 10 yards"
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Project</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={requestForm.project}
                    onChange={(e) => setRequestForm({...requestForm, project: e.target.value})}
                    required
                  >
                    <option value="">Select a project</option>
                    <option value="I-85 Bridge Repair">I-85 Bridge Repair</option>
                    <option value="GA-400 Repaving">GA-400 Repaving</option>
                    <option value="I-75 Resurfacing">I-75 Resurfacing</option>
                    <option value="I-285 Bridge">I-285 Bridge Project</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Urgency</label>
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-xs ${requestForm.urgency === 'low' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setRequestForm({...requestForm, urgency: 'low'})}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-xs ${requestForm.urgency === 'normal' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setRequestForm({...requestForm, urgency: 'normal'})}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-xs ${requestForm.urgency === 'high' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      onClick={() => setRequestForm({...requestForm, urgency: 'high'})}
                    >
                      Urgent
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Additional details about your request"
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})}
                  />
                </div>
                
                <Button type="submit" className="w-full">Submit Request</Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Recent Requests</span>
            </h3>
            
            {offlineRequests.length > 0 ? (
              <div className="space-y-2">
                {offlineRequests.map(request => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{request.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs px-1.5">
                              {request.type}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {request.quantity && `Qty: ${request.quantity} • `}
                            {new Date(request.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Badge className={
                          request.status === 'pending' ? 'bg-amber-500' : 
                          request.status === 'syncing' ? 'bg-blue-500' : 
                          request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        }>
                          {request.status === 'syncing' ? 'Syncing...' : request.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No recent requests
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFleetView;
