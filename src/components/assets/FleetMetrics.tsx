
import { useMemo } from 'react';
import { FleetVehicle } from "@/types/fleet";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

interface FleetMetricsProps {
  vehicles: FleetVehicle[];
}

const FleetMetrics = ({ vehicles }: FleetMetricsProps) => {
  // Calculate vehicle type distribution
  const vehicleTypeData = useMemo(() => {
    const types: Record<string, number> = {};
    
    vehicles.forEach(vehicle => {
      types[vehicle.vehicle_type] = (types[vehicle.vehicle_type] || 0) + 1;
    });
    
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [vehicles]);
  
  // Generate mock utilization data by vehicle type
  const utilizationByTypeData = useMemo(() => {
    const types: Set<string> = new Set(vehicles.map(v => v.vehicle_type));
    
    return Array.from(types).map(type => {
      const typeVehicles = vehicles.filter(v => v.vehicle_type === type);
      const inUseCount = typeVehicles.filter(v => v.status === 'in_use').length;
      const utilizationRate = (inUseCount / typeVehicles.length) * 100;
      
      return {
        name: type,
        utilization: Math.round(utilizationRate)
      };
    });
  }, [vehicles]);
  
  // Generate mock monthly mileage data
  const monthlyMileageData = [
    { name: 'Jan', mileage: 4200 },
    { name: 'Feb', mileage: 3800 },
    { name: 'Mar', mileage: 5100 },
    { name: 'Apr', mileage: 4700 },
    { name: 'May', mileage: 5300 },
    { name: 'Jun', mileage: 4900 }
  ];
  
  // Generate mock maintenance cost data
  const maintenanceCostData = [
    { name: 'Jan', preventive: 2100, repair: 1200 },
    { name: 'Feb', preventive: 1800, repair: 2300 },
    { name: 'Mar', preventive: 2200, repair: 800 },
    { name: 'Apr', preventive: 2000, repair: 1500 },
    { name: 'May', preventive: 2300, repair: 900 },
    { name: 'Jun', preventive: 1900, repair: 1100 }
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="text-lg mb-4">Fleet Composition</CardTitle>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="text-lg mb-4">Utilization by Vehicle Type</CardTitle>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={utilizationByTypeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                  <Bar dataKey="utilization" fill="#3b82f6" name="Utilization Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="text-lg mb-4">Monthly Mileage Trend</CardTitle>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyMileageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} miles`, 'Mileage']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="mileage" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Total Fleet Mileage" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="text-lg mb-4">Maintenance Costs</CardTitle>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={maintenanceCostData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Legend />
                  <Bar dataKey="preventive" fill="#4ade80" name="Preventive Maintenance" />
                  <Bar dataKey="repair" fill="#f87171" name="Repairs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <CardTitle className="text-lg mb-4">Fleet Status Summary</CardTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">{vehicles.length}</div>
                <div className="text-sm text-muted-foreground">Total Vehicles</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">{vehicles.filter(v => v.status === 'in_use').length}</div>
                <div className="text-sm text-muted-foreground">Currently Active</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">{vehicles.filter(v => v.status === 'maintenance').length}</div>
                <div className="text-sm text-muted-foreground">In Maintenance</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {vehicles.filter(v => v.registration_expiry && new Date(v.registration_expiry) < new Date()).length}
                </div>
                <div className="text-sm text-muted-foreground">Registration Overdue</div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground text-center mt-4">
              Data last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetMetrics;
