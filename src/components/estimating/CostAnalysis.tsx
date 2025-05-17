
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from 'react';
import { CostBreakdown } from '@/types/estimates';

// Sample data for charts
const costData = {
  materialCost: 450000,
  laborCost: 320000,
  equipmentCost: 180000,
  subcontractorCost: 210000,
  otherCost: 40000,
  overhead: 120000,
  profit: 132000
};

const actualVsEstimatedData = [
  { name: 'Materials', estimated: 450000, actual: 468000 },
  { name: 'Labor', estimated: 320000, actual: 335000 },
  { name: 'Equipment', estimated: 180000, actual: 172000 },
  { name: 'Subcontractors', estimated: 210000, actual: 215000 },
  { name: 'Other', estimated: 40000, actual: 38000 },
  { name: 'Overhead', estimated: 120000, actual: 120000 },
  { name: 'Profit', estimated: 132000, actual: 124000 }
];

const pieChartData = [
  { name: 'Materials', value: 450000, fill: '#8884d8' },
  { name: 'Labor', value: 320000, fill: '#83a6ed' },
  { name: 'Equipment', value: 180000, fill: '#8dd1e1' },
  { name: 'Subcontractors', value: 210000, fill: '#82ca9d' },
  { name: 'Other', value: 40000, fill: '#ffc658' },
  { name: 'Overhead', value: 120000, fill: '#ff8042' },
  { name: 'Profit', value: 132000, fill: '#a4de6c' }
];

// Generate monthly trend data
const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    const estimated = 100000 + Math.random() * 50000;
    // Actual data only available for past months
    const actual = index < 4 ? estimated * (0.9 + Math.random() * 0.2) : null;
    return {
      name: month,
      estimated,
      actual
    };
  });
};

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

const CostAnalysis = () => {
  const [activeTab, setActiveTab] = useState("breakdown");
  const [breakdownData] = useState<CostBreakdown>(costData);
  const [comparisonData] = useState(actualVsEstimatedData);
  const [trendData] = useState(generateMonthlyData());
  
  const totalEstimated = Object.values(breakdownData).reduce((sum, value) => sum + value, 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };
  
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(value / totalEstimated);
  };
  
  // Convert the breakdown object to an array for the chart
  const breakdownChartData = Object.entries(breakdownData).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value: value
  }));
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>
            Total Estimated Cost: {formatCurrency(totalEstimated)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
              <TabsTrigger value="comparison">Estimated vs. Actual</TabsTrigger>
              <TabsTrigger value="trends">Cost Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="breakdown" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-80">
                  <ChartContainer config={{
                    materials: { theme: { light: '#8884d8', dark: '#8884d8' } },
                    labor: { theme: { light: '#83a6ed', dark: '#83a6ed' } },
                    equipment: { theme: { light: '#8dd1e1', dark: '#8dd1e1' } },
                    subcontractors: { theme: { light: '#82ca9d', dark: '#82ca9d' } },
                    other: { theme: { light: '#ffc658', dark: '#ffc658' } },
                    overhead: { theme: { light: '#ff8042', dark: '#ff8042' } },
                    profit: { theme: { light: '#a4de6c', dark: '#a4de6c' } }
                  }}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
                
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Category</th>
                        <th className="text-right py-2">Amount</th>
                        <th className="text-right py-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(breakdownData).map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="py-2 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                          <td className="text-right py-2">{formatCurrency(value)}</td>
                          <td className="text-right py-2">{formatPercent(value)}</td>
                        </tr>
                      ))}
                      <tr className="font-bold">
                        <td className="py-2">Total</td>
                        <td className="text-right py-2">{formatCurrency(totalEstimated)}</td>
                        <td className="text-right py-2">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="comparison">
              <div className="h-96">
                <ChartContainer config={{
                  estimated: { theme: { light: '#8884d8', dark: '#8884d8' } },
                  actual: { theme: { light: '#82ca9d', dark: '#82ca9d' } }
                }}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="estimated" name="Estimated" fill="#8884d8" />
                    <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="mt-6 text-sm text-muted-foreground text-center">
                Note: Actual costs are updated as project expenses are recorded in the Finance module.
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="h-96">
                <ChartContainer config={{
                  estimated: { theme: { light: '#8884d8', dark: '#8884d8' } },
                  actual: { theme: { light: '#82ca9d', dark: '#82ca9d' } }
                }}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="estimated" name="Estimated" fill="#8884d8" />
                    <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="mt-6 text-sm text-muted-foreground text-center">
                Monthly cost trends over the project lifecycle. Actual costs are only shown for completed months.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostAnalysis;
