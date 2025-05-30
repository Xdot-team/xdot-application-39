
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Risk, RiskAction, RiskMitigation as RiskMitigationType } from "@/types/safety";
import { useForm } from "react-hook-form";
import { AlertTriangle, Calendar, CheckCircle, FileText, Plus, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { mockRisks } from "@/data/mockSafetyData";

interface MitigationFormData {
  strategy: 'avoid' | 'transfer' | 'mitigate' | 'accept';
  description: string;
  responsible?: string;
  estimatedCost?: number;
}

export function RiskMitigation() {
  const [risks] = useState<Risk[]>(mockRisks);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("create");
  const [actions, setActions] = useState<RiskAction[]>([]);
  
  const form = useForm<MitigationFormData>({
    defaultValues: {
      strategy: 'mitigate',
      description: '',
      responsible: '',
      estimatedCost: 0,
    }
  });
  
  const selectedRisk = selectedRiskId ? risks.find(r => r.id === selectedRiskId) : null;
  
  const handleAddAction = () => {
    const newAction: RiskAction = {
      id: `action-${Date.now()}`,
      description: '',
      status: 'pending',
      dueDate: '',
      assignedTo: '',
    };
    
    setActions([...actions, newAction]);
  };
  
  const handleUpdateAction = (index: number, field: keyof RiskAction, value: string) => {
    const updatedActions = [...actions];
    updatedActions[index] = {
      ...updatedActions[index],
      [field]: value
    };
    setActions(updatedActions);
  };
  
  const handleRemoveAction = (index: number) => {
    const updatedActions = [...actions];
    updatedActions.splice(index, 1);
    setActions(updatedActions);
  };

  const onSubmit = (data: MitigationFormData) => {
    if (!selectedRisk) {
      toast.error("Please select a risk first");
      return;
    }
    
    if (actions.length === 0) {
      toast.error("Please add at least one action item");
      return;
    }
    
    if (actions.some(a => !a.description)) {
      toast.error("All action items must have descriptions");
      return;
    }
    
    const mitigation: RiskMitigationType = {
      id: `mitigation-${Date.now()}`,
      riskId: selectedRisk.id,
      strategy: data.strategy,
      description: data.description,
      responsible: data.responsible,
      estimatedCost: data.estimatedCost,
      actions: actions,
      status: 'draft'
    };
    
    console.log("Created mitigation plan:", mitigation);
    
    toast.success("Mitigation plan created", {
      description: "Plan has been saved and assigned to the risk"
    });
    
    form.reset();
    setActions([]);
    setActiveTab("all");
  };
  
  const getStrategyDescription = (strategy: string) => {
    switch(strategy) {
      case 'avoid': return "Eliminate the threat by eliminating the cause";
      case 'mitigate': return "Reduce probability and/or impact of the threat";
      case 'transfer': return "Shift the impact to a third party";
      case 'accept': return "Acknowledge the risk without taking action";
      default: return "";
    }
  };

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create Mitigation Plan</TabsTrigger>
          <TabsTrigger value="all">View Mitigation Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Select Risk</CardTitle>
                <CardDescription>
                  Choose a risk to create a mitigation plan
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {risks.map(risk => (
                    <Card 
                      key={risk.id}
                      className={`cursor-pointer hover:border-primary transition-colors overflow-hidden ${selectedRiskId === risk.id ? 'border-2 border-primary' : ''}`}
                      onClick={() => setSelectedRiskId(risk.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          {risk.isHighPriority && (
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                          )}
                          <div>
                            <h3 className="font-medium text-sm">{risk.title}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge className="capitalize">{risk.category}</Badge>
                              <span className="text-xs text-muted-foreground">
                                Score: {risk.riskScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Create Mitigation Plan</CardTitle>
                <CardDescription>
                  {selectedRisk 
                    ? `Create a plan to mitigate: ${selectedRisk.title}` 
                    : "Select a risk first to create a mitigation plan"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRisk ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="bg-muted/50 p-3 rounded-md mb-4">
                        <h3 className="font-medium">{selectedRisk.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedRisk.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge>Category: {selectedRisk.category}</Badge>
                          <Badge variant="outline">Score: {selectedRisk.riskScore}</Badge>
                          <Badge variant="outline">Project: {selectedRisk.projectName || 'Global'}</Badge>
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="strategy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mitigation Strategy</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a strategy" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="avoid">Avoid</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                                <SelectItem value="mitigate">Mitigate</SelectItem>
                                <SelectItem value="accept">Accept</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getStrategyDescription(field.value)}
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the overall mitigation approach..."
                                {...field}
                                className="min-h-24"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="responsible"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Responsible Person</FormLabel>
                              <FormControl>
                                <Input placeholder="Person responsible for this plan" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="estimatedCost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Cost (optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Cost in dollars" 
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium">Action Items</h3>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={handleAddAction}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Action
                          </Button>
                        </div>
                        
                        {actions.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No action items added yet. Add some using the button above.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {actions.map((action, index) => (
                              <Card key={index}>
                                <CardContent className="p-3">
                                  <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-3">
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-xs font-medium">Description</label>
                                        <Input 
                                          value={action.description} 
                                          onChange={(e) => handleUpdateAction(index, 'description', e.target.value)}
                                          placeholder="What needs to be done"
                                          className="mt-1"
                                        />
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs font-medium">Assigned To</label>
                                          <div className="flex items-center gap-1 mt-1">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            <Input 
                                              value={action.assignedTo || ''} 
                                              onChange={(e) => handleUpdateAction(index, 'assignedTo', e.target.value)}
                                              placeholder="Name"
                                            />
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <label className="text-xs font-medium">Due Date</label>
                                          <div className="flex items-center gap-1 mt-1">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <Input 
                                              type="date"
                                              value={action.dueDate || ''} 
                                              onChange={(e) => handleUpdateAction(index, 'dueDate', e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      onClick={() => handleRemoveAction(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Create Mitigation Plan
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Please select a risk from the list to create a mitigation plan
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Mitigation Plans</CardTitle>
              <CardDescription>
                View and manage existing risk mitigation plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* This would be populated with actual mitigation plans from backend */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Plans Created Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating a mitigation plan for an identified risk
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  Create Your First Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
