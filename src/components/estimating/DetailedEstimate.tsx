import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  PencilRuler, FileText, Users, Calculator, Plus, Minus, X, Save, ArrowUp, ArrowDown, Download, Filter, Copy, Table2,
} from "lucide-react";
import { 
  EstimateItem, 
  EstimateItemCategory, 
  TakeoffMeasurement, 
  PreliminaryVendor,
  EstimateVersionInfo
} from '@/types/estimates';
import SpreadsheetView from './spreadsheet/SpreadsheetView';
import EstimateVersionControl from './spreadsheet/EstimateVersionControl';
import EstimateTemplates from './spreadsheet/EstimateTemplates';
import EstimateCollaborators from './spreadsheet/EstimateCollaborators';
import EstimateErrorChecker from './spreadsheet/EstimateErrorChecker';
import { calculateFormula } from '@/utils/estimateCalculator';

interface DetailedEstimateProps {
  estimateId?: string;
  onSaveItems?: (items: EstimateItem[]) => void;
}

const DetailedEstimate = ({ estimateId, onSaveItems }: DetailedEstimateProps) => {
  const [activeTab, setActiveTab] = useState("spreadsheet");
  const [lineItems, setLineItems] = useState<EstimateItem[]>([
    {
      id: "item-1",
      estimateId: "EST-10001",
      description: "Asphalt Paving",
      quantity: 5000,
      unit: "SY",
      unitPrice: 45.75,
      totalPrice: 228750,
      category: "material"
    },
    {
      id: "item-2",
      estimateId: "EST-10001",
      description: "Excavation",
      quantity: 3500,
      unit: "CY",
      unitPrice: 12.50,
      totalPrice: 43750,
      category: "equipment"
    },
    {
      id: "item-3",
      estimateId: "EST-10001",
      description: "Traffic Control",
      quantity: 30,
      unit: "DAY",
      unitPrice: 1500,
      totalPrice: 45000,
      category: "labor"
    },
    {
      id: "item-4",
      estimateId: "EST-10001",
      description: "Concrete Barrier",
      quantity: 1000,
      unit: "LF",
      unitPrice: 85.25,
      totalPrice: 85250,
      category: "subcontractor",
      vendorName: "Georgia Concrete Solutions"
    },
    {
      id: "item-5",
      estimateId: "EST-10001",
      description: "Project Management",
      quantity: 1,
      unit: "LS",
      unitPrice: 35000,
      totalPrice: 35000,
      category: "overhead"
    }
  ]);

  // Mock takeoff measurements - unchanged
  const [takeoffs, setTakeoffs] = useState<TakeoffMeasurement[]>([
    {
      id: "takeoff-1",
      estimateId: "EST-10001",
      drawingId: "DWG-001",
      drawingName: "Site Plan.pdf",
      type: "area",
      value: 5000,
      unit: "SY",
      notes: "Parking lot area",
      linkedItemId: "item-1"
    },
    {
      id: "takeoff-2",
      estimateId: "EST-10001",
      drawingId: "DWG-001",
      drawingName: "Site Plan.pdf",
      type: "volume",
      value: 3500,
      unit: "CY",
      notes: "Excavation volume for drainage",
      linkedItemId: "item-2"
    }
  ]);

  // Mock preliminary vendors - unchanged
  const [vendors, setVendors] = useState<PreliminaryVendor[]>([
    {
      id: "pv-1",
      estimateId: "EST-10001",
      vendorId: "V-001",
      vendorName: "Georgia Paving Co.",
      category: "material",
      contactInfo: "John Smith, 404-555-1234"
    },
    {
      id: "pv-2",
      estimateId: "EST-10001",
      vendorId: "V-002",
      vendorName: "Atlanta Equipment Rental",
      category: "equipment",
      contactInfo: "Sarah Johnson, 770-555-6789"
    }
  ]);

  // Mock version history
  const [versionHistory, setVersionHistory] = useState<EstimateVersionInfo[]>([
    {
      id: "ver-1",
      estimateId: "EST-10001",
      versionNumber: "1.0",
      createdBy: "John Smith",
      createdAt: "2025-04-10T14:30:00",
      totalCost: 437750,
      isBaseline: true
    },
    {
      id: "ver-2",
      estimateId: "EST-10001",
      versionNumber: "1.1",
      createdBy: "John Smith",
      createdAt: "2025-04-12T09:15:00",
      notes: "Updated material costs",
      totalCost: 442500
    }
  ]);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<EstimateItem>>({
    description: "",
    quantity: 0,
    unit: "",
    unitPrice: 0,
    category: "material"
  });

  // Filter & sorting states
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("none");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Collaboration state (mock)
  const [collaborators, setCollaborators] = useState<{id: string, name: string, role: string}[]>([
    { id: "user-1", name: "John Smith", role: "owner" },
    { id: "user-2", name: "Sarah Johnson", role: "editor" }
  ]);
  
  // Error checking state
  const [errors, setErrors] = useState<{id: string, message: string}[]>([]);
  
  // Reference for spreadsheet container
  const spreadsheetRef = useRef<HTMLDivElement>(null);

  // Check for errors in line items
  useEffect(() => {
    const newErrors = [];
    
    for (const item of lineItems) {
      if (!item.quantity || item.quantity <= 0) {
        newErrors.push({
          id: item.id,
          message: "Missing or invalid quantity"
        });
      }
      
      if (!item.unitPrice || item.unitPrice <= 0) {
        newErrors.push({
          id: item.id,
          message: "Missing or invalid unit price"
        });
      }
      
      if (item.formula) {
        try {
          calculateFormula(item.formula, lineItems);
        } catch (err) {
          newErrors.push({
            id: item.id,
            message: `Formula error: ${err instanceof Error ? err.message : 'Unknown error'}`
          });
        }
      }
      
      if (!item.description || item.description.trim() === '') {
        newErrors.push({
          id: item.id,
          message: "Description is required"
        });
      }
    }
    
    setErrors(newErrors);
  }, [lineItems]);

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleAddItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.unit || !newItem.unitPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const totalPrice = (newItem.quantity || 0) * (newItem.unitPrice || 0);
    const item: EstimateItem = {
      id: `item-${Date.now()}`,
      estimateId: estimateId || "EST-10001", // Would come from props in a real app
      description: newItem.description || "",
      quantity: newItem.quantity || 0,
      unit: newItem.unit || "",
      unitPrice: newItem.unitPrice || 0,
      totalPrice,
      category: newItem.category as EstimateItemCategory,
      createdBy: "Current User",
      modifiedDate: new Date().toISOString()
    };

    setLineItems([...lineItems, item]);
    setNewItem({
      description: "",
      quantity: 0,
      unit: "",
      unitPrice: 0,
      category: "material"
    });
    toast.success("Item added successfully");
  };

  const handleSaveItems = () => {
    if (errors.length > 0) {
      toast.warning(`Please fix ${errors.length} error(s) before saving`);
      return;
    }
    
    if (onSaveItems) {
      onSaveItems(lineItems);
    }
    
    // Create a new version
    const newVersion: EstimateVersionInfo = {
      id: `ver-${Date.now()}`,
      estimateId: estimateId || "EST-10001",
      versionNumber: `1.${versionHistory.length}`,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      totalCost: calculateTotal()
    };
    
    setVersionHistory([...versionHistory, newVersion]);
    
    toast.success("Estimate saved and new version created");
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    toast.info(`Exporting estimate as ${format.toUpperCase()}`);
    // In a real app, this would trigger the export functionality
  };

  const handleImport = (source: 'dot' | 'excel' | 'csv' | 'historical' | 'template') => {
    toast.info(`Importing from ${source.toUpperCase()}`);
    // In a real app, this would trigger the import functionality
  };

  // Filter line items based on category and search term
  const filteredItems = lineItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = !searchTerm || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Sort filtered items based on sortBy
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.totalPrice - b.totalPrice;
      case 'price-desc':
        return b.totalPrice - a.totalPrice;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'vendor':
        return (a.vendorName || '').localeCompare(b.vendorName || '');
      default:
        return 0;
    }
  });

  // Handle collaborative changes (mock functionality)
  const handleCollaborativeUpdate = (updatedItem: EstimateItem) => {
    setLineItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    
    toast.info(`Item updated by collaborative edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Detailed Estimate</h3>
          <p className="text-sm text-muted-foreground">
            Accurate item-by-item project costing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="grid gap-1">
                <Button variant="ghost" className="justify-start" onClick={() => handleExport('pdf')}>
                  PDF Document
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleExport('csv')}>
                  CSV Spreadsheet
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleExport('excel')}>
                  Excel Spreadsheet
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                Import Data
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="grid gap-1">
                <Button variant="ghost" className="justify-start" onClick={() => handleImport('dot')}>
                  DOT Bid Items
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleImport('excel')}>
                  From Excel
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleImport('historical')}>
                  Historical Estimate
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleImport('template')}>
                  From Template
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleSaveItems}>
            <Save className="mr-2 h-4 w-4" />
            Save Estimate
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center">
          <div className="text-yellow-700 text-sm">
            <strong>{errors.length} error{errors.length > 1 ? 's' : ''} found</strong> - Please fix before submitting
          </div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setActiveTab("errors")}>
            View Details
          </Button>
        </div>
      )}

      <div className="flex items-center mb-4 gap-2">
        <EstimateCollaborators collaborators={collaborators} />

        <div className="ml-auto flex items-center gap-2">
          <EstimateVersionControl versions={versionHistory} />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="spreadsheet">
            <Table2 className="mr-2 h-4 w-4" />
            Spreadsheet
          </TabsTrigger>
          <TabsTrigger value="lineItems">
            List View
          </TabsTrigger>
          <TabsTrigger value="errors">
            <Badge variant="outline" className={cn(
              errors.length > 0 && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
            )}>
              Issues ({errors.length})
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="templates">
            Templates
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Calculator className="mr-2 h-4 w-4" />
            Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="spreadsheet" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Detailed Estimate Spreadsheet</CardTitle>
                  <CardDescription>Excel-like interface for detailed cost estimation</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="subcontractor">Subcontractor</SelectItem>
                      <SelectItem value="overhead">Overhead</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Search items..."
                    className="max-w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-t">
              <div ref={spreadsheetRef} className="h-[500px] overflow-auto">
                <SpreadsheetView
                  items={sortedItems}
                  onItemUpdate={(updatedItem) => {
                    setLineItems(prev => prev.map(item => 
                      item.id === updatedItem.id ? updatedItem : item
                    ));
                  }}
                  errors={errors}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-between py-3">
              <div className="text-sm text-muted-foreground">
                Showing {filteredItems.length} of {lineItems.length} items
              </div>
              <div className="font-medium">
                Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculateTotal())}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="lineItems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Line Items</CardTitle>
              <CardDescription>Add and manage detailed estimate components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity || ''}
                      onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value)})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit-price">Unit Price ($)</Label>
                    <Input
                      id="unit-price"
                      type="number"
                      value={newItem.unitPrice || ''}
                      onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value)})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({...newItem, category: value as EstimateItemCategory})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="material">Material</SelectItem>
                        <SelectItem value="labor">Labor</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="subcontractor">Subcontractor</SelectItem>
                        <SelectItem value="overhead">Overhead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleAddItem}>Add Line Item</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Line Items List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedItems.map(item => {
                    const itemErrors = errors.filter(error => error.id === item.id);
                    return (
                      <TableRow key={item.id} className={cn(
                        itemErrors.length > 0 && "bg-yellow-50"
                      )}>
                        <TableCell>
                          <div className="flex items-center">
                            {item.description}
                            {itemErrors.length > 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="ml-2 text-yellow-500">⚠️</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <ul className="list-disc pl-4 text-xs">
                                      {itemErrors.map((error, idx) => (
                                        <li key={idx}>{error.message}</li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          {item.vendorName && <div className="text-xs text-muted-foreground">Vendor: {item.vendorName}</div>}
                        </TableCell>
                        <TableCell className="capitalize">{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-6 border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-medium">Total Estimate:</span>
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculateTotal())}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveItems} className="ml-auto">Save Estimate</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <EstimateErrorChecker errors={errors} items={lineItems} />
        </TabsContent>
        
        <TabsContent value="templates">
          <EstimateTemplates 
            onApplyTemplate={(templateItems) => {
              toast.info("Template applied to estimate");
              // In a real app, this would add template items to the estimate
            }} 
          />
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Breakdown of costs and comparisons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Cost Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries({
                      "Material": lineItems.filter(i => i.category === "material").reduce((sum, i) => sum + i.totalPrice, 0),
                      "Labor": lineItems.filter(i => i.category === "labor").reduce((sum, i) => sum + i.totalPrice, 0),
                      "Equipment": lineItems.filter(i => i.category === "equipment").reduce((sum, i) => sum + i.totalPrice, 0),
                      "Subcontractor": lineItems.filter(i => i.category === "subcontractor").reduce((sum, i) => sum + i.totalPrice, 0),
                      "Overhead": lineItems.filter(i => i.category === "overhead").reduce((sum, i) => sum + i.totalPrice, 0),
                    }).map(([category, amount]) => (
                      <Card key={category} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">{category}</div>
                          <div className="text-lg font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(amount / calculateTotal() * 100).toFixed(1)}% of total
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-4">Subcontractor Quote Comparison</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Self-Perform Cost</TableHead>
                        <TableHead>Vendor Quote</TableHead>
                        <TableHead>Variance</TableHead>
                        <TableHead>Recommendation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Concrete Barrier</TableCell>
                        <TableCell>$92,500.00</TableCell>
                        <TableCell>$85,250.00</TableCell>
                        <TableCell className="text-green-600">-$7,250.00 (7.8%)</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Subcontract</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Traffic Control</TableCell>
                        <TableCell>$45,000.00</TableCell>
                        <TableCell>$52,250.00</TableCell>
                        <TableCell className="text-red-600">+$7,250.00 (16.1%)</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">Self-Perform</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedEstimate;
