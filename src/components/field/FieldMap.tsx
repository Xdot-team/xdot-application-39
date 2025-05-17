
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

// Mock data for field workers and equipment
const mockWorkers = [
  { id: 'worker1', name: 'John Smith', role: 'Foreman', lat: 33.753746, lng: -84.386330 },
  { id: 'worker2', name: 'Maria Rodriguez', role: 'Surveyor', lat: 33.755246, lng: -84.387530 },
  { id: 'worker3', name: 'David Williams', role: 'Equipment Operator', lat: 33.756546, lng: -84.388430 },
];

const mockEquipment = [
  { id: 'equip1', name: 'Excavator #103', type: 'Heavy Equipment', lat: 33.753946, lng: -84.387130 },
  { id: 'equip2', name: 'Dump Truck #78', type: 'Vehicle', lat: 33.756046, lng: -84.384930 },
];

export const FieldMap = () => {
  const [mapApiStatus, setMapApiStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    // In a real implementation, this would initialize a map with the Mapbox library
    // For now, we'll just simulate the loading process
    const timer = setTimeout(() => {
      setMapApiStatus('ready');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  if (mapApiStatus === 'error') {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">Failed to load map. Please check your API key.</p>
          <p className="mt-2 text-sm text-gray-600">
            This feature requires Mapbox integration. Please connect to Supabase to enable full functionality.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* This is a placeholder for the actual map */}
      <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h3 className="font-medium text-lg mb-2">Map View</h3>
          <p className="text-gray-600 mb-4">
            Real-time location tracking requires Mapbox and Supabase integration.
            Once connected, this will display the current positions of workers and equipment.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Field Workers</h4>
              <div className="space-y-2">
                {mockWorkers.map(worker => (
                  <Card key={worker.id} className="p-2 text-left">
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-xs text-gray-500">{worker.role}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Lat: {worker.lat.toFixed(4)}, Lng: {worker.lng.toFixed(4)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Equipment</h4>
              <div className="space-y-2">
                {mockEquipment.map(equip => (
                  <Card key={equip.id} className="p-2 text-left">
                    <p className="font-medium">{equip.name}</p>
                    <p className="text-xs text-gray-500">{equip.type}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Lat: {equip.lat.toFixed(4)}, Lng: {equip.lng.toFixed(4)}
                    </p>
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
