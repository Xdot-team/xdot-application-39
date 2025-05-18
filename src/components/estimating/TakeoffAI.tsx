
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Search, Square, Upload, Zap, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface TakeoffItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  area: string;
  calculatedBy: 'manual' | 'ai';
}

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

export default function TakeoffAI() {
  const [activeTab, setActiveTab] = useState('blueprint');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Create a fake upload progress simulation
      const newImage: UploadedImage = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        progress: 0,
        status: 'uploading'
      };
      
      setUploadedImages([...uploadedImages, newImage]);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedImages(prev => 
          prev.map(img => 
            img.id === newImage.id
              ? { 
                  ...img, 
                  progress: Math.min(img.progress + 20, 100),
                  status: img.progress + 20 >= 100 ? 'complete' : 'uploading'
                }
              : img
          )
        );
      }, 500);
      
      // Clear interval after upload is "complete"
      setTimeout(() => {
        clearInterval(interval);
        toast.success(`Blueprint "${file.name}" uploaded successfully`);
      }, 2500);
    }
  };

  const handleAiDetect = () => {
    if (!uploadedImages.some(img => img.status === 'complete')) {
      toast.error('Please upload a blueprint first');
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate AI processing
    const processingInterval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + 15;
        if (newProgress >= 100) {
          clearInterval(processingInterval);
          setIsProcessing(false);
          
          // Add example AI-detected items
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
          
          setItems(prev => [...prev, ...newItems]);
          toast.success('AI has detected 2 new quantities in the blueprint');
        }
        
        return newProgress;
      });
    }, 600);
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
  
  const handleImageRecognition = () => {
    if (!uploadedImages.some(img => img.status === 'complete')) {
      toast.error('Please upload a blueprint first');
      return;
    }
    
    toast.info('Analyzing blueprint features...');
    setIsProcessing(true);
    
    // Simulate ML processing with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        toast.success('Blueprint analysis complete');
      }
    }, 400);
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
            {uploadedImages.length > 0 ? (
              <div className="space-y-4">
                {uploadedImages.map(image => (
                  <div key={image.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">{image.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {image.status === 'uploading' ? 'Uploading...' : 
                         image.status === 'processing' ? 'Processing...' : 
                         image.status === 'complete' ? 'Ready' : 'Error'}
                      </span>
                    </div>
                    {image.status === 'uploading' && (
                      <Progress value={image.progress} className="h-1" />
                    )}
                    {image.status === 'complete' && (
                      <div className="aspect-[16/9] bg-slate-100 rounded-md mt-2 relative">
                        <img 
                          src={image.url} 
                          alt={image.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="flex justify-between">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" /> New Blueprint
                    </Button>
                    <Button variant="outline" size="sm">
                      <Square className="h-4 w-4 mr-1" /> Area
                    </Button>
                  </div>
                  
                  {aiEnabled && (
                    <Button variant="default" size="sm" onClick={handleAiDetect} disabled={isProcessing}>
                      {isProcessing ? (
                        <>Processing... {processingProgress}%</>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 mr-1" /> AI Detect
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-md h-64 flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                  <p className="mb-2 text-sm text-slate-600">Drag & drop your blueprint or click to upload</p>
                  <Input
                    type="file"
                    id="blueprint-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="blueprint-upload">
                    <Button variant="secondary" size="sm" className="cursor-pointer" asChild>
                      <span>Upload Blueprint</span>
                    </Button>
                  </label>
                </div>
              </div>
            )}
            
            {isProcessing && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing blueprint...</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-1" />
              </div>
            )}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Advanced Features</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleImageRecognition}
                      disabled={isProcessing}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze Blueprint Features
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Ask AI Assistant</h4>
                  <div className="flex space-x-2">
                    <Input placeholder="Ask something about the takeoff..." className="flex-1" />
                    <Button>Ask</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
