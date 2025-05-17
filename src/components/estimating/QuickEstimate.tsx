
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { QuickEstimateParams } from '@/types/estimates';

const projectTypes = [
  { id: "highway", name: "Highway Construction" },
  { id: "bridge", name: "Bridge Construction" },
  { id: "intersection", name: "Intersection Improvement" },
  { id: "sidewalk", name: "Sidewalk Installation" },
  { id: "drainage", name: "Drainage System" },
];

const parameterTemplates: Record<string, { [key: string]: { name: string, unit: string, defaultValue: number } }> = {
  "highway": {
    "laneLength": { name: "Lane Length", unit: "miles", defaultValue: 1 },
    "laneWidth": { name: "Lane Width", unit: "ft", defaultValue: 12 },
    "laneCount": { name: "Number of Lanes", unit: "count", defaultValue: 2 },
    "pavementDepth": { name: "Pavement Depth", unit: "inches", defaultValue: 8 },
  },
  "bridge": {
    "bridgeLength": { name: "Bridge Length", unit: "ft", defaultValue: 100 },
    "bridgeWidth": { name: "Bridge Width", unit: "ft", defaultValue: 40 },
    "deckType": { name: "Deck Type Factor", unit: "factor", defaultValue: 1.2 },
    "spanCount": { name: "Number of Spans", unit: "count", defaultValue: 2 },
  },
  "intersection": {
    "intersectionSize": { name: "Intersection Size", unit: "sq ft", defaultValue: 10000 },
    "signalCount": { name: "Number of Signals", unit: "count", defaultValue: 4 },
    "trafficVolume": { name: "Traffic Volume Factor", unit: "factor", defaultValue: 1 },
  },
  "sidewalk": {
    "sidewalkLength": { name: "Sidewalk Length", unit: "ft", defaultValue: 1000 },
    "sidewalkWidth": { name: "Sidewalk Width", unit: "ft", defaultValue: 5 },
    "curbCount": { name: "Curb Ramps", unit: "count", defaultValue: 4 },
  },
  "drainage": {
    "pipeLength": { name: "Pipe Length", unit: "ft", defaultValue: 500 },
    "pipeDiameter": { name: "Pipe Diameter", unit: "inches", defaultValue: 24 },
    "inletCount": { name: "Number of Inlets", unit: "count", defaultValue: 6 },
  },
};

// Rate constants (simplified for demo purposes)
const rateConstants = {
  "highway": 1500000, // per lane mile
  "bridge": 250, // per square foot
  "intersection": 15, // per square foot
  "sidewalk": 35, // per square foot
  "drainage": 200, // per linear foot
};

interface QuickEstimateProps {
  onSaveEstimate?: (estimate: QuickEstimateParams) => void;
}

const QuickEstimate = ({ onSaveEstimate }: QuickEstimateProps) => {
  const [projectType, setProjectType] = useState<string>("highway");
  const [parameters, setParameters] = useState<{[key: string]: number}>({});
  const [total, setTotal] = useState<number>(0);

  // Initialize parameters when project type changes
  const handleProjectTypeChange = (value: string) => {
    setProjectType(value);
    const defaultParams: {[key: string]: number} = {};
    Object.entries(parameterTemplates[value] || {}).forEach(([key, param]) => {
      defaultParams[key] = param.defaultValue;
    });
    setParameters(defaultParams);
    calculateEstimate(value, defaultParams);
  };

  // Update a specific parameter
  const handleParameterChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newParameters = { ...parameters, [key]: numValue };
    setParameters(newParameters);
    calculateEstimate(projectType, newParameters);
  };

  // Calculate the estimate based on project type and parameters
  const calculateEstimate = (type: string, params: {[key: string]: number}) => {
    let estimateTotal = 0;
    
    switch(type) {
      case "highway":
        // Lane miles × rate
        estimateTotal = (params.laneLength || 0) * (params.laneCount || 0) * rateConstants.highway;
        break;
      case "bridge":
        // Square footage × rate
        estimateTotal = (params.bridgeLength || 0) * (params.bridgeWidth || 0) * (params.deckType || 1) * rateConstants.bridge;
        break;
      case "intersection":
        // Area × rate + signals
        estimateTotal = (params.intersectionSize || 0) * rateConstants.intersection + (params.signalCount || 0) * 50000;
        break;
      case "sidewalk":
        // Area × rate + curb ramps
        estimateTotal = (params.sidewalkLength || 0) * (params.sidewalkWidth || 0) * rateConstants.sidewalk + (params.curbCount || 0) * 2500;
        break;
      case "drainage":
        // Length × diameter factor × rate + inlets
        const diameterFactor = ((params.pipeDiameter || 0) / 24); // Normalize to 24" pipe
        estimateTotal = (params.pipeLength || 0) * diameterFactor * rateConstants.drainage + (params.inletCount || 0) * 5000;
        break;
    }
    
    setTotal(estimateTotal);
  };

  // Save the estimate
  const handleSave = () => {
    const quickEstimate: QuickEstimateParams = {
      id: `QE-${Date.now().toString().slice(-6)}`,
      estimateId: `EST-${Date.now().toString().slice(-6)}`,
      projectType,
      parameters: Object.entries(parameters).reduce((acc, [key, value]) => {
        const template = parameterTemplates[projectType][key];
        acc[key] = {
          name: template.name,
          value,
          unit: template.unit
        };
        return acc;
      }, {} as QuickEstimateParams['parameters']),
      calculatedTotal: total
    };

    if (onSaveEstimate) {
      onSaveEstimate(quickEstimate);
    }
    toast.success("Quick estimate saved successfully!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Estimate</CardTitle>
          <CardDescription>
            Generate a high-level cost estimate based on project parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-type">Project Type</Label>
            <Select 
              value={projectType} 
              onValueChange={handleProjectTypeChange}
            >
              <SelectTrigger id="project-type">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {projectType && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Project Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(parameterTemplates[projectType] || {}).map(([key, param]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{param.name} ({param.unit})</Label>
                    <Input
                      id={key}
                      type="number"
                      value={parameters[key] || param.defaultValue}
                      onChange={e => handleParameterChange(key, e.target.value)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Estimated Cost:</span>
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This is a preliminary estimate based on high-level parameters and historical data.
              Detailed estimates require additional analysis.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} className="ml-auto">
            Save Quick Estimate
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuickEstimate;
