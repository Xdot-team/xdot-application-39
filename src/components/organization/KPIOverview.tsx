import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Filter, Plus, Search, TrendingDown, TrendingUp, Minus, Edit, Trash2 } from 'lucide-react';
import { useKPIs } from '@/hooks/useOrganizationData';
import { useToast } from '@/hooks/use-toast';

export function KPIOverview() {
  const { kpis, loading, error, createKPI, updateKPI } = useKPIs();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKPI, setNewKPI] = useState({
    name: '',
    category: '',
    description: '',
    current_value: 0,
    target_value: 0,
    unit: '',
    trend: 'stable' as const,
    period: 'monthly' as const
  });
  
  const filteredKPIs = kpis.filter(kpi => 
    kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    kpi.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const categoryKPIs = {
    all: filteredKPIs,
    financial: filteredKPIs.filter(kpi => kpi.category === 'financial'),
    productivity: filteredKPIs.filter(kpi => kpi.category === 'productivity'),
    safety: filteredKPIs.filter(kpi => kpi.category === 'safety'),
    quality: filteredKPIs.filter(kpi => kpi.category === 'quality'),
    customer_satisfaction: filteredKPIs.filter(kpi => kpi.category === 'customer_satisfaction'),
  };

  const handleCreateKPI = async () => {
    try {
      await createKPI({
        ...newKPI,
        last_updated: new Date().toISOString()
      });
      setIsCreateDialogOpen(false);
      setNewKPI({
        name: '',
        category: '',
        description: '',
        current_value: 0,
        target_value: 0,
        unit: '',
        trend: 'stable',
        period: 'monthly'
      });
      toast({
        title: "KPI Created",
        description: "New KPI has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create KPI",
        variant: "destructive",
      });
    }
  };
  
  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      financial: "bg-green-100 text-green-800",
      productivity: "bg-blue-100 text-blue-800",
      safety: "bg-red-100 text-red-800",
      quality: "bg-purple-100 text-purple-800",
      customer_satisfaction: "bg-orange-100 text-orange-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="text-center py-8">Loading KPIs...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Key Performance Indicators</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search KPIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-[250px]"
            />
          </div>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New KPI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New KPI</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newKPI.name}
                    onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
                    placeholder="KPI name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setNewKPI({ ...newKPI, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                      <SelectItem value="customer_satisfaction">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newKPI.description}
                    onChange={(e) => setNewKPI({ ...newKPI, description: e.target.value })}
                    placeholder="KPI description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current_value">Current Value</Label>
                    <Input
                      id="current_value"
                      type="number"
                      value={newKPI.current_value}
                      onChange={(e) => setNewKPI({ ...newKPI, current_value: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_value">Target Value</Label>
                    <Input
                      id="target_value"
                      type="number"
                      value={newKPI.target_value}
                      onChange={(e) => setNewKPI({ ...newKPI, target_value: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newKPI.unit}
                    onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
                    placeholder="e.g., %, $, hours"
                  />
                </div>
                <Button onClick={handleCreateKPI} className="w-full">
                  Create KPI
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full md:w-[600px] mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="customer_satisfaction">Customer</TabsTrigger>
        </TabsList>
        
        {Object.entries(categoryKPIs).map(([category, kpis]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {kpis.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No KPIs found for this category
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kpis.map((kpi) => (
                  <Card key={kpi.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className={getCategoryColor(kpi.category)}>
                            {kpi.category.replace('_', ' ')}
                          </Badge>
                          <CardTitle className="text-lg mt-2">{kpi.name}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderTrendIcon(kpi.trend)}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>{kpi.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Current: <span className="font-bold">{kpi.current_value}{kpi.unit}</span></span>
                          <span>Target: <span className="font-medium">{kpi.target_value}{kpi.unit}</span></span>
                        </div>
                        
                        <Progress value={Math.min(100, Math.round((kpi.current_value / kpi.target_value) * 100))} className="h-2" />
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Updated: {new Date(kpi.last_updated).toLocaleDateString()}</span>
                          <span className="capitalize">{kpi.period}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}