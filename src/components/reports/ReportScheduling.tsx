
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Plus, CalendarIcon, Clock, Mail } from 'lucide-react';
import { getReportsData } from '@/data/mockReportsData';
import { ScheduledReport } from '@/types/reports';

export function ReportScheduling() {
  const [searchTerm, setSearchTerm] = useState('');
  const { scheduledReports, reports } = getReportsData();
  
  const filteredSchedules = scheduledReports.filter(schedule => 
    schedule.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getFrequencyText = (schedule: ScheduledReport) => {
    switch(schedule.frequency) {
      case 'daily':
        return 'Every day';
      case 'weekly':
        return `Every week on ${getDayOfWeek(schedule.dayOfWeek || 1)}`;
      case 'monthly':
        return `Monthly on day ${schedule.dayOfMonth || 1}`;
      case 'quarterly':
        return `Quarterly on day ${schedule.dayOfMonth || 1}`;
      default:
        return schedule.frequency;
    }
  };
  
  const getDayOfWeek = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day % 7];
  };
  
  const getReportType = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    return report?.type || 'unknown';
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
  
  const toggleScheduleStatus = (scheduleId: string, currentStatus: 'active' | 'paused') => {
    console.log(`Toggle schedule ${scheduleId} from ${currentStatus} to ${currentStatus === 'active' ? 'paused' : 'active'}`);
    // In a real implementation, this would update the status via API
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Report Scheduling</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-[250px]"
            />
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Schedule Report
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSchedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scheduled reports found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Scheduled</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.reportName}</TableCell>
                      <TableCell>
                        <Badge className={getReportTypeColor(getReportType(schedule.reportId))}>
                          {getReportType(schedule.reportId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{getFrequencyText(schedule)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{schedule.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(schedule.nextScheduled).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{schedule.recipients.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={schedule.status === 'active'} 
                            onCheckedChange={() => toggleScheduleStatus(schedule.id, schedule.status)}
                            id={`status-${schedule.id}`}
                          />
                          <Label htmlFor={`status-${schedule.id}`}>{schedule.status}</Label>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="report">Select Report</Label>
              <Select>
                <SelectTrigger id="report">
                  <SelectValue placeholder="Choose a report" />
                </SelectTrigger>
                <SelectContent>
                  {reports.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Input id="recipients" placeholder="Enter email addresses" />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button>Schedule Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
