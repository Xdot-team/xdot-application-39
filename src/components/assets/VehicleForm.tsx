import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { Calendar, CalendarDays, Upload, MapPin, Wrench, FileText } from 'lucide-react';

interface VehicleFormData {
  vehicle_number: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  license_plate?: string;
  vehicle_type: string;
  fuel_type: string;
  purchase_date?: string;
  purchase_cost?: number;
  current_mileage?: number;
  current_engine_hours?: number;
  fuel_capacity?: number;
  current_fuel_level?: number;
  status: string;
  home_yard_location?: string;
  gps_device_id?: string;
  insurance_policy_number?: string;
  insurance_expiry?: string;
  registration_expiry?: string;
  inspection_expiry?: string;
}

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: any;
  onSave: () => void;
}

export function VehicleForm({ open, onOpenChange, vehicle, onSave }: VehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicle_number: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vehicle_type: 'pickup',
    fuel_type: 'diesel',
    status: 'available',
    current_fuel_level: 100,
    current_mileage: 0,
    current_engine_hours: 0
  });

  React.useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicle_number: vehicle.vehicle_number || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        vin: vehicle.vin || '',
        license_plate: vehicle.license_plate || '',
        vehicle_type: vehicle.vehicle_type || 'pickup',
        fuel_type: vehicle.fuel_type || 'diesel',
        purchase_date: vehicle.purchase_date || '',
        purchase_cost: vehicle.purchase_cost || 0,
        current_mileage: vehicle.current_mileage || 0,
        current_engine_hours: vehicle.current_engine_hours || 0,
        fuel_capacity: vehicle.fuel_capacity || 0,
        current_fuel_level: vehicle.current_fuel_level || 100,
        status: vehicle.status || 'available',
        home_yard_location: vehicle.home_yard_location || '',
        gps_device_id: vehicle.gps_device_id || '',
        insurance_policy_number: vehicle.insurance_policy_number || '',
        insurance_expiry: vehicle.insurance_expiry || '',
        registration_expiry: vehicle.registration_expiry || '',
        inspection_expiry: vehicle.inspection_expiry || ''
      });
    } else {
      setFormData({
        vehicle_number: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vehicle_type: 'pickup',
        fuel_type: 'diesel',
        status: 'available',
        current_fuel_level: 100,
        current_mileage: 0,
        current_engine_hours: 0
      });
    }
  }, [vehicle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (vehicle?.id) {
        // Update existing vehicle
        const { error } = await supabase
          .from('fleet_vehicles')
          .update(formData)
          .eq('id', vehicle.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Vehicle updated successfully",
        });
      } else {
        // Create new vehicle
        const { error } = await supabase
          .from('fleet_vehicles')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Vehicle created successfully",
        });
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to save vehicle",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    'pickup', 'dump_truck', 'excavator', 'bulldozer', 'grader', 'paver', 
    'roller', 'crane', 'loader', 'backhoe', 'van', 'trailer', 'other'
  ];

  const fuelTypes = ['diesel', 'gasoline', 'electric', 'hybrid', 'propane'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="legal">Legal & Insurance</TabsTrigger>
              <TabsTrigger value="location">Location & GPS</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle_number">Vehicle Number *</Label>
                      <Input
                        id="vehicle_number"
                        value={formData.vehicle_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehicle_number: e.target.value }))}
                        placeholder="e.g., VEH-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                      <Select
                        value={formData.vehicle_type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make *</Label>
                      <Input
                        id="make"
                        value={formData.make}
                        onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                        placeholder="e.g., Caterpillar"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        placeholder="e.g., 336"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="in_use">In Use</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN Number</Label>
                      <Input
                        id="vin"
                        value={formData.vin || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value }))}
                        placeholder="17-character VIN"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license_plate">License Plate</Label>
                      <Input
                        id="license_plate"
                        value={formData.license_plate || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, license_plate: e.target.value }))}
                        placeholder="e.g., GA-12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuel_type">Fuel Type</Label>
                      <Select
                        value={formData.fuel_type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fuelTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuel_capacity">Fuel Capacity (gallons)</Label>
                      <Input
                        id="fuel_capacity"
                        type="number"
                        value={formData.fuel_capacity || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, fuel_capacity: parseFloat(e.target.value) || 0 }))}
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current_mileage">Current Mileage/Hours</Label>
                      <Input
                        id="current_mileage"
                        type="number"
                        value={formData.current_mileage || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, current_mileage: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current_fuel_level">Current Fuel Level (%)</Label>
                      <Input
                        id="current_fuel_level"
                        type="number"
                        value={formData.current_fuel_level || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, current_fuel_level: parseFloat(e.target.value) || 0 }))}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Legal Documents & Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="insurance_policy_number">Insurance Policy Number</Label>
                      <Input
                        id="insurance_policy_number"
                        value={formData.insurance_policy_number || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, insurance_policy_number: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance_expiry">Insurance Expiry Date</Label>
                      <Input
                        id="insurance_expiry"
                        type="date"
                        value={formData.insurance_expiry || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, insurance_expiry: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration_expiry">Registration Expiry Date</Label>
                      <Input
                        id="registration_expiry"
                        type="date"
                        value={formData.registration_expiry || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, registration_expiry: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inspection_expiry">Inspection Expiry Date</Label>
                      <Input
                        id="inspection_expiry"
                        type="date"
                        value={formData.inspection_expiry || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, inspection_expiry: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchase_date">Purchase Date</Label>
                      <Input
                        id="purchase_date"
                        type="date"
                        value={formData.purchase_date || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchase_cost">Purchase Cost ($)</Label>
                      <Input
                        id="purchase_cost"
                        type="number"
                        value={formData.purchase_cost || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, purchase_cost: parseFloat(e.target.value) || 0 }))}
                        step="0.01"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location & GPS Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="home_yard_location">Home Yard Location</Label>
                      <Input
                        id="home_yard_location"
                        value={formData.home_yard_location || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, home_yard_location: e.target.value }))}
                        placeholder="e.g., Main Yard, North Yard"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gps_device_id">GPS Device ID</Label>
                      <Input
                        id="gps_device_id"
                        value={formData.gps_device_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, gps_device_id: e.target.value }))}
                        placeholder="GPS tracker device identifier"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">GPS Status</span>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tracking:</span>
                        <Badge variant={formData.gps_device_id ? "default" : "secondary"}>
                          {formData.gps_device_id ? "Enabled" : "Not Configured"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span className="text-muted-foreground">Live when tracking</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : vehicle ? 'Update' : 'Create'} Vehicle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}