
import { useMemo } from 'react';
import { FleetVehicle } from "@/types/fleet";
import { 
  AlertTriangle, 
  Clock, 
  AlertCircle, 
  TrendingDown, 
  MapPin,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FleetAlertsProps {
  vehicles: FleetVehicle[];
}

const FleetAlerts = ({ vehicles }: FleetAlertsProps) => {
  // Get current date for comparisons
  const currentDate = new Date();
  
  // Find overdue maintenance vehicles
  const overdueMaintenanceVehicles = useMemo(() => {
    return vehicles.filter(vehicle => 
      vehicle.registration_expiry && new Date(vehicle.registration_expiry) < currentDate
    );
  }, [vehicles, currentDate]);
  
  // Generate low utilization alerts (mock data)
  const lowUtilizationVehicles = useMemo(() => {
    // In a real app, this would be based on actual utilization data
    return vehicles
      .filter(v => v.status === 'available')
      .slice(0, 2); // Just take a few vehicles as examples
  }, [vehicles]);
  
  // Mock location alerts
  const locationAlerts = useMemo(() => [
    {
      id: "LOC-001",
      vehicleId: "VEH-001",
      vehicleName: "Dump Truck #1",
      timestamp: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      message: "Vehicle left approved work zone",
      severity: "warning" as const,
      location: { lat: 33.745, lng: -84.390 }
    },
    {
      id: "LOC-002",
      vehicleId: "VEH-004",
      vehicleName: "Grader #1",
      timestamp: new Date(currentDate.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      message: "No location update received",
      severity: "info" as const,
      location: { lat: 33.752, lng: -84.385 }
    }
  ], [currentDate]);
  
  // Mock upcoming maintenance alerts
  const upcomingMaintenanceVehicles = useMemo(() => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    return vehicles.filter(vehicle => 
      vehicle.inspection_expiry && 
      new Date(vehicle.inspection_expiry) > currentDate &&
      new Date(vehicle.inspection_expiry) < oneWeekFromNow
    );
  }, [vehicles, currentDate]);
  
  // Combine all alerts and sort by priority
  const allAlerts = useMemo(() => {
    const alerts = [
      ...overdueMaintenanceVehicles.map(vehicle => ({
        id: `MAINT-OD-${vehicle.id}`,
        type: 'maintenance-overdue' as const,
        vehicle,
        severity: 'high' as const,
        timestamp: currentDate.toISOString()
      })),
      ...upcomingMaintenanceVehicles.map(vehicle => ({
        id: `MAINT-UP-${vehicle.id}`,
        type: 'maintenance-upcoming' as const,
        vehicle,
        severity: 'medium' as const,
        timestamp: currentDate.toISOString()
      })),
      ...lowUtilizationVehicles.map(vehicle => ({
        id: `UTIL-${vehicle.id}`,
        type: 'low-utilization' as const,
        vehicle,
        severity: 'low' as const,
        timestamp: currentDate.toISOString()
      })),
      ...locationAlerts.map(alert => ({
        id: alert.id,
        type: 'location' as const,
        vehicleId: alert.vehicleId,
        vehicleName: alert.vehicleName,
        message: alert.message,
        severity: alert.severity === 'warning' ? 'medium' as const : 'low' as const,
        timestamp: alert.timestamp,
        location: alert.location
      }))
    ];
    
    // Sort by severity (high to low) and then by timestamp (newest first)
    return alerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      
      if (severityDiff !== 0) return severityDiff;
      
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
  }, [overdueMaintenanceVehicles, upcomingMaintenanceVehicles, lowUtilizationVehicles, locationAlerts, currentDate]);
  
  // Handle no alerts case
  if (allAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">All Clear!</h3>
        <p className="text-muted-foreground text-center max-w-md">
          There are currently no alerts for your fleet. All vehicles are operating normally.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Badge className="bg-red-500">{overdueMaintenanceVehicles.length} Overdue</Badge>
        <Badge className="bg-amber-500">{upcomingMaintenanceVehicles.length} Upcoming</Badge>
        <Badge className="bg-blue-500">{lowUtilizationVehicles.length} Utilization</Badge>
        <Badge className="bg-purple-500">{locationAlerts.length} Location</Badge>
      </div>
      
      <div className="space-y-3">
        {allAlerts.map(alert => (
          <Card key={alert.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className={`flex border-l-4 ${
                alert.severity === 'high' ? 'border-red-500' : 
                alert.severity === 'medium' ? 'border-amber-500' : 
                'border-blue-500'
              }`}>
                <div className="p-4 flex-grow">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-1.5 ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-600' : 
                      alert.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {alert.type === 'maintenance-overdue' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : alert.type === 'maintenance-upcoming' ? (
                        <Clock className="h-4 w-4" />
                      ) : alert.type === 'low-utilization' ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">
                          {alert.type === 'location' 
                            ? alert.vehicleName
                            : `${alert.vehicle.make} ${alert.vehicle.model}`
                          }
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-sm mt-0.5">
                        {alert.type === 'maintenance-overdue' && (
                          <>Registration overdue since <span className="font-medium">{alert.vehicle.registration_expiry}</span></>
                        )}
                        {alert.type === 'maintenance-upcoming' && (
                          <>Scheduled inspection on <span className="font-medium">{alert.vehicle.inspection_expiry}</span></>
                        )}
                        {alert.type === 'low-utilization' && (
                          <>Low utilization rate. Vehicle has been <span className="font-medium">available</span> for 7+ days</>
                        )}
                        {alert.type === 'location' && (
                          <>{alert.message}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex items-center">
                  <Button variant="outline" size="sm">
                    {alert.type.includes('maintenance') ? 'Schedule' : 
                     alert.type === 'low-utilization' ? 'Assign' : 'View'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FleetAlerts;
