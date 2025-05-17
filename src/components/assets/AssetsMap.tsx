
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Truck, RefreshCcw } from 'lucide-react';
import { Vehicle } from '@/types/field';
import { toast } from "sonner";

interface AssetsMapProps {
  vehicles: Vehicle[];
}

export const AssetsMap = ({ vehicles }: AssetsMapProps) => {
  const [mapApiStatus, setMapApiStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    // In a real implementation, this would initialize a map with the Mapbox library
    // For now, we'll just simulate the loading process
    const timer = setTimeout(() => {
      setMapApiStatus('ready');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapConnect = () => {
    setShowTokenInput(true);
  };

  const handleTokenSubmit = () => {
    if (mapboxToken) {
      toast.success("Map token saved. Connecting to Mapbox...");
      // In a real app, we'd initialize Mapbox here
      setShowTokenInput(false);
      setMapApiStatus('ready');
    } else {
      toast.error("Please enter a valid Mapbox token");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handleRefresh = () => {
    // In a real app, this would refresh the location data from the server
    setLastRefresh(new Date().toLocaleTimeString());
    toast.success("Asset location data refreshed");
  };

  if (mapApiStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (mapApiStatus === 'error' || showTokenInput) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="text-center max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
          <p className="text-amber-500 font-medium mb-4">
            {mapApiStatus === 'error' 
              ? "Failed to load map. Please check your API key." 
              : "Mapbox token required to display interactive map"}
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This feature requires Mapbox integration. Please enter your Mapbox public token below.
            </p>
            
            <div className="space-y-2">
              <label htmlFor="mapbox-token" className="text-sm font-medium text-gray-700">
                Mapbox Public Token
              </label>
              <Input 
                id="mapbox-token"
                type="text" 
                value={mapboxToken} 
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="pk.eyJ1Ijoie3VzZXJuYW1lfSIsI..."
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Find your token at <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleTokenSubmit} className="flex-1">
                Connect Map
              </Button>
              <Button variant="outline" onClick={() => setShowTokenInput(false)} className="flex-1">
                Use Demo Mode
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px]">
      {/* This is a placeholder for the actual map */}
      <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Asset Location Tracking</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Last updated: {lastRefresh}</span>
              <Button size="sm" variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button size="sm" onClick={handleMapConnect}>
                <MapPin className="h-4 w-4 mr-1" />
                Connect Map
              </Button>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-70 p-4 rounded-lg mb-6">
            <p className="text-gray-600 mb-4">
              This map shows the current position of vehicles and equipment in the field.
              Select any item below to see more details.
            </p>
            
            <div className="w-full h-64 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-blue-700 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Interactive map would appear here with Mapbox integration</p>
                <p className="text-sm mt-2">Showing real-time locations of {vehicles.filter(v => v.currentLocation).length} active vehicles</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-left">Active Vehicles</h4>
              <div className="space-y-3">
                {vehicles
                  .filter(vehicle => vehicle.currentLocation)
                  .map(vehicle => (
                    <Card 
                      key={vehicle.id} 
                      className={`p-3 text-left cursor-pointer transition-all hover:shadow-md ${
                        selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedVehicle(vehicle === selectedVehicle ? null : vehicle)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-xs text-gray-500">{vehicle.make} {vehicle.model}</p>
                        </div>
                        <div className={`h-3 w-3 rounded-full mt-1 ${
                          vehicle.status === 'in-use' ? 'bg-blue-500' : 
                          vehicle.status === 'available' ? 'bg-green-500' : 
                          vehicle.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Project: {vehicle.currentProject || 'None'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Lat: {vehicle.currentLocation?.lat.toFixed(4)}, Lng: {vehicle.currentLocation?.lng.toFixed(4)}
                      </p>
                      
                      {selectedVehicle?.id === vehicle.id && vehicle.currentLocation && (
                        <div className="mt-2 pt-2 border-t text-xs space-y-1">
                          <p><span className="font-medium">Last Update:</span> {formatTimestamp(vehicle.currentLocation.timestamp)}</p>
                          {vehicle.assignedTo && <p><span className="font-medium">Assigned to:</span> {vehicle.assignedTo}</p>}
                          {vehicle.lastMaintenance && <p><span className="font-medium">Last Maintenance:</span> {vehicle.lastMaintenance}</p>}
                          {vehicle.nextMaintenance && <p><span className="font-medium">Next Maintenance:</span> {vehicle.nextMaintenance}</p>}
                        </div>
                      )}
                    </Card>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
        <p className="italic">Construct for Centuries</p>
      </div>
    </div>
  );
};
