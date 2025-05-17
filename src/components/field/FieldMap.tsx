
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, TruckIcon, User, RefreshCcw } from 'lucide-react';
import { FieldWorker, Equipment } from '@/types/field';

// Enhanced mock data for field workers
const mockWorkers: FieldWorker[] = [
  { 
    id: 'worker1', 
    name: 'John Smith', 
    role: 'Foreman', 
    currentLocation: { 
      lat: 33.753746, 
      lng: -84.386330,
      timestamp: '2025-05-17T09:30:00Z'
    },
    currentProject: 'GA-400 Repaving',
    status: 'active',
    specialty: 'Paving Operations',
    certifications: ['OSHA 30', 'Traffic Control'],
    contactInfo: '404-555-1234'
  },
  { 
    id: 'worker2', 
    name: 'Maria Rodriguez', 
    role: 'Surveyor',
    currentLocation: {
      lat: 33.755246, 
      lng: -84.387530,
      timestamp: '2025-05-17T09:25:00Z'
    },
    currentProject: 'I-85 Bridge Repair',
    status: 'active',
    specialty: 'Survey & Layout',
    certifications: ['PLS', 'Drone Pilot'],
    contactInfo: '404-555-5678'
  },
  { 
    id: 'worker3', 
    name: 'David Williams', 
    role: 'Equipment Operator',
    currentLocation: {
      lat: 33.756546, 
      lng: -84.388430,
      timestamp: '2025-05-17T09:45:00Z'
    },
    currentProject: 'Peachtree Street Improvements',
    status: 'on-break',
    specialty: 'Heavy Equipment',
    certifications: ['CDL', 'Excavator Operator'],
    contactInfo: '404-555-9012'
  },
];

// Enhanced mock data for equipment
const mockEquipment: Equipment[] = [
  { 
    id: 'equip1', 
    name: 'Excavator #103', 
    type: 'Heavy Equipment',
    currentLocation: {
      lat: 33.753946, 
      lng: -84.387130,
      timestamp: '2025-05-17T09:40:00Z'
    },
    currentProject: 'GA-400 Repaving',
    status: 'in-use',
    model: 'CAT 336',
    serialNumber: 'CAT336-78952',
    lastMaintenance: '2025-04-30',
    nextMaintenance: '2025-06-30'
  },
  { 
    id: 'equip2', 
    name: 'Dump Truck #78', 
    type: 'Vehicle',
    currentLocation: {
      lat: 33.756046, 
      lng: -84.384930,
      timestamp: '2025-05-17T09:15:00Z'
    },
    currentProject: 'I-85 Bridge Repair',
    status: 'in-use',
    model: 'Kenworth T880',
    serialNumber: 'KW-T880-45678',
    lastMaintenance: '2025-05-05',
    nextMaintenance: '2025-07-05'
  },
  { 
    id: 'equip3', 
    name: 'Asphalt Paver #12', 
    type: 'Heavy Equipment',
    currentLocation: {
      lat: 33.754846, 
      lng: -84.388230,
      timestamp: '2025-05-17T09:30:00Z'
    },
    currentProject: 'GA-400 Repaving',
    status: 'maintenance',
    model: 'Caterpillar AP655F',
    serialNumber: 'CAT-AP655F-12345',
    lastMaintenance: '2025-05-10',
    nextMaintenance: '2025-06-10'
  },
];

export const FieldMap = () => {
  const [mapApiStatus, setMapApiStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<FieldWorker | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
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
    toast.success("Location data refreshed");
  };

  if (mapApiStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (mapApiStatus === 'error' || showTokenInput) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
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
    <div className="relative h-full">
      {/* This is a placeholder for the actual map */}
      <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Field Location Tracking</h3>
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
              This map shows the current position of field workers and equipment. 
              Select any item below to see more details.
            </p>
            
            <div className="w-full h-48 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-blue-700 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Interactive map would appear here with Mapbox integration</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-left">Field Workers</h4>
              <div className="space-y-3">
                {mockWorkers.map(worker => (
                  <Card 
                    key={worker.id} 
                    className={`p-3 text-left cursor-pointer transition-all hover:shadow-md ${
                      selectedWorker?.id === worker.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedWorker(worker === selectedWorker ? null : worker)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-xs text-gray-500">{worker.role}</p>
                      </div>
                      <div className={`h-3 w-3 rounded-full mt-1 ${
                        worker.status === 'active' ? 'bg-green-500' : 
                        worker.status === 'on-break' ? 'bg-amber-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Project: {worker.currentProject}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Lat: {worker.currentLocation?.lat.toFixed(4)}, Lng: {worker.currentLocation?.lng.toFixed(4)}
                    </p>
                    
                    {selectedWorker?.id === worker.id && (
                      <div className="mt-2 pt-2 border-t text-xs space-y-1">
                        <p><span className="font-medium">Last Update:</span> {formatTimestamp(worker.currentLocation?.timestamp || '')}</p>
                        {worker.specialty && <p><span className="font-medium">Specialty:</span> {worker.specialty}</p>}
                        {worker.certifications && <p><span className="font-medium">Certifications:</span> {worker.certifications.join(', ')}</p>}
                        {worker.contactInfo && <p><span className="font-medium">Contact:</span> {worker.contactInfo}</p>}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-left">Equipment</h4>
              <div className="space-y-3">
                {mockEquipment.map(equip => (
                  <Card 
                    key={equip.id} 
                    className={`p-3 text-left cursor-pointer transition-all hover:shadow-md ${
                      selectedEquipment?.id === equip.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedEquipment(equip === selectedEquipment ? null : equip)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{equip.name}</p>
                        <p className="text-xs text-gray-500">{equip.type}</p>
                      </div>
                      <div className={`h-3 w-3 rounded-full mt-1 ${
                        equip.status === 'in-use' ? 'bg-blue-500' : 
                        equip.status === 'maintenance' ? 'bg-amber-500' : 
                        equip.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Project: {equip.currentProject}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Lat: {equip.currentLocation?.lat.toFixed(4)}, Lng: {equip.currentLocation?.lng.toFixed(4)}
                    </p>
                    
                    {selectedEquipment?.id === equip.id && (
                      <div className="mt-2 pt-2 border-t text-xs space-y-1">
                        <p><span className="font-medium">Last Update:</span> {formatTimestamp(equip.currentLocation?.timestamp || '')}</p>
                        {equip.model && <p><span className="font-medium">Model:</span> {equip.model}</p>}
                        {equip.serialNumber && <p><span className="font-medium">Serial:</span> {equip.serialNumber}</p>}
                        {equip.lastMaintenance && <p><span className="font-medium">Last Maintenance:</span> {equip.lastMaintenance}</p>}
                        {equip.nextMaintenance && <p><span className="font-medium">Next Maintenance:</span> {equip.nextMaintenance}</p>}
                      </div>
                    )}
                  </Card>
                ))}
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

import { toast } from "sonner";
