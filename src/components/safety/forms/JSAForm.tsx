
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { JobSafetyAnalysisData, JobSafetyAnalysisItem, JSATemplate } from "@/types/safety";
import { Plus, Trash, ArrowLeft, ClipboardList, FileCheck, CheckCircle, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

interface JSAFormProps {
  jsaData: JobSafetyAnalysisData | null;
  templates: JSATemplate[];
  onSave: (jsaData: JobSafetyAnalysisData) => void;
  onCancel: () => void;
}

export function JSAForm({ jsaData, templates, onSave, onCancel }: JSAFormProps) {
  // Sample Project IDs for demo
  const sampleProjects = [
    { id: "P-1001", name: "I-85 Bridge Repair" },
    { id: "P-1002", name: "GA-400 Repaving" },
    { id: "P-1003", name: "I-75 Resurfacing" },
    { id: "P-1004", name: "I-285 Bridge Project" },
    { id: "P-1005", name: "Main Yard Expansion" }
  ];

  const [activeTab, setActiveTab] = useState("basics");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JSATemplate | null>(null);

  const emptyJsaItem: JobSafetyAnalysisItem = {
    id: `tmp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    jsaId: "",
    taskStep: "",
    potentialHazards: [],
    controlMeasures: [],
    status: "not_started"
  };

  const [formData, setFormData] = useState<JobSafetyAnalysisData>({
    id: jsaData?.id || `jsa-${Date.now()}`,
    title: jsaData?.title || "",
    projectId: jsaData?.projectId || "",
    projectName: jsaData?.projectName || "",
    location: jsaData?.location || "",
    taskDescription: jsaData?.taskDescription || "",
    createdBy: jsaData?.createdBy || "Current User", // In a real app, this would be the logged-in user
    createdDate: jsaData?.createdDate || new Date().toISOString().split('T')[0],
    reviewedBy: jsaData?.reviewedBy || "",
    reviewDate: jsaData?.reviewDate || "",
    approvedBy: jsaData?.approvedBy || "",
    approvalDate: jsaData?.approvalDate || "",
    status: jsaData?.status || "draft",
    requiredPPE: jsaData?.requiredPPE || [],
    requiredEquipment: jsaData?.requiredEquipment || [],
    items: jsaData?.items || [{ ...emptyJsaItem }],
    templateId: jsaData?.templateId || "",
    isTemplate: jsaData?.isTemplate || false,
    lastUpdated: new Date().toISOString().split('T')[0],
    comments: jsaData?.comments || ""
  });

  const [newPPE, setNewPPE] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [newHazard, setNewHazard] = useState("");
  const [newControlMeasure, setNewControlMeasure] = useState("");
  const [editingItemIndex, setEditingItemIndex] = useState(-1);

  // Generic text field change handler
  const handleTextChange = (field: keyof JobSafetyAnalysisData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle project selection 
  const handleProjectChange = (projectId: string) => {
    const selectedProject = sampleProjects.find(p => p.id === projectId);
    setFormData(prev => ({ 
      ...prev, 
      projectId, 
      projectName: selectedProject?.name || ""
    }));
  };

  // PPE handling
  const addPPE = () => {
    if (newPPE.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredPPE: [...prev.requiredPPE, newPPE.trim()]
      }));
      setNewPPE("");
    }
  };

  const removePPE = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredPPE: prev.requiredPPE.filter((_, i) => i !== index)
    }));
  };

  // Equipment handling
  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredEquipment: [...prev.requiredEquipment, newEquipment.trim()]
      }));
      setNewEquipment("");
    }
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredEquipment: prev.requiredEquipment.filter((_, i) => i !== index)
    }));
  };

  // Task item handling
  const handleItemChange = (index: number, field: keyof JobSafetyAnalysisItem, value: any) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { 
        ...updatedItems[index], 
        [field]: value 
      };
      return { ...prev, items: updatedItems };
    });
  };

  const addTaskItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        ...emptyJsaItem,
        id: `tmp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        jsaId: prev.id
      }]
    }));
  };

  const removeTaskItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const moveTaskItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formData.items.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    setFormData(prev => {
      const updatedItems = [...prev.items];
      [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
      return { ...prev, items: updatedItems };
    });
  };

  // Hazard and control measure handling
  const addHazard = () => {
    if (newHazard.trim() && editingItemIndex !== -1) {
      setFormData(prev => {
        const updatedItems = [...prev.items];
        updatedItems[editingItemIndex] = {
          ...updatedItems[editingItemIndex],
          potentialHazards: [...updatedItems[editingItemIndex].potentialHazards, newHazard.trim()]
        };
        return { ...prev, items: updatedItems };
      });
      setNewHazard("");
    }
  };

  const removeHazard = (itemIndex: number, hazardIndex: number) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        potentialHazards: updatedItems[itemIndex].potentialHazards.filter((_, i) => i !== hazardIndex)
      };
      return { ...prev, items: updatedItems };
    });
  };

  const addControlMeasure = () => {
    if (newControlMeasure.trim() && editingItemIndex !== -1) {
      setFormData(prev => {
        const updatedItems = [...prev.items];
        updatedItems[editingItemIndex] = {
          ...updatedItems[editingItemIndex],
          controlMeasures: [...updatedItems[editingItemIndex].controlMeasures, newControlMeasure.trim()]
        };
        return { ...prev, items: updatedItems };
      });
      setNewControlMeasure("");
    }
  };

  const removeControlMeasure = (itemIndex: number, measureIndex: number) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        controlMeasures: updatedItems[itemIndex].controlMeasures.filter((_, i) => i !== measureIndex)
      };
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the JSA");
      return;
    }
    
    if (!formData.projectId) {
      toast.error("Please select a project");
      return;
    }
    
    if (!formData.taskDescription.trim()) {
      toast.error("Please enter a task description");
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error("Please add at least one task item");
      return;
    }
    
    // Check if each task item has a task step
    const invalidItems = formData.items.filter(item => !item.taskStep.trim());
    if (invalidItems.length > 0) {
      toast.error("All task items must have a task step");
      return;
    }
    
    // Save the JSA data
    onSave(formData);
    toast.success("JSA saved successfully");
  };

  const applyTemplate = (template: JSATemplate) => {
    setFormData(prev => ({
      ...prev,
      taskDescription: template.taskDescription,
      requiredPPE: [...template.requiredPPE],
      requiredEquipment: [...template.requiredEquipment],
      items: template.items.map(item => ({
        id: `tmp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        jsaId: prev.id,
        taskStep: item.taskStep,
        potentialHazards: [...item.potentialHazards],
        controlMeasures: [...item.controlMeasures],
        status: "not_started" as const
      })),
      templateId: template.id
    }));
    setTemplateDialogOpen(false);
    setActiveTab("items");
    toast.success("Template applied successfully");
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onCancel} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold">{jsaData ? "Edit" : "Create"} Job Safety Analysis</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="basics" className="flex items-center gap-1">
            <ClipboardList className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-1">
            <FileCheck className="h-4 w-4" />
            <span>Task Items</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for this JSA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">JSA Title *</Label>
                  <Input 
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTextChange("title", e.target.value)}
                    placeholder="Enter JSA title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select 
                    value={formData.projectId} 
                    onValueChange={handleProjectChange}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleTextChange("location", e.target.value)}
                  placeholder="Enter work location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskDescription">Task Description *</Label>
                <Textarea 
                  id="taskDescription"
                  value={formData.taskDescription}
                  onChange={(e) => handleTextChange("taskDescription", e.target.value)}
                  placeholder="Describe the task to be performed"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Required PPE</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setTemplateDialogOpen(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Use Template
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newPPE}
                    onChange={(e) => setNewPPE(e.target.value)}
                    placeholder="Add PPE item"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addPPE}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requiredPPE.map((ppe, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      {ppe}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removePPE(index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Equipment</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Add equipment"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addEquipment}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requiredEquipment.map((equipment, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      {equipment}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeEquipment(index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea 
                  id="comments"
                  value={formData.comments || ""}
                  onChange={(e) => handleTextChange("comments", e.target.value)}
                  placeholder="Enter any additional comments or notes"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
              <div className="space-x-2">
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("items")}
                  variant="default"
                >
                  Next: Task Items
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Task Items</CardTitle>
              <CardDescription>Break down the task into steps and identify hazards and controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.items.map((item, index) => (
                <Card key={item.id} className="border border-muted">
                  <CardHeader className="py-3 px-4 bg-muted/20 flex flex-row items-center justify-between space-y-0">
                    <div className="flex-1">
                      <CardTitle className="text-base">Step {index + 1}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveTaskItem(index, 'up')} 
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveTaskItem(index, 'down')} 
                        disabled={index === formData.items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost"
                        size="icon" 
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTaskItem(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`task-step-${index}`}>Task Step *</Label>
                      <Input 
                        id={`task-step-${index}`}
                        value={item.taskStep}
                        onChange={(e) => handleItemChange(index, "taskStep", e.target.value)}
                        placeholder="Describe this step of the task"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Potential Hazards</Label>
                        <div className="flex flex-wrap gap-2">
                          {item.potentialHazards.map((hazard, hazardIndex) => (
                            <Badge key={hazardIndex} variant="outline" className="flex items-center gap-1 px-2 py-1">
                              {hazard}
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeHazard(index, hazardIndex)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setEditingItemIndex(index)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Edit Hazards
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Control Measures</Label>
                        <div className="flex flex-wrap gap-2">
                          {item.controlMeasures.map((measure, measureIndex) => (
                            <Badge key={measureIndex} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                              {measure}
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeControlMeasure(index, measureIndex)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setEditingItemIndex(index)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Edit Controls
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={addTaskItem}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Task Step
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basics")}>
                Back
              </Button>
              <Button variant="default" onClick={handleSubmit}>
                Save JSA
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select JSA Template</DialogTitle>
            <DialogDescription>
              Choose a template to pre-fill the JSA with common tasks and hazards
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto py-4">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.category}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="line-clamp-2">{template.taskDescription}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {template.items.length} steps • {template.requiredPPE.length} PPE items
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setTemplateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={() => selectedTemplate && applyTemplate(selectedTemplate)}
              disabled={!selectedTemplate}
            >
              Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingItemIndex !== -1} onOpenChange={(open) => !open && setEditingItemIndex(-1)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Hazards & Controls</DialogTitle>
            <DialogDescription>
              Add potential hazards and control measures for this task step
            </DialogDescription>
          </DialogHeader>
          
          {editingItemIndex !== -1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Task: {formData.items[editingItemIndex].taskStep}</h3>
              </div>
              
              <div className="space-y-2">
                <Label>Potential Hazards</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newHazard}
                    onChange={(e) => setNewHazard(e.target.value)}
                    placeholder="Add hazard"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addHazard}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.items[editingItemIndex].potentialHazards.map((hazard, hazardIndex) => (
                    <Badge key={hazardIndex} variant="outline" className="flex items-center gap-1 px-2 py-1">
                      {hazard}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeHazard(editingItemIndex, hazardIndex)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Control Measures</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newControlMeasure}
                    onChange={(e) => setNewControlMeasure(e.target.value)}
                    placeholder="Add control measure"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addControlMeasure}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.items[editingItemIndex].controlMeasures.map((measure, measureIndex) => (
                    <Badge key={measureIndex} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      {measure}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeControlMeasure(editingItemIndex, measureIndex)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="default" 
              onClick={() => setEditingItemIndex(-1)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
