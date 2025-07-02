
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FleetVehicle } from "@/types/fleet";
import { MapPin, AlertTriangle } from "lucide-react";

// We need to create a mock interactive map component since we don't have a real map integration
// In a real application, you would use a library like Mapbox or Google Maps

interface FleetMapProps {
  vehicles: FleetVehicle[];
}

const FleetMap = ({ vehicles }: FleetMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  // Calculate map boundaries based on vehicle positions
  const validLocations = vehicles.filter(v => v.current_location);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Map center coordinates (Atlanta, GA area)
  const centerLat = 33.749;
  const centerLng = -84.388;

  return (
    <div className="relative w-full h-full rounded-b-lg overflow-hidden">
      {/* Mock map container */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 bg-[#f3f4f6] dark:bg-[#1a1b26]"
        style={{
          backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${centerLng},${centerLat},9,0/1200x600?access_token=pk.placeholder')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Vehicle markers */}
        {mapReady && validLocations.map((vehicle) => {
          // Calculate position relative to map container  
          // This is a simplified approach for demonstration
          const left = `${Math.random() * 80 + 10}%`;
          const top = `${Math.random() * 80 + 10}%`;
          
          return (
            <div 
              key={vehicle.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
              style={{ left, top }}
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <div className={`p-1 rounded-full ${
                vehicle.status === 'in_use' ? 'bg-blue-500' :
                vehicle.status === 'available' ? 'bg-green-500' :
                vehicle.status === 'maintenance' ? 'bg-amber-500' :
                'bg-red-500'
              }`}>
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                {vehicle.make} {vehicle.model}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vehicle detail popup */}
      {selectedVehicle && (
        <div className="absolute bottom-4 left-4 w-80 z-10">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</h3>
                  <p className="text-xs text-muted-foreground">{selectedVehicle.vehicle_number}</p>
                </div>
                <button onClick={() => setSelectedVehicle(null)} className="text-muted-foreground hover:text-foreground">
                  &times;
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{selectedVehicle.vehicle_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      selectedVehicle.status === 'in_use' ? 'bg-blue-500' :
                      selectedVehicle.status === 'available' ? 'bg-green-500' :
                      selectedVehicle.status === 'maintenance' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                    <span className="capitalize">{selectedVehicle.status.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project:</span>
                  <span>{selectedVehicle.current_project_id || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver:</span>
                  <span>{selectedVehicle.assigned_driver_id || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{selectedVehicle.last_gps_update ? 
                    new Date(selectedVehicle.last_gps_update).toLocaleString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Unknown'}</span>
                </div>
                
                {selectedVehicle.registration_expiry && new Date(selectedVehicle.registration_expiry) < new Date() && (
                  <div className="mt-2 flex items-center p-2 bg-red-500/10 rounded text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-xs font-medium">Registration overdue!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-2">
          <button className="h-8 w-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">+</button>
          <div className="my-1 h-px bg-gray-300 dark:bg-gray-600" />
          <button className="h-8 w-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">−</button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-md shadow-md p-3">
        <div className="text-xs font-medium mb-2">Vehicle Status</div>
        <div className="space-y-1.5">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
            <span className="text-xs">In Use</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-amber-500 mr-2" />
            <span className="text-xs">Maintenance</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
            <span className="text-xs">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetMap;
