import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  FileText, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench,
  MapPin,
  Package,
  Truck,
  PackageOpen,
  CalendarClock,
  ArrowUpDown,
  Filter,
  SendToBack
} from 'lucide-react';
import { Vehicle, Tool, Material } from '@/types/field';
import { AssetsMap } from '@/components/assets/AssetsMap';
import { AssetDetails } from '@/components/assets/AssetDetails';
import { MaintenanceSchedule } from '@/components/assets/MaintenanceSchedule';
import { DispatchManager } from '@/components/assets/DispatchManager';

const mockVehicles: Vehicle[] = [
  {
    id: "VEH-001",
    name: "Dump Truck #1",
    type: "Dump Truck",
    make: "Kenworth",
    model: "T880",
    year: 2023,
    licensePlate: "GA-12345",
    vin: "1GCHK29U02E123456",
    status: "in-use",
    currentLocation: {
      lat: 33.748997,
      lng: -84.387985,
      timestamp: "2025-05-17T08:30:00Z"
    },
    currentProject: "I-85 Bridge Repair",
    lastMaintenance: "2025-04-15",
    nextMaintenance: "2025-06-15",
    assignedTo: "John Smith",
    fuelLevel: 0.75,
    mileage: 12500,
  },
  {
    id: "VEH-002",
    name: "Excavator #2",
    type: "Excavator",
    make: "Caterpillar",
    model: "336",
    year: 2022,
    licensePlate: "N/A",
    vin: "CAT336X123456789",
    status: "available",
    currentLocation: {
      lat: 33.749897,
      lng: -84.389985,
      timestamp: "2025-05-17T09:15:00Z"
    },
    currentProject: null,
    lastMaintenance: "2025-05-01",
    nextMaintenance: "2025-07-01",
    assignedTo: null,
    notes: "Ready for next assignment",
    mileage: 1250, // hours for heavy equipment
  },
  {
    id: "VEH-003",
    name: "Pickup #5",
    type: "Pickup Truck",
    make: "Ford",
    model: "F-250",
    year: 2024,
    licensePlate: "GA-45678",
    vin: "1FTBF2B65NEA12345",
    status: "maintenance",
    lastMaintenance: "2025-03-10",
    nextMaintenance: "2025-05-18",
    assignedTo: "Service Department",
    notes: "Brake service and oil change",
    fuelLevel: 0.25,
    mileage: 35000,
  },
  {
    id: "VEH-004",
    name: "Grader #1",
    type: "Motor Grader",
    make: "John Deere",
    model: "872G",
    year: 2023,
    licensePlate: "N/A",
    vin: "JD872G987654321",
    status: "in-use",
    currentLocation: {
      lat: 33.751897,
      lng: -84.384985,
      timestamp: "2025-05-17T10:00:00Z"
    },
    currentProject: "GA-400 Repaving",
    lastMaintenance: "2025-04-22",
    nextMaintenance: "2025-06-22",
    assignedTo: "Maria Rodriguez",
    mileage: 2100, // hours
  },
  {
    id: "VEH-005",
    name: "Asphalt Paver #1",
    type: "Paver",
    make: "Caterpillar",
    model: "AP655F",
    year: 2022,
    licensePlate: "N/A",
    vin: "CATAP655F123789",
    status: "offline",
    lastMaintenance: "2025-02-15",
    nextMaintenance: "2025-05-25",
    notes: "Major hydraulic system repair needed",
    mileage: 3500, // hours
  }
];

const mockTools: Tool[] = [
  {
    id: "TOOL-001",
    name: "Concrete Saw #3",
    type: "Power Tool",
    brand: "Husqvarna",
    model: "K770",
    serialNumber: "HUSK770-123456",
    status: "in-use",
    currentLocation: "I-85 Bridge Repair Site",
    assignedTo: "David Williams",
    lastMaintenance: "2025-04-10",
    nextMaintenance: "2025-06-10"
  },
  {
    id: "TOOL-002",
    name: "Jackhammer #2",
    type: "Power Tool",
    brand: "Bosch",
    model: "GSH27",
    serialNumber: "BSCH-GSH27-789012",
    status: "available",
    currentLocation: "Main Warehouse",
    lastMaintenance: "2025-05-02",
    nextMaintenance: "2025-07-02"
  },
  {
    id: "TOOL-003",
    name: "Laser Level #1",
    type: "Measuring Tool",
    brand: "Topcon",
    model: "RL-H5A",
    serialNumber: "TPCN-RLH5A-345678",
    status: "maintenance",
    currentLocation: "Tool Maintenance Shop",
    lastMaintenance: "2025-03-15",
    nextMaintenance: "2025-05-18"
  },
  {
    id: "TOOL-004",
    name: "Portable Generator #2",
    type: "Power Equipment",
    brand: "Honda",
    model: "EU7000is",
    serialNumber: "HNDA-EU7000-123789",
    status: "in-use",
    currentLocation: "GA-400 Repaving Site",
    assignedTo: "Carlos Mendez",
    lastMaintenance: "2025-04-25",
    nextMaintenance: "2025-06-25"
  },
  {
    id: "TOOL-005",
    name: "Air Compressor #1",
    type: "Power Equipment",
    brand: "Ingersoll Rand",
    model: "P185",
    serialNumber: "INGR-P185-987654",
    status: "available",
    currentLocation: "South Yard",
    lastMaintenance: "2025-05-05",
    nextMaintenance: "2025-07-05"
  },
  {
    id: "TOOL-006",
    name: "Concrete Vibrator #3",
    type: "Concrete Tool",
    brand: "Wacker Neuson",
    model: "IREN",
    serialNumber: "WCKR-IREN-456123",
    status: "in-use",
    currentLocation: "I-285 Bridge Project",
    assignedTo: "Sarah Johnson",
    lastMaintenance: "2025-04-12",
    nextMaintenance: "2025-06-12"
  },
  {
    id: "TOOL-007",
    name: "Rebar Cutter #2",
    type: "Power Tool",
    brand: "Makita",
    model: "DSC251",
    serialNumber: "MKTA-DSC251-789456",
    status: "available",
    currentLocation: "Main Warehouse",
    lastMaintenance: "2025-05-08",
    nextMaintenance: "2025-07-08"
  },
  {
    id: "TOOL-008",
    name: "Survey Equipment #1",
    type: "Measuring Tool",
    brand: "Trimble",
    model: "S7",
    serialNumber: "TRMBL-S7-123987",
    status: "in-use",
    currentLocation: "GA-400 Repaving Site",
    assignedTo: "Maria Rodriguez",
    lastMaintenance: "2025-04-20",
    nextMaintenance: "2025-06-20"
  },
  {
    id: "TOOL-009",
    name: "Asphalt Thermometer #4",
    type: "Testing Tool",
    brand: "Fluke",
    model: "568",
    serialNumber: "FLKE-568-456789",
    status: "in-use",
    currentLocation: "I-75 Resurfacing Project",
    assignedTo: "James Wilson",
    lastMaintenance: "2025-04-30",
    nextMaintenance: "2025-06-30"
  },
  {
    id: "TOOL-010",
    name: "Traffic Counter #1",
    type: "Monitoring Equipment",
    brand: "MetroCount",
    model: "5600",
    serialNumber: "MTRC-5600-789123",
    status: "available",
    currentLocation: "Main Warehouse",
    lastMaintenance: "2025-05-10",
    nextMaintenance: "2025-07-10"
  }
];

const mockMaterials: Material[] = [
  {
    id: "MAT-001",
    name: "Asphalt Mix Type B",
    category: "Asphalt",
    quantity: 250,
    unit: "tons",
    location: "North Yard",
    minimumStock: 50,
    supplier: "Georgia Pavement Supply",
    cost: 85.50,
    lastOrderDate: "2025-05-01"
  },
  {
    id: "MAT-002",
    name: "Crushed Stone #57",
    category: "Aggregate",
    quantity: 500,
    unit: "tons",
    location: "South Yard",
    minimumStock: 100,
    supplier: "Atlanta Stone Company",
    cost: 32.75,
    lastOrderDate: "2025-04-15"
  },
  {
    id: "MAT-003",
    name: "Portland Cement Type I",
    category: "Concrete",
    quantity: 80,
    unit: "pallets",
    location: "West Warehouse",
    minimumStock: 20,
    supplier: "Southern Concrete Supply",
    cost: 425.00,
    lastOrderDate: "2025-04-28"
  },
  {
    id: "MAT-004",
    name: "Steel Rebar #4",
    category: "Steel",
    quantity: 5000,
    unit: "feet",
    location: "Main Warehouse",
    minimumStock: 1000,
    supplier: "Steel Dynamics Inc.",
    cost: 0.85,
    lastOrderDate: "2025-05-05"
  },
  {
    id: "MAT-005",
    name: "Traffic Paint - White",
    category: "Pavement Markings",
    quantity: 55,
    unit: "gallons",
    location: "East Warehouse",
    minimumStock: 15,
    supplier: "Road Marking Solutions",
    cost: 45.25,
    lastOrderDate: "2025-04-10"
  },
  {
    id: "MAT-006",
    name: "Traffic Paint - Yellow",
    category: "Pavement Markings",
    quantity: 65,
    unit: "gallons",
    location: "East Warehouse",
    minimumStock: 15,
    supplier: "Road Marking Solutions",
    cost: 45.25,
    lastOrderDate: "2025-04-10"
  },
  {
    id: "MAT-007",
    name: "Concrete Mix 4000 PSI",
    category: "Concrete",
    quantity: 120,
    unit: "yards",
    location: "North Yard",
    minimumStock: 25,
    supplier: "Southern Concrete Supply",
    cost: 125.00,
    lastOrderDate: "2025-05-02"
  },
  {
    id: "MAT-008",
    name: "Silt Fence",
    category: "Erosion Control",
    quantity: 2500,
    unit: "feet",
    location: "South Yard",
    minimumStock: 500,
    supplier: "Georgia Erosion Supplies",
    cost: 0.55,
    lastOrderDate: "2025-04-20"
  },
  {
    id: "MAT-009",
    name: "Guardrail Type 31",
    category: "Safety",
    quantity: 1200,
    unit: "feet",
    location: "West Yard",
    minimumStock: 300,
    supplier: "Highway Safety Products",
    cost: 28.75,
    lastOrderDate: "2025-05-08"
  },
  {
    id: "MAT-010",
    name: "PVC Pipe 8\"",
    category: "Drainage",
    quantity: 850,
    unit: "feet",
    location: "Main Warehouse",
    minimumStock: 200,
    supplier: "Atlanta Pipe Supply",
    cost: 12.45,
    lastOrderDate: "2025-04-25"
  },
  {
    id: "MAT-011",
    name: "Concrete Junction Boxes 24\"",
    category: "Drainage",
    quantity: 15,
    unit: "units",
    location: "North Yard",
    minimumStock: 5,
    supplier: "Southern Concrete Supply",
    cost: 245.00,
    lastOrderDate: "2025-05-03"
  },
  {
    id: "MAT-012",
    name: "Thermoplastic Pavement Marking",
    category: "Pavement Markings",
    quantity: 3500,
    unit: "pounds",
    location: "East Warehouse",
    minimumStock: 1000,
    supplier: "Road Marking Solutions",
    cost: 2.25,
    lastOrderDate: "2025-04-22"
  },
  {
    id: "MAT-013",
    name: "Traffic Cones 28\"",
    category: "Safety",
    quantity: 200,
    unit: "units",
    location: "Main Warehouse",
    minimumStock: 50,
    supplier: "Highway Safety Products",
    cost: 18.50,
    lastOrderDate: "2025-05-10"
  },
  {
    id: "MAT-014",
    name: "Road Base Aggregate",
    category: "Aggregate",
    quantity: 1200,
    unit: "tons",
    location: "South Yard",
    minimumStock: 250,
    supplier: "Atlanta Stone Company",
    cost: 21.75,
    lastOrderDate: "2025-04-18"
  },
  {
    id: "MAT-015",
    name: "Concrete Form Ties",
    category: "Concrete Accessories",
    quantity: 5000,
    unit: "units",
    location: "East Warehouse",
    minimumStock: 1000,
    supplier: "Construction Supply Co.",
    cost: 0.35,
    lastOrderDate: "2025-05-05"
  },
  {
    id: "MAT-016",
    name: "Geotextile Fabric",
    category: "Erosion Control",
    quantity: 10000,
    unit: "sq. yards",
    location: "West Yard",
    minimumStock: 2000,
    supplier: "Georgia Erosion Supplies",
    cost: 0.85,
    lastOrderDate: "2025-04-28"
  },
  {
    id: "MAT-017",
    name: "Reflective Road Markers",
    category: "Pavement Markings",
    quantity: 1500,
    unit: "units",
    location: "East Warehouse",
    minimumStock: 300,
    supplier: "Road Marking Solutions",
    cost: 2.95,
    lastOrderDate: "2025-05-07"
  },
  {
    id: "MAT-018",
    name: "HDPE Pipe 12\"",
    category: "Drainage",
    quantity: 600,
    unit: "feet",
    location: "North Yard",
    minimumStock: 150,
    supplier: "Atlanta Pipe Supply",
    cost: 18.25,
    lastOrderDate: "2025-04-30"
  },
  {
    id: "MAT-019",
    name: "Rebar Chairs",
    category: "Concrete Accessories",
    quantity: 8000,
    unit: "units",
    location: "Main Warehouse",
    minimumStock: 2000,
    supplier: "Construction Supply Co.",
    cost: 0.15,
    lastOrderDate: "2025-05-09"
  },
  {
    id: "MAT-020",
    name: "Construction Adhesive",
    category: "Accessories",
    quantity: 120,
    unit: "tubes",
    location: "East Warehouse",
    minimumStock: 30,
    supplier: "Construction Supply Co.",
    cost: 4.75,
    lastOrderDate: "2025-05-01"
  }
];

const Assets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortItems = <T extends object>(items: T[], field: keyof T) => {
    if (!sortField) return items;
    
    return [...items].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSearch = <T extends object>(items: T[], query: string, fields: (keyof T)[]) => {
    if (!query) return items;
    const lowerCaseQuery = query.toLowerCase();
    
    return items.filter(item => 
      fields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerCaseQuery);
      })
    );
  };

  const filteredVehicles = handleSearch(
    sortItems(mockVehicles, sortField as keyof Vehicle), 
    searchQuery,
    ['name', 'type', 'make', 'model', 'status', 'assignedTo'] as (keyof Vehicle)[]
  );
  
  const filteredTools = handleSearch(
    sortItems(mockTools, sortField as keyof Tool),
    searchQuery,
    ['name', 'type', 'brand', 'status', 'assignedTo'] as (keyof Tool)[]
  );
  
  const filteredMaterials = handleSearch(
    sortItems(mockMaterials, sortField as keyof Material),
    searchQuery,
    ['name', 'category', 'location'] as (keyof Material)[]
  );

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
    setShowDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in-use': return 'bg-blue-500';
      case 'available': return 'bg-green-500';
      case 'maintenance': return 'bg-amber-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const resetSelection = () => {
    setSelectedAsset(null);
    setShowDetails(false);
  };

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <PageHeader
        heading="Assets Management"
        subheading="Track, manage, and maintain your fleet, tools, and materials"
      >
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground italic">Construct for Centuries</p>
        </div>
      </PageHeader>
      
      {showDetails && selectedAsset ? (
        <AssetDetails asset={selectedAsset} onBack={resetSelection} />
      ) : (
        <Tabs defaultValue="vehicles" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="vehicles" className="flex items-center gap-1">
                <Truck className="h-4 w-4" />
                <span>Vehicles</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>Tools</span>
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-1">
                <PackageOpen className="h-4 w-4" />
                <span>Materials</span>
              </TabsTrigger>
              <TabsTrigger value="dispatch" className="flex items-center gap-1">
                <SendToBack className="h-4 w-4" />
                <span>Dispatch</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Location Map</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-1">
                <CalendarClock className="h-4 w-4" />
                <span>Maintenance</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search assets..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>

          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Vehicle Fleet</CardTitle>
                    <CardDescription>
                      Manage and track your company's vehicles
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" /> Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                          Name <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('type')} className="cursor-pointer">
                          Type <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('make')} className="cursor-pointer">
                          Make/Model <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                          Status <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('assignedTo')} className="cursor-pointer">
                          Assigned To <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('nextMaintenance')} className="cursor-pointer">
                          Next Maintenance <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVehicles.map((vehicle) => (
                        <TableRow 
                          key={vehicle.id} 
                          className="cursor-pointer" 
                          onClick={() => handleAssetClick(vehicle)}
                        >
                          <TableCell>{vehicle.name}</TableCell>
                          <TableCell>{vehicle.type}</TableCell>
                          <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(vehicle.status)}`} />
                              <span className="capitalize">{vehicle.status.replace('-', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.assignedTo || 'Unassigned'}</TableCell>
                          <TableCell>{vehicle.nextMaintenance || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Vehicle Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
                        <span>In Use</span>
                      </div>
                      <span className="font-medium">{mockVehicles.filter(v => v.status === 'in-use').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                        <span>Available</span>
                      </div>
                      <span className="font-medium">{mockVehicles.filter(v => v.status === 'available').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-amber-500 mr-2" />
                        <span>Maintenance</span>
                      </div>
                      <span className="font-medium">{mockVehicles.filter(v => v.status === 'maintenance').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                        <span>Offline</span>
                      </div>
                      <span className="font-medium">{mockVehicles.filter(v => v.status === 'offline').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Maintenance Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockVehicles
                      .filter(v => new Date(v.nextMaintenance || '') <= new Date('2025-06-01'))
                      .slice(0, 3)
                      .map(v => (
                        <div key={v.id} className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            <span>{v.name}</span>
                          </div>
                          <span className="text-sm">{v.nextMaintenance}</span>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>Dump Truck #1 checked out</span>
                      </div>
                      <span className="text-sm">Today</span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <Wrench className="h-4 w-4 text-blue-500 mr-2" />
                        <span>Pickup #5 entered maintenance</span>
                      </div>
                      <span className="text-sm">Yesterday</span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        <span>Excavator #2 returned</span>
                      </div>
                      <span className="text-sm">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Tool Inventory</CardTitle>
                    <CardDescription>
                      Manage and track your company's tools and equipment
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" /> Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                          Name <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('type')} className="cursor-pointer">
                          Type <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('brand')} className="cursor-pointer">
                          Brand/Model <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                          Status <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('currentLocation')} className="cursor-pointer">
                          Location <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('assignedTo')} className="cursor-pointer">
                          Assigned To <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTools.map((tool) => (
                        <TableRow 
                          key={tool.id} 
                          className="cursor-pointer" 
                          onClick={() => handleAssetClick(tool)}
                        >
                          <TableCell>{tool.name}</TableCell>
                          <TableCell>{tool.type}</TableCell>
                          <TableCell>{tool.brand} {tool.model}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(tool.status)}`} />
                              <span className="capitalize">{tool.status.replace('-', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>{tool.currentLocation || 'Unknown'}</TableCell>
                          <TableCell>{tool.assignedTo || 'Unassigned'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Materials Inventory</CardTitle>
                    <CardDescription>
                      Manage your yard and warehouse inventory
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" /> Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                          Name <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                          Category <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
                          Quantity <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('unit')} className="cursor-pointer">
                          Unit <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('location')} className="cursor-pointer">
                          Location <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                        </TableHead>
                        <TableHead>Stock Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials.map((material) => (
                        <TableRow 
                          key={material.id} 
                          className="cursor-pointer" 
                          onClick={() => handleAssetClick(material)}
                        >
                          <TableCell>{material.name}</TableCell>
                          <TableCell>{material.category}</TableCell>
                          <TableCell>{material.quantity}</TableCell>
                          <TableCell>{material.unit}</TableCell>
                          <TableCell>{material.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {material.minimumStock && material.quantity <= material.minimumStock ? (
                                <>
                                  <div className="h-2 w-2 rounded-full mr-2 bg-amber-500" />
                                  <span>Low Stock</span>
                                </>
                              ) : (
                                <>
                                  <div className="h-2 w-2 rounded-full mr-2 bg-green-500" />
                                  <span>In Stock</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dispatch" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <DispatchManager vehicles={mockVehicles} tools={mockTools} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Location Tracking</CardTitle>
                <CardDescription>
                  Real-time tracking of vehicles and equipment in the field
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AssetsMap vehicles={mockVehicles} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Maintenance Schedule</CardTitle>
                    <CardDescription>
                      View and manage upcoming maintenance for vehicles and tools
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CalendarClock className="h-4 w-4 mr-1" /> Schedule
                    </Button>
                    <Button variant="default" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> New Maintenance
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MaintenanceSchedule vehicles={mockVehicles} tools={mockTools} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Assets;
