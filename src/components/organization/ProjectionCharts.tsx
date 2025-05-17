
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { getOrganizationData } from '@/data/mockOrganizationData';

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function ProjectionCharts() {
  const [timeframe, setTimeframe] = useState('quarterly');
  const { projections, costBreakdowns, revenueTargets } = getOrganizationData();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Prepare revenue projection chart data
  const revenueProjection = projections.find(p => p.name === 'Annual Revenue Projection');
  
  const revenueChartData = revenueProjection?.data.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
    projected: item.projected,
    actual: item.actual || 0,
  })) || [];
  
  // Prepare cost breakdown chart data
  const costData = costBreakdowns.map(item => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: item.amount,
    percentage: item.percentage,
  }));
  
  // Prepare target vs achieved data
  const revenueTarget = revenueTargets[0];
  const targetData = revenueTarget ? [
    {
      name: 'Q1',
      Target: revenueTarget.quarterly.q1.target,
      Achieved: revenueTarget.quarterly.q1.achieved,
    },
    {
      name: 'Q2',
      Target: revenueTarget.quarterly.q2.target,
      Achieved: revenueTarget.quarterly.q2.achieved,
    },
    {
      name: 'Q3',
      Target: revenueTarget.quarterly.q3.target,
      Achieved: revenueTarget.quarterly.q3.achieved,
    },
    {
      name: 'Q4',
      Target: revenueTarget.quarterly.q4.target,
      Achieved: revenueTarget.quarterly.q4.achieved,
    },
  ] : [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Financial Projections</h2>
        
        <div className="flex flex-wrap gap-3">
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Projections vs. Actual</CardTitle>
            <CardDescription>Year-to-date revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <AreaChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  content={<ChartTooltipContent />}
                />
                <Legend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="projected" stackId="1" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="actual" stackId="2" fill="#82ca9d" stroke="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            <CardDescription>I-75 Bridge Reconstruction project cost allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value / 1000}K`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    return name === 'value' ? formatCurrency(value) : `${value}%`;
                  }}
                  content={<ChartTooltipContent />}
                />
                <Legend content={<ChartLegendContent />} />
                <Bar yAxisId="left" dataKey="value" fill="#8884d8" name="Amount" />
                <Bar yAxisId="right" dataKey="percentage" fill="#82ca9d" name="Percentage" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">2025 Revenue Targets vs. Achievement</CardTitle>
            <CardDescription>Quarterly comparison of targets and actual results</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <BarChart data={targetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  content={<ChartTooltipContent />}
                />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="Target" fill="#8884d8" />
                <Bar dataKey="Achieved" fill="#82ca9d" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
