
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EstimateTemplateItem } from '@/types/estimates';
import { FileText, Save, Plus } from 'lucide-react';

interface EstimateTemplatesProps {
  onApplyTemplate: (items: EstimateTemplateItem[]) => void;
}

// Sample template data
const sampleTemplates = [
  {
    id: "template-1",
    name: "Asphalt Paving Project",
    description: "Standard template for asphalt paving projects",
    category: "Paving",
    isPublic: true,
    createdBy: "System",
    itemCount: 15,
  },
  {
    id: "template-2",
    name: "Concrete Bridge Repair",
    description: "Complete bridge repair estimation template",
    category: "Bridge Work",
    isPublic: true,
    createdBy: "System",
    itemCount: 22,
  },
  {
    id: "template-3",
    name: "Traffic Signal Installation",
    description: "Template for traffic signal and control systems",
    category: "Traffic Control",
    isPublic: true,
    createdBy: "System",
    itemCount: 18,
  },
  {
    id: "template-4",
    name: "Sidewalk Construction",
    description: "Standard template for sidewalk construction projects",
    category: "Pedestrian",
    isPublic: true,
    createdBy: "System",
    itemCount: 12,
  },
  {
    id: "template-5",
    name: "Custom GA-400 Template",
    description: "Custom template created for GA-400 projects",
    category: "Custom",
    isPublic: false,
    createdBy: "John Smith",
    itemCount: 28,
  },
];

export default function EstimateTemplates({ onApplyTemplate }: EstimateTemplatesProps) {
  const [activeTab, setActiveTab] = useState("library");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTemplates = sampleTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleApplyTemplate = (templateId: string) => {
    toast.info(`Template "${sampleTemplates.find(t => t.id === templateId)?.name}" applied`);
    // In a real app, we would fetch the template items and apply them
    onApplyTemplate([]);
  };
  
  const handleSaveAsTemplate = () => {
    toast.info("Current estimate saved as template");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="library">Template Library</TabsTrigger>
        <TabsTrigger value="create">Create New Template</TabsTrigger>
      </TabsList>
      
      <TabsContent value="library">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Estimate Templates</CardTitle>
                <CardDescription>
                  Apply pre-defined templates to quickly create new estimates
                </CardDescription>
              </div>
              <Input
                placeholder="Search templates..."
                className="max-w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="flex flex-col h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        {!template.isPublic && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Private
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="secondary">{template.category}</Badge>
                        <span className="text-muted-foreground">{template.itemCount} items</span>
                      </div>
                    </CardContent>
                    <CardFooter className="mt-auto border-t pt-3">
                      <div className="text-xs text-muted-foreground">Created by: {template.createdBy}</div>
                      <Button
                        size="sm"
                        onClick={() => handleApplyTemplate(template.id)}
                        className="ml-auto"
                      >
                        Apply Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {filteredTemplates.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No templates match your search criteria.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
            <CardDescription>
              Save the current estimate as a reusable template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="template-name" className="block text-sm font-medium mb-1">
                    Template Name
                  </label>
                  <Input id="template-name" placeholder="e.g., Standard Highway Project" />
                </div>
                
                <div>
                  <label htmlFor="template-desc" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Input id="template-desc" placeholder="Brief description of the template" />
                </div>
                
                <div>
                  <label htmlFor="template-category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <Input id="template-category" placeholder="e.g., Paving, Bridge Work, etc." />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <input type="checkbox" id="make-public" className="rounded" />
                <label htmlFor="make-public" className="text-sm">Make template available to all users</label>
              </div>
              
              <div className="rounded-md border p-4 mt-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                  <div>
                    <div className="font-medium">Current Estimate Structure</div>
                    <div className="text-sm text-muted-foreground">
                      5 categories, 12 items total
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Plus className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end">
            <Button variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSaveAsTemplate}>
              <Save className="h-4 w-4 mr-1" />
              Save Template
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
