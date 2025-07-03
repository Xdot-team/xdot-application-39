import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Download, FileText, Plus, Search, BarChart, PieChart, LineChart, Play } from 'lucide-react';
import { useCustomReports } from '@/hooks/useReportsData';
import { useToast } from '@/hooks/use-toast';

interface ReportsListProps {
  handleExport: (format: string) => void;
}

export function ReportsList({ handleExport }: ReportsListProps) {
  const { reports, loading, error, createReport, generateReport } = useCustomReports();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    report_type: '',
    configuration: {},
    created_by: 'Current User',
    is_public: false,
    tags: [] as string[]
  });
  
  const filteredReports = reports.filter(report => 
    (report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    report.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (reportTypeFilter === 'all' || report.report_type === reportTypeFilter)
  );

  const handleCreateReport = async () => {
    try {
      await createReport({
        ...newReport,
        configuration: { type: newReport.report_type },
        generated_count: 0,
        version: 1
      });
      setIsCreateDialogOpen(false);
      setNewReport({
        title: '',
        description: '',
        report_type: '',
        configuration: {},
        created_by: 'Current User',
        is_public: false,
        tags: []
      });
      toast({
        title: "Report Created",
        description: "New report has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = async (reportId: string) => {
    try {
      await generateReport(reportId);
      toast({
        title: "Report Generated",
        description: "Report has been generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };
  
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

  const getReportIcon = () => {
    return <FileText className="h-4 w-4 mr-2" />;
  };

  if (loading) return <div className="text-center py-8">Loading reports...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  
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
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    placeholder="Report title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    placeholder="Report description"
                  />
                </div>
                <div>
                  <Label htmlFor="report_type">Type</Label>
                  <Select onValueChange={(value) => setNewReport({ ...newReport, report_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateReport} className="w-full">
                  Create Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                      <Badge className={getReportTypeColor(report.report_type)}>{report.report_type}</Badge>
                      <Badge variant={report.is_public ? "outline" : "secondary"}>
                        {report.is_public ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{report.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Last generated: {report.last_generated ? new Date(report.last_generated).toLocaleDateString() : 'Never'}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-medium">Version:</span>{" "}
                      {report.version}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-medium">Generated:</span>{" "}
                      {report.generated_count} times
                    </div>
                    {report.tags && report.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {report.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {report.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{report.tags.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm" onClick={() => handleGenerateReport(report.id)}>
                      <Play className="h-4 w-4 mr-2" /> Generate
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