
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Search, Square, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface TakeoffItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  area: string;
  calculatedBy: 'manual' | 'ai';
}

export default function TakeoffAI() {
  const [activeTab, setActiveTab] = useState('blueprint');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [items, setItems] = useState<TakeoffItem[]>([
    {
      id: '1',
      name: 'Asphalt Paving',
      quantity: 2450.5,
      unit: 'sq ft',
      area: 'Section A',
      calculatedBy: 'ai'
    },
    {
      id: '2',
      name: 'Concrete Curbing',
      quantity: 328.2,
      unit: 'linear ft',
      area: 'Section A',
      calculatedBy: 'ai'
    }
  ]);

  const handleFileUpload = () => {
    toast.info('Blueprint upload functionality will be implemented here.');
  };

  const handleAiDetect = () => {
    toast.success('AI has detected 2 new quantities in the blueprint.');
    
    // Add example AI-detected items - fixing the calculatedBy type
    const newItems: TakeoffItem[] = [
      {
        id: (items.length + 1).toString(),
        name: 'Drainage Piping',
        quantity: 175.0,
        unit: 'linear ft',
        area: 'Section B',
        calculatedBy: 'ai'
      },
      {
        id: (items.length + 2).toString(),
        name: 'Gravel Base',
        quantity: 1250.0,
        unit: 'sq ft',
        area: 'Section B',
        calculatedBy: 'ai'
      }
    ];
    
    setItems([...items, ...newItems]);
  };

  const handleManualAdd = () => {
    toast.info('Added a new takeoff item.');
    
    const newItem: TakeoffItem = {
      id: (items.length + 1).toString(),
      name: 'Manual Item',
      quantity: 100.0,
      unit: 'sq ft',
      area: 'Custom',
      calculatedBy: 'manual'
    };
    
    setItems([...items, newItem]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Takeoff with AI & ML</CardTitle>
            <CardDescription>Automatic quantity takeoff from blueprints</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">AI Assistance</span>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
            <TabsTrigger value="quantities">Quantities</TabsTrigger>
            <TabsTrigger value="assist">AI Assist</TabsTrigger>
          </TabsList>

          {/* Blueprint Tab */}
          <TabsContent value="blueprint" className="space-y-4">
            <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-md h-64 flex items-center justify-center">
              <div className="text-center">
                <Upload className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                <p className="mb-2 text-sm text-slate-600">Drag & drop your blueprint or click to upload</p>
                <Button variant="secondary" size="sm" onClick={handleFileUpload}>Upload Blueprint</Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-1" /> Zoom
                </Button>
                <Button variant="outline" size="sm">
                  <Square className="h-4 w-4 mr-1" /> Area
                </Button>
              </div>
              
              {aiEnabled && (
                <Button variant="default" size="sm" onClick={handleAiDetect}>
                  <MessageSquare className="h-4 w-4 mr-1" /> AI Detect
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Quantities Tab */}
          <TabsContent value="quantities">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Input placeholder="Search quantities..." className="max-w-xs" />
                <Button variant="outline" size="sm" onClick={handleManualAdd}>
                  Add Item
                </Button>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Name</th>
                      <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Quantity</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Unit</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Area</th>
                      <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-right">{item.quantity.toFixed(1)}</td>
                        <td className="p-2">{item.unit}</td>
                        <td className="p-2">{item.area}</td>
                        <td className="p-2 text-center">
                          {item.calculatedBy === 'ai' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              <MessageSquare className="h-3 w-3 mr-1" /> AI
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-800">
                              Manual
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* AI Assist Tab */}
          <TabsContent value="assist">
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-md p-4 border">
                <h4 className="font-medium mb-2">AI Analysis</h4>
                <p className="text-sm text-slate-600 mb-3">
                  The AI has identified the following quantities based on the blueprint:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between items-center bg-white p-2 rounded border">
                    <span>Asphalt Paving</span>
                    <span className="font-mono">2,450.5 sq ft</span>
                  </li>
                  <li className="flex justify-between items-center bg-white p-2 rounded border">
                    <span>Concrete Curbing</span>
                    <span className="font-mono">328.2 linear ft</span>
                  </li>
                  {items.length > 2 && (
                    <li className="flex justify-between items-center bg-white p-2 rounded border">
                      <span>Drainage Piping</span>
                      <span className="font-mono">175.0 linear ft</span>
                    </li>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Ask AI Assistant</h4>
                <div className="flex space-x-2">
                  <Input placeholder="Ask something about the takeoff..." className="flex-1" />
                  <Button>Ask</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
