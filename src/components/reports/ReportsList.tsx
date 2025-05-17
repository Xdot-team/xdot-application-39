
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Download, FileText, Plus, Search, BarChart, PieChart, LineChart } from 'lucide-react';
import { getReportsData } from '@/data/mockReportsData';
import { CustomReport } from '@/types/reports';

interface ReportsListProps {
  handleExport: (format: string) => void;
}

export function ReportsList({ handleExport }: ReportsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('all');
  const { reports } = getReportsData();
  
  const filteredReports = reports.filter(report => 
    (report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    report.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (reportTypeFilter === 'all' || report.type === reportTypeFilter)
  );
  
  const getReportTypeColor = (type: string) => {
    const colors = {
      project: "bg-blue-100 text-blue-800",
      financial: "bg-green-100 text-green-800",
      labor: "bg-yellow-100 text-yellow-800",
      safety: "bg-red-100 text-red-800",
      equipment: "bg-purple-100 text-purple-800",
      custom: "bg-indigo-100 text-indigo-800",
    };
    
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getReportIcon = (report: CustomReport) => {
    const visualizationTypes = report.visualizations.map(v => v.type);
    
    if (visualizationTypes.includes('bar')) {
      return <BarChart className="h-4 w-4 mr-2" />;
    } else if (visualizationTypes.includes('pie')) {
      return <PieChart className="h-4 w-4 mr-2" />;
    } else if (visualizationTypes.includes('line')) {
      return <LineChart className="h-4 w-4 mr-2" />;
    } else {
      return <FileText className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Reports</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-[250px]"
            />
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setReportTypeFilter} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full md:w-[700px] mb-4 overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value={reportTypeFilter} className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No reports found matching your search criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <Badge className={getReportTypeColor(report.type)}>{report.type}</Badge>
                      <Badge variant={report.isAutomated ? "outline" : "secondary"}>
                        {report.isAutomated ? "Automated" : "Manual"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{report.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-medium">Frequency:</span>{" "}
                      {report.frequency.replace('_', ' ')}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {report.metrics.slice(0, 2).map((metric) => (
                        <Badge key={metric.id} variant="secondary" className="text-xs">
                          {metric.name}
                        </Badge>
                      ))}
                      {report.metrics.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{report.metrics.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm">
                      {getReportIcon(report)} View
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleExport('pdf')}>
                      <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
