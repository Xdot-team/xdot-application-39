
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Check, FileText, ListChecks, PencilRuler, Upload } from "lucide-react";
import { toast } from "sonner";
import { TakeoffMeasurement } from '@/types/estimates';

const MobileEstimating = () => {
  const [activeTab, setActiveTab] = useState("takeoff");
  const [measurements, setMeasurements] = useState<TakeoffMeasurement[]>([
    {
      id: "m1",
      estimateId: "EST-10001",
      drawingId: "D1",
      drawingName: "Site Plan",
      type: "length",
      value: 120,
      unit: "ft",
      notes: "North property line"
    },
    {
      id: "m2",
      estimateId: "EST-10001",
      drawingId: "D1",
      drawingName: "Site Plan",
      type: "area",
      value: 5200,
      unit: "sq ft",
      notes: "Parking area"
    }
  ]);
  const [newMeasurement, setNewMeasurement] = useState({
    type: "length",
    value: "",
    unit: "ft",
    notes: ""
  });

  const handleAddMeasurement = () => {
    if (!newMeasurement.value) {
      toast.error("Please enter a measurement value");
      return;
    }

    const measurement: TakeoffMeasurement = {
      id: `m${Date.now()}`,
      estimateId: "EST-10001", // Would come from props in a real app
      drawingId: "D1",
      drawingName: "Field Measurement",
      type: newMeasurement.type as "length" | "area" | "count" | "volume",
      value: parseFloat(newMeasurement.value),
      unit: newMeasurement.unit,
      notes: newMeasurement.notes
    };

    setMeasurements([...measurements, measurement]);
    setNewMeasurement({
      type: "length",
      value: "",
      unit: "ft",
      notes: ""
    });
    toast.success("Measurement added");
  };

  const handleCaptureMeasurement = () => {
    toast.info("Camera functionality would be integrated here for field measurements");
  };

  const handleSubmitAll = () => {
    toast.success("Measurements synced to the server");
  };

  return (
    <div className="space-y-4 p-2 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-xl font-bold">Field Estimating</h1>
        <p className="text-sm text-muted-foreground">GA-400 Repaving Project</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="takeoff">
            <PencilRuler className="mr-2 h-4 w-4" />
            Takeoff
          </TabsTrigger>
          <TabsTrigger value="photos">
            <Camera className="mr-2 h-4 w-4" />
            Photos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="takeoff">
          <Card>
            <CardHeader>
              <CardTitle>Field Measurements</CardTitle>
              <CardDescription>Record measurements from the field</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="measurementType">Type</Label>
                <select 
                  id="measurementType"
                  className="w-full p-2 border rounded-md"
                  value={newMeasurement.type}
                  onChange={(e) => setNewMeasurement({...newMeasurement, type: e.target.value})}
                >
                  <option value="length">Length</option>
                  <option value="area">Area</option>
                  <option value="count">Count</option>
                  <option value="volume">Volume</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newMeasurement.value}
                    onChange={(e) => setNewMeasurement({...newMeasurement, value: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newMeasurement.unit}
                    onChange={(e) => setNewMeasurement({...newMeasurement, unit: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newMeasurement.notes}
                  onChange={(e) => setNewMeasurement({...newMeasurement, notes: e.target.value})}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1" 
                  onClick={handleCaptureMeasurement} 
                  variant="outline"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
                <Button className="flex-1" onClick={handleAddMeasurement}>
                  <Check className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Saved Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {measurements.length > 0 ? (
                measurements.map((m) => (
                  <div key={m.id} className="border rounded-md p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{m.type}</span>
                      <span>{m.value} {m.unit}</span>
                    </div>
                    {m.notes && (
                      <p className="text-sm text-muted-foreground">{m.notes}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No measurements yet</p>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmitAll}>
                <Upload className="mr-2 h-4 w-4" />
                Sync All Measurements
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Site Photos</CardTitle>
              <CardDescription>Capture photos for the estimate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
                <Camera className="h-8 w-8 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Capture photos of site conditions for the estimate
                  </p>
                  <Button className="mt-4" onClick={() => toast.info("Camera function would open here")}>
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-2">
                  <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xs mt-2 text-center truncate">Photo 1</p>
                </div>
                <div className="border rounded-md p-2">
                  <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xs mt-2 text-center truncate">Photo 2</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-center text-muted-foreground py-4 italic">
        Construct for Centuries
      </div>
    </div>
  );
};

export default MobileEstimating;
