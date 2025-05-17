
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Filter, Plus, Search, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { getOrganizationData, getKPICategories } from '@/data/mockOrganizationData';
import { KPI } from '@/types/organization';

export function KPIOverview() {
  const [searchTerm, setSearchTerm] = useState('');
  const { kpis } = getOrganizationData();
  const kpiCategories = getKPICategories();
  
  const filteredKPIs = kpis.filter(kpi => 
    kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    kpi.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const categoryKPIs: Record<string, KPI[]> = {
    all: filteredKPIs,
    financial: filteredKPIs.filter(kpi => kpi.category === 'financial'),
    productivity: filteredKPIs.filter(kpi => kpi.category === 'productivity'),
    safety: filteredKPIs.filter(kpi => kpi.category === 'safety'),
    quality: filteredKPIs.filter(kpi => kpi.category === 'quality'),
    customer_satisfaction: filteredKPIs.filter(kpi => kpi.category === 'customer_satisfaction'),
  };
  
  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };
  
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
          
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New KPI
          </Button>
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
                          <Badge className={kpiCategories[kpi.category] || "bg-gray-100 text-gray-800"}>
                            {kpi.category.replace('_', ' ')}
                          </Badge>
                          <CardTitle className="text-lg mt-2">{kpi.name}</CardTitle>
                        </div>
                        {renderTrendIcon(kpi.trend)}
                      </div>
                      <CardDescription>{kpi.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Current: <span className="font-bold">{kpi.value}{kpi.unit}</span></span>
                          <span>Target: <span className="font-medium">{kpi.target}{kpi.unit}</span></span>
                        </div>
                        
                        <Progress value={Math.min(100, Math.round((kpi.value / kpi.target) * 100))} className="h-2" />
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Updated: {new Date(kpi.lastUpdated).toLocaleDateString()}</span>
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
