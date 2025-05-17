
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Download, FileText, Plus, Search } from 'lucide-react';
import { getOrganizationData } from '@/data/mockOrganizationData';

export function ReportsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const { reports } = getOrganizationData();
  
  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getReportTypeColor = (type: string) => {
    const colors = {
      project: "bg-blue-100 text-blue-800",
      financial: "bg-green-100 text-green-800",
      labor: "bg-yellow-100 text-yellow-800",
      safety: "bg-red-100 text-red-800",
      custom: "bg-purple-100 text-purple-800",
    };
    
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[400px] mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No reports found matching your search criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {["project", "financial", "custom"].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.filter(report => report.type === type).map((report) => (
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
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
