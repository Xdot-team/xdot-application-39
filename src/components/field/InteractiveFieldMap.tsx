import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFieldWorkers, useEquipmentTracking, usePunchlistItems, useGPSLocation } from '@/hooks/useFieldOperations';
import { 
  MapPin, 
  Navigation, 
  Users, 
  Truck, 
  AlertTriangle,
  Layers,
  Maximize,
  Minimize,
  RefreshCw,
  Info
} from 'lucide-react';

interface MapViewProps {
  projectId?: string;
}

interface MapMarker {
  id: string;
  type: 'worker' | 'equipment' | 'punchlist' | 'site';
  position: { lat: number; lng: number };
  title: string;
  description: string;
  status: string;
  data: any;
}

export const InteractiveFieldMap = ({ projectId }: MapViewProps) => {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [showWorkers, setShowWorkers] = useState(true);
  const [showEquipment, setShowEquipment] = useState(true);
  const [showPunchlist, setShowPunchlist] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatsPopover, setShowStatsPopover] = useState(false);

  const { fieldWorkers } = useFieldWorkers();
  const { equipment } = useEquipmentTracking(projectId);
  const { punchlistItems } = usePunchlistItems(projectId);
  const { location, watchLocation } = useGPSLocation();

  // Initialize map (using a simple div-based map for now - in production, use Google Maps or Mapbox)
  useEffect(() => {
    if (mapContainer && !map) {
      // Initialize map here
      const newMap = {
        markers: [],
        center: { lat: 33.7490, lng: -84.3880 }, // Atlanta center
        zoom: 12
      };
      setMap(newMap);
    }
  }, [mapContainer, map]);

  // Process data into map markers
  useEffect(() => {
    const newMarkers: MapMarker[] = [];

    // Add field workers
    if (showWorkers) {
      fieldWorkers.forEach((worker: any) => {
        if (worker.current_location) {
          // Parse POINT geometry (simplified for demo)
          const coords = parsePointGeometry(worker.current_location);
          if (coords) {
            newMarkers.push({
              id: `worker-${worker.id}`,
              type: 'worker',
              position: coords,
              title: worker.name,
              description: `${worker.role} - ${worker.status}`,
              status: worker.status,
              data: worker
            });
          }
        }
      });
    }

    // Add equipment
    if (showEquipment) {
      equipment.forEach((eq: any) => {
        if (eq.current_location) {
          const coords = parsePointGeometry(eq.current_location);
          if (coords) {
            newMarkers.push({
              id: `equipment-${eq.id}`,
              type: 'equipment',
              position: coords,
              title: eq.equipment_name,
              description: `${eq.equipment_type} - ${eq.status}`,
              status: eq.status,
              data: eq
            });
          }
        }
      });
    }

    // Add punchlist items
    if (showPunchlist) {
      punchlistItems.forEach((item: any) => {
        if (item.gps_coordinates) {
          const coords = parsePointGeometry(item.gps_coordinates);
          if (coords) {
            newMarkers.push({
              id: `punchlist-${item.id}`,
              type: 'punchlist',
              position: coords,
              title: item.description,
              description: `${item.severity} - ${item.status}`,
              status: item.status,
              data: item
            });
          }
        }
      });
    }

    setMarkers(newMarkers);
  }, [fieldWorkers, equipment, punchlistItems, showWorkers, showEquipment, showPunchlist]);

  // Start/stop location tracking
  const toggleTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      // Stop tracking logic here
    } else {
      setIsTracking(true);
      // Start tracking logic here
      const watchId = watchLocation((newLocation) => {
        console.log('Location updated:', newLocation);
        // Update current user location on map
      });
    }
  };

  // Helper function to parse POINT geometry
  const parsePointGeometry = (pointString: string): { lat: number; lng: number } | null => {
    // This is a simplified parser - in production, use a proper geometry library
    try {
      const match = pointString.match(/POINT\(([^)]+)\)/);
      if (match) {
        const [lng, lat] = match[1].split(' ').map(Number);
        return { lat, lng };
      }
    } catch (error) {
      console.error('Error parsing point geometry:', error);
    }
    return null;
  };

  const getMarkerColor = (marker: MapMarker) => {
    switch (marker.type) {
      case 'worker':
        return marker.status === 'active' ? 'bg-green-500' : 'bg-gray-500';
      case 'equipment':
        return marker.status === 'in-use' ? 'bg-blue-500' : 
               marker.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-500';
      case 'punchlist':
        return marker.data.severity === 'critical' ? 'bg-red-500' : 
               marker.data.severity === 'major' ? 'bg-orange-500' : 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'worker': return <Users className="h-4 w-4" />;
      case 'equipment': return <Truck className="h-4 w-4" />;
      case 'punchlist': return <AlertTriangle className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'major': return 'bg-orange-500';
      case 'minor': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
      {/* Map Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Field Map</h2>
          <p className="text-muted-foreground">
            {markers.length} items on map
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isTracking ? "default" : "outline"}
            onClick={toggleTracking}
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span className="text-sm font-medium">Show:</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showWorkers}
              onChange={(e) => setShowWorkers(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Workers ({fieldWorkers.length})</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showEquipment}
              onChange={(e) => setShowEquipment(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Equipment ({equipment.length})</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPunchlist}
              onChange={(e) => setShowPunchlist(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Issues ({punchlistItems.length})</span>
          </label>
        </div>
      </div>

      {/* Full Width Map Container */}
      <Card className="h-96 lg:h-[600px] relative">
        <CardContent className="p-0 h-full">
          {/* Floating Statistics Button */}
          <Popover open={showStatsPopover} onOpenChange={setShowStatsPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 z-20 shadow-lg"
              >
                <Info className="h-4 w-4 mr-2" />
                Live Status
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Live Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Workers</span>
                    <Badge variant="outline">
                      {fieldWorkers.filter((w: any) => w.status === 'active').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Equipment In Use</span>
                    <Badge variant="outline">
                      {equipment.filter((e: any) => e.status === 'in-use').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Open Issues</span>
                    <Badge variant="outline">
                      {punchlistItems.filter((p: any) => p.status === 'open').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Issues</span>
                    <Badge variant="destructive">
                      {punchlistItems.filter((p: any) => p.severity === 'critical').length}
                    </Badge>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div
            ref={(el) => setMapContainer(el)}
            className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden"
          >
            {/* Simplified map visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
              {/* Grid lines to simulate map */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute w-px bg-gray-300 h-full"
                    style={{ left: `${i * 5}%` }}
                  />
                ))}
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute h-px bg-gray-300 w-full"
                    style={{ top: `${i * 5}%` }}
                  />
                ))}
              </div>

              {/* Map markers */}
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{
                    left: `${Math.random() * 80 + 10}%`, // Random positioning for demo
                    top: `${Math.random() * 80 + 10}%`
                  }}
                  onClick={() => {
                    setSelectedMarker(marker);
                    setShowDetailsDialog(true);
                  }}
                >
                  <div className={`w-8 h-8 rounded-full ${getMarkerColor(marker)} flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform`}>
                    {getMarkerIcon(marker.type)}
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                    {marker.title}
                  </div>
                </div>
              ))}

              {/* Current location indicator */}
              {location && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Marker Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMarker && getMarkerIcon(selectedMarker.type)}
              {selectedMarker?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMarker && (
            <div className="space-y-4">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-3 mt-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Type:</span>
                    <p className="text-sm capitalize">{selectedMarker.type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <p className="text-sm capitalize">{selectedMarker.status}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Description:</span>
                    <p className="text-sm">{selectedMarker.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Coordinates:</span>
                    <p className="text-xs font-mono text-muted-foreground">
                      {selectedMarker.position.lat.toFixed(6)}, {selectedMarker.position.lng.toFixed(6)}
                    </p>
                  </div>
                  
                  {/* Type-specific information */}
                  {selectedMarker.type === 'worker' && (
                    <div className="space-y-2 pt-2 border-t">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Role:</span>
                        <p className="text-sm">{selectedMarker.data.role}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                        <p className="text-sm">{selectedMarker.data.contact_phone || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedMarker.type === 'equipment' && (
                    <div className="space-y-2 pt-2 border-t">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Type:</span>
                        <p className="text-sm">{selectedMarker.data.equipment_type}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Operator:</span>
                        <p className="text-sm">{selectedMarker.data.operator_name || 'Unassigned'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Fuel Level:</span>
                        <p className="text-sm">{selectedMarker.data.fuel_level}%</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedMarker.type === 'punchlist' && (
                    <div className="space-y-2 pt-2 border-t">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Severity:</span>
                        <Badge className={`${getSeverityColor(selectedMarker.data.severity)} text-white text-xs`}>
                          {selectedMarker.data.severity}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Assigned To:</span>
                        <p className="text-sm">{selectedMarker.data.assigned_to}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Due Date:</span>
                        <p className="text-sm">{new Date(selectedMarker.data.due_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-2 mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Navigation className="h-3 w-3 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Update Location
                  </Button>
                  {selectedMarker.type === 'worker' && (
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="h-3 w-3 mr-2" />
                      Contact Worker
                    </Button>
                  )}
                  {selectedMarker.type === 'equipment' && (
                    <Button variant="outline" size="sm" className="w-full">
                      <Truck className="h-3 w-3 mr-2" />
                      View Equipment Log
                    </Button>
                  )}
                  {selectedMarker.type === 'punchlist' && (
                    <Button variant="outline" size="sm" className="w-full">
                      <AlertTriangle className="h-3 w-3 mr-2" />
                      Update Issue
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};