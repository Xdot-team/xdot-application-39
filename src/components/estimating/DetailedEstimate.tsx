
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PencilRuler, FileText, Users } from "lucide-react";
import { EstimateItem, EstimateItemCategory, TakeoffMeasurement, PreliminaryVendor } from '@/types/estimates';
import { toast } from "sonner";

interface DetailedEstimateProps {
  onSaveItems?: (items: EstimateItem[]) => void;
}

const DetailedEstimate = ({ onSaveItems }: DetailedEstimateProps) => {
  const [activeTab, setActiveTab] = useState("lineItems");
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
    }
  ]);

  // Mock takeoff measurements
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

  // Mock preliminary vendors
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

  // New item form state
  const [newItem, setNewItem] = useState<Partial<EstimateItem>>({
    description: "",
    quantity: 0,
    unit: "",
    unitPrice: 0,
    category: "material"
  });

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
      estimateId: "EST-10001", // Would come from props in a real app
      description: newItem.description || "",
      quantity: newItem.quantity || 0,
      unit: newItem.unit || "",
      unitPrice: newItem.unitPrice || 0,
      totalPrice,
      category: newItem.category as EstimateItemCategory
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
    if (onSaveItems) {
      onSaveItems(lineItems);
    }
    toast.success("Estimate items saved successfully");
  };

  // This would be a complex component in a real app
  const TakeoffPlaceholder = () => (
    <div className="space-y-4">
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
        <PencilRuler className="h-12 w-12 mx-auto text-gray-400" />
        <div>
          <h3 className="text-lg font-medium">PDF/CAD Takeoff Tools</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and measure directly from construction drawings.
          </p>
          <div className="flex justify-center mt-4">
            <Button>Upload Drawing</Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Takeoff Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drawing</TableHead>
                <TableHead>Measurement Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {takeoffs.map(takeoff => (
                <TableRow key={takeoff.id}>
                  <TableCell>{takeoff.drawingName}</TableCell>
                  <TableCell className="capitalize">{takeoff.type}</TableCell>
                  <TableCell>{takeoff.value.toLocaleString()}</TableCell>
                  <TableCell>{takeoff.unit}</TableCell>
                  <TableCell>{takeoff.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const VendorSelectionPlaceholder = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Preliminary Vendor Selection</CardTitle>
          <CardDescription>Select potential vendors for materials and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact Information</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map(vendor => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.vendorName}</TableCell>
                    <TableCell className="capitalize">{vendor.category.replace('_', ' ')}</TableCell>
                    <TableCell>{vendor.contactInfo}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Request Bid</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="text-sm text-muted-foreground mt-4">
              Note: Vendor selection here will be available when creating bid packages in the 
              Vendor Engagement tab.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="lineItems">Line Items</TabsTrigger>
          <TabsTrigger value="takeoff">
            <FileText className="mr-2 h-4 w-4" />
            Takeoff
          </TabsTrigger>
          <TabsTrigger value="vendors">
            <Users className="mr-2 h-4 w-4" />
            Vendor Selection
          </TabsTrigger>
        </TabsList>
        
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
                  {lineItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
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
                  ))}
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
        
        <TabsContent value="takeoff">
          <TakeoffPlaceholder />
        </TabsContent>
        
        <TabsContent value="vendors">
          <VendorSelectionPlaceholder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedEstimate;
