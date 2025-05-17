
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus, Eye, Save, BarChart, PieChart, LineChart, Table } from 'lucide-react';
import { getReportsData } from '@/data/mockReportsData';
import { ReportMetric, ReportFilter, ReportVisualization } from '@/types/reports';

export function ReportBuilder() {
  const { reports } = getReportsData();
  const [activeStep, setActiveStep] = useState('info');
  
  // Basic information state
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportType, setReportType] = useState('project');
  
  // Metrics state
  const [selectedMetrics, setSelectedMetrics] = useState<ReportMetric[]>([]);
  
  // Filters state
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  
  // Visualizations state
  const [visualizations, setVisualizations] = useState<ReportVisualization[]>([]);

  // All available metrics (this would typically come from an API)
  const availableMetrics: ReportMetric[] = reports.flatMap(report => report.metrics)
    .filter((metric, index, self) => index === self.findIndex(m => m.id === metric.id));
  
  const addMetric = (metric: ReportMetric) => {
    setSelectedMetrics(prev => {
      if (prev.some(m => m.id === metric.id)) {
        return prev;
      }
      return [...prev, metric];
    });
  };
  
  const removeMetric = (metricId: string) => {
    setSelectedMetrics(prev => prev.filter(m => m.id !== metricId));
  };
  
  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: `f${filters.length + 1}`,
      field: '',
      operator: 'equals',
      value: ''
    };
    setFilters(prev => [...prev, newFilter]);
  };
  
  const removeFilter = (filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  };
  
  const addVisualization = (type: 'bar' | 'line' | 'pie' | 'table') => {
    const newVisualization: ReportVisualization = {
      id: `v${visualizations.length + 1}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      metrics: selectedMetrics.slice(0, 2).map(m => m.id),
      config: getDefaultConfig(type)
    };
    setVisualizations(prev => [...prev, newVisualization]);
  };
  
  const removeVisualization = (vizId: string) => {
    setVisualizations(prev => prev.filter(v => v.id !== vizId));
  };
  
  const getDefaultConfig = (type: string) => {
    switch(type) {
      case 'bar':
        return { xAxis: 'category', stacked: false };
      case 'line':
        return { xAxis: 'date', showMarkers: true };
      case 'pie':
        return { showLegend: true, showTotal: true };
      case 'table':
        return { sortable: true, filterable: true };
      default:
        return {};
    }
  };
  
  const handleSaveReport = () => {
    if (!reportName) {
      alert("Report name is required");
      return;
    }
    
    if (selectedMetrics.length === 0) {
      alert("At least one metric must be selected");
      return;
    }
    
    const newReport = {
      name: reportName,
      description: reportDescription,
      type: reportType,
      metrics: selectedMetrics,
      filters,
      visualizations
    };
    
    console.log("Saving report:", newReport);
    // In a real implementation, this would be sent to an API
    alert("Report saved successfully!");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold">Report Builder</h2>
        
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" /> Preview
          </Button>
          <Button onClick={handleSaveReport}>
            <Save className="h-4 w-4 mr-2" /> Save Report
          </Button>
        </div>
      </div>
      
      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
              <CardDescription>Define the basic information for your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input 
                  id="report-name" 
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea 
                  id="report-description"
                  placeholder="Enter a description of the report"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="labor">Labor</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setActiveStep('metrics')}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Metrics</CardTitle>
              <CardDescription>Choose the metrics to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Available Metrics</h3>
                  <div className="border rounded-lg p-4 h-[400px] overflow-y-auto">
                    {availableMetrics.map((metric) => (
                      <div key={metric.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{metric.name}</p>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                          <Badge variant="outline" className="mt-1">
                            {metric.category}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => addMetric(metric)}
                          disabled={selectedMetrics.some(m => m.id === metric.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Selected Metrics</h3>
                  <div className="border rounded-lg p-4 h-[400px] overflow-y-auto">
                    {selectedMetrics.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No metrics selected</p>
                    ) : (
                      selectedMetrics.map((metric) => (
                        <div key={metric.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{metric.name}</p>
                            <p className="text-sm text-muted-foreground">{metric.description}</p>
                            <Badge variant="outline" className="mt-1">
                              {metric.category}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeMetric(metric.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveStep('info')}>Back</Button>
                <Button onClick={() => setActiveStep('filters')}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Filters Tab */}
        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Configure Filters</CardTitle>
                <CardDescription>Define how to filter the data in your report</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Plus className="h-4 w-4 mr-2" /> Add Filter
              </Button>
            </CardHeader>
            <CardContent>
              {filters.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">No filters defined</p>
                  <p className="text-sm text-muted-foreground mt-2">Click 'Add Filter' to create a new filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filters.map((filter) => (
                    <div key={filter.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Filter {filters.indexOf(filter) + 1}</h3>
                        <Button variant="ghost" size="sm" onClick={() => removeFilter(filter.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`field-${filter.id}`}>Field</Label>
                            <Select 
                              value={filter.field} 
                              onValueChange={(value) => {
                                const updatedFilters = filters.map(f => 
                                  f.id === filter.id ? { ...f, field: value } : f
                                );
                                setFilters(updatedFilters);
                              }}
                            >
                              <SelectTrigger id={`field-${filter.id}`}>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="region">Region</SelectItem>
                                <SelectItem value="projectType">Project Type</SelectItem>
                                <SelectItem value="projectId">Project ID</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor={`operator-${filter.id}`}>Operator</Label>
                            <Select 
                              value={filter.operator} 
                              onValueChange={(value: any) => {
                                const updatedFilters = filters.map(f => 
                                  f.id === filter.id ? { ...f, operator: value } : f
                                );
                                setFilters(updatedFilters);
                              }}
                            >
                              <SelectTrigger id={`operator-${filter.id}`}>
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="not_equals">Not Equals</SelectItem>
                                <SelectItem value="greater_than">Greater Than</SelectItem>
                                <SelectItem value="less_than">Less Than</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="in_range">In Range</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor={`value-${filter.id}`}>Value</Label>
                            <Input 
                              id={`value-${filter.id}`} 
                              placeholder="Enter value"
                              value={typeof filter.value === 'string' ? filter.value : JSON.stringify(filter.value)}
                              onChange={(e) => {
                                const updatedFilters = filters.map(f => 
                                  f.id === filter.id ? { ...f, value: e.target.value } : f
                                );
                                setFilters(updatedFilters);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveStep('metrics')}>Back</Button>
                <Button onClick={() => setActiveStep('visualizations')}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Visualizations Tab */}
        <TabsContent value="visualizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visualizations</CardTitle>
              <CardDescription>Define charts and tables for your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addVisualization('bar')}
                  disabled={selectedMetrics.length === 0}
                >
                  <BarChart className="h-4 w-4 mr-2" /> Bar Chart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addVisualization('line')}
                  disabled={selectedMetrics.length === 0}
                >
                  <LineChart className="h-4 w-4 mr-2" /> Line Chart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addVisualization('pie')}
                  disabled={selectedMetrics.length === 0}
                >
                  <PieChart className="h-4 w-4 mr-2" /> Pie Chart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addVisualization('table')}
                  disabled={selectedMetrics.length === 0}
                >
                  <Table className="h-4 w-4 mr-2" /> Table
                </Button>
              </div>
              
              {selectedMetrics.length === 0 && (
                <div className="text-center py-4 border rounded-lg mb-6">
                  <p className="text-muted-foreground">Please select at least one metric to create visualizations</p>
                </div>
              )}
              
              {visualizations.length === 0 && selectedMetrics.length > 0 && (
                <div className="text-center py-8 border rounded-lg mb-6">
                  <p className="text-muted-foreground">No visualizations defined</p>
                  <p className="text-sm text-muted-foreground mt-2">Click on the buttons above to add charts and tables</p>
                </div>
              )}
              
              <div className="space-y-4">
                {visualizations.map((viz) => (
                  <div key={viz.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        {viz.type === 'bar' && <BarChart className="h-5 w-5 mr-2" />}
                        {viz.type === 'line' && <LineChart className="h-5 w-5 mr-2" />}
                        {viz.type === 'pie' && <PieChart className="h-5 w-5 mr-2" />}
                        {viz.type === 'table' && <Table className="h-5 w-5 mr-2" />}
                        <h3 className="font-medium capitalize">{viz.type} Visualization</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeVisualization(viz.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`title-${viz.id}`}>Title</Label>
                        <Input 
                          id={`title-${viz.id}`} 
                          value={viz.title}
                          onChange={(e) => {
                            const updatedViz = visualizations.map(v => 
                              v.id === viz.id ? { ...v, title: e.target.value } : v
                            );
                            setVisualizations(updatedViz);
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label>Metrics</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {selectedMetrics.map((metric) => (
                            <div key={metric.id} className="flex items-start space-x-2">
                              <Checkbox 
                                id={`metric-${viz.id}-${metric.id}`} 
                                checked={viz.metrics.includes(metric.id)}
                                onCheckedChange={(checked) => {
                                  const updatedViz = visualizations.map(v => {
                                    if (v.id === viz.id) {
                                      if (checked) {
                                        return { ...v, metrics: [...v.metrics, metric.id] };
                                      } else {
                                        return { ...v, metrics: v.metrics.filter(m => m !== metric.id) };
                                      }
                                    }
                                    return v;
                                  });
                                  setVisualizations(updatedViz);
                                }}
                              />
                              <Label
                                htmlFor={`metric-${viz.id}-${metric.id}`}
                                className="text-sm font-normal"
                              >
                                {metric.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveStep('filters')}>Back</Button>
                <Button onClick={handleSaveReport}>Save Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
