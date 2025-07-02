// Fleet Management Types

export interface FleetVehicle {
  id: string;
  vehicle_number: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  license_plate?: string;
  vehicle_type: string; // Database stores as string
  status: string; // Database stores as string
  fuel_type: string; // Database stores as string
  current_mileage: number;
  current_engine_hours: number;
  purchase_date?: string;
  purchase_cost?: number;
  current_project_id?: string;
  assigned_driver_id?: string;
  home_yard_location?: string;
  gps_device_id?: string;
  last_gps_update?: string;
  current_location?: any; // Database POINT type
  fuel_capacity?: number;
  current_fuel_level: number;
  insurance_policy_number?: string;
  insurance_expiry?: string;
  registration_expiry?: string;
  inspection_expiry?: string;
  created_at: string;
  updated_at: string;
}

export interface FleetMaintenanceRecord {
  id: string;
  vehicle_id: string;
  maintenance_type: string; // Database stores as string
  service_date: string;
  mileage_at_service?: number;
  engine_hours_at_service?: number;
  description: string;
  performed_by: string;
  shop_name?: string;
  cost: number;
  parts_replaced?: string[];
  next_service_mileage?: number;
  next_service_date?: string;
  warranty_expires?: string;
  invoice_number?: string;
  notes?: string;
  attachments?: string[];
  created_at: string;
}

export interface FleetFuelRecord {
  id: string;
  vehicle_id: string;
  fuel_date: string;
  odometer_reading: number;
  gallons_purchased: number;
  cost_per_gallon: number;
  total_cost: number;
  fuel_station?: string;
  driver_id?: string;
  receipt_photo?: string;
  notes?: string;
  created_at: string;
}

export interface FleetTripLog {
  id: string;
  vehicle_id: string;
  driver_id: string;
  trip_start: string;
  trip_end?: string;
  start_location?: any; // Database POINT type
  end_location?: any; // Database POINT type
  start_mileage: number;
  end_mileage?: number;
  purpose: string;
  project_id?: string;
  total_miles?: number;
  fuel_used?: number;
  route_data?: any; // JSONB for GPS tracking points
  created_at: string;
}

export interface FleetInspection {
  id: string;
  vehicle_id: string;
  inspector_id: string;
  inspection_date: string;
  inspection_type: string; // Database stores as string
  mileage?: number;
  engine_hours?: number;
  overall_condition: string; // Database stores as string
  checklist_items: any; // JSONB for flexible checklist
  defects_found?: string[];
  corrective_actions?: string;
  photos?: string[];
  pass_fail: string; // Database stores as string
  next_inspection_due?: string;
  notes?: string;
  created_at: string;
}

// Fleet Analytics Types
export interface FleetMetrics {
  totalVehicles: number;
  activeVehicles: number;
  availableVehicles: number;
  maintenanceVehicles: number;
  offlineVehicles: number;
  utilizationRate: number;
  averageFuelEfficiency: number;
  totalMaintenanceCost: number;
  overdueMaintenanceCount: number;
}

export interface VehicleMetrics {
  vehicle: FleetVehicle;
  fuelEfficiency: number;
  maintenanceCost: number;
  utilization: number;
  downtime: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  overdueMaintenanceCount: number;
}

// GPS and Location Types
export interface GpsCoordinate {
  lat: number;
  lng: number;
}

export interface VehicleLocation extends GpsCoordinate {
  timestamp: string;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

// Enums
export type VehicleType = 
  | 'truck' 
  | 'van' 
  | 'pickup' 
  | 'equipment' 
  | 'trailer' 
  | 'excavator' 
  | 'bulldozer' 
  | 'crane' 
  | 'loader';

export type VehicleStatus = 
  | 'available' 
  | 'in_use' 
  | 'maintenance' 
  | 'offline' 
  | 'retired';

export type FuelType = 
  | 'diesel' 
  | 'gas' 
  | 'electric' 
  | 'hybrid';

export type MaintenanceType = 
  | 'preventive' 
  | 'repair' 
  | 'inspection' 
  | 'recall';

export type InspectionType = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'annual' 
  | 'dot';

export type OverallCondition = 
  | 'excellent' 
  | 'good' 
  | 'fair' 
  | 'poor';

export type PassFailStatus = 
  | 'pass' 
  | 'fail' 
  | 'conditional';

// Maintenance scheduling types
export interface MaintenanceScheduleItem {
  vehicle: FleetVehicle;
  maintenance_type: MaintenanceType;
  due_date: string;
  due_mileage?: number;
  overdue: boolean;
  days_overdue?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Fleet Dashboard Configuration
export interface FleetDashboardConfig {
  refreshInterval: number; // in seconds
  mapZoomLevel: number;
  defaultMapCenter: GpsCoordinate;
  alertThresholds: {
    fuelLevel: number;
    maintenanceOverdue: number;
    utilizationTarget: number;
  };
}