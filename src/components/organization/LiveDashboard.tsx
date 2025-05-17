
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, PieChart, ArrowUpRight, ArrowDownRight, Download, RefreshCcw } from 'lucide-react';
import { getOrganizationData } from '@/data/mockOrganizationData';
import { ProgressCircle } from '@/components/organization/ProgressCircle';
import { XDOTPluginWidget } from '@/components/organization/XDOTPluginWidget';

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";

import {
  BarChart as ReBarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

interface LiveDashboardProps {
  handleExport: (format: string) => void;
}

export function LiveDashboard({ handleExport }: LiveDashboardProps) {
  const [timeRange, setTimeRange] = useState('month');
  const orgData = getOrganizationData();
  
  const projectData = [
    { name: 'I-75 Bridge', completed: 65, remaining: 35 },
    { name: 'US-29 Highway', completed: 40, remaining: 60 },
    { name: 'GA-400 Expansion', completed: 85, remaining: 15 },
    { name: 'I-85 Interchange', completed: 25, remaining: 75 },
  ];
  
  const revenueData = [
    { name: 'Jan', value: 1200000 },
    { name: 'Feb', value: 1500000 },
    { name: 'Mar', value: 1400000 },
    { name: 'Apr', value: 1800000 },
    { name: 'May', value: 2000000 },
  ];
  
  const resourceData = [
    { name: 'Labor', value: 45 },
    { name: 'Equipment', value: 25 },
    { name: 'Materials', value: 20 },
    { name: 'Subcontractors', value: 10 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Live Dashboard</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="ghost" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI Cards */}
        {orgData.kpis.slice(0, 3).map((kpi) => (
          <Card key={kpi.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{kpi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold mr-2">
                      {kpi.value}{kpi.unit}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Target: {kpi.target}{kpi.unit}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center">
                    {kpi.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : kpi.trend === 'down' ? (
                      <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <span className="h-4 w-4 text-yellow-500 mr-1">→</span>
                    )}
                    <span className={`text-xs ${kpi.trend === 'up' ? 'text-green-500' : kpi.trend === 'down' ? 'text-red-500' : 'text-yellow-500'}`}>
                      {kpi.trend === 'up' ? 'Trending up' : kpi.trend === 'down' ? 'Trending down' : 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="h-16 w-16">
                  <ProgressCircle 
                    percentage={Math.min(100, Math.round((kpi.value / kpi.target) * 100))}
                    size={64}
                    strokeWidth={6}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle className="text-lg">Project Completion Status</CardTitle>
            <CardDescription>Current progress across active Georgia projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <ReBarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="completed" stackId="a" fill="#4f46e5" />
                <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" />
              </ReBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Resource Allocation</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer className="h-[250px]" config={{}}>
              <RePieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" content={<ChartLegendContent />} />
              </RePieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue for 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[250px]" config={{}}>
              <ReLineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </ReLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              xDOT Plugin - Performance Metrics
            </CardTitle>
            <CardDescription>
              Georgia DOT project performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <XDOTPluginWidget data={orgData.xdotPluginData[0]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
