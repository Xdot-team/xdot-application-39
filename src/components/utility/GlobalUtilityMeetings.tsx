import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUtilityMeetings } from '@/hooks/useUtilityMeetings';
import { UtilityMeeting } from '@/types/field';
import { Project } from '@/types/projects';
import { UtilityMeetingForm } from '@/components/utility/UtilityMeetingForm';
import { Search, Plus, Calendar, MapPin, Users, Clock } from 'lucide-react';

interface GlobalUtilityMeetingsProps {
  meetings: UtilityMeeting[];
  projects: Project[];
  loading: boolean;
  selectedProjectId: string | null;
}

const GlobalUtilityMeetings = ({ 
  meetings, 
  projects, 
  loading,
  selectedProjectId 
}: GlobalUtilityMeetingsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [utilityFilter, setUtilityFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { createMeeting } = useUtilityMeetings();
  const { toast } = useToast();

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown Project';
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      scheduled: 'default',
      completed: 'success',
      cancelled: 'secondary'
    };
    
    return (
      <Badge variant={statusColors[status as keyof typeof statusColors] || 'default'}>
        {status}
      </Badge>
    );
  };

  const getUtilityColor = (utilityType: string) => {
    const colors = {
      water: 'text-blue-600',
      electric: 'text-amber-600',
      gas: 'text-red-600',
      telecom: 'text-purple-600',
      sewer: 'text-brown-600'
    };
    return colors[utilityType as keyof typeof colors] || 'text-gray-600';
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'coordination':
        return <Users className="h-4 w-4" />;
      case 'emergency':
        return <AlertTriangle className="h-4 w-4" />;
      case 'planning':
        return <Calendar className="h-4 w-4" />;
      case 'safety':
        return <Shield className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Filter meetings
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProjectName(meeting.project_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    const matchesType = typeFilter === 'all' || meeting.meeting_type === typeFilter;
    const matchesUtility = utilityFilter === 'all' || meeting.utility_type === utilityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesUtility;
  });

  const handleCreateMeeting = async (meetingData: any) => {
    try {
      await createMeeting({
        ...meetingData,
        project_id: selectedProjectId || meetingData.project_id
      });
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Utility meeting created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create utility meeting",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse">Loading meetings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Utility Meetings</h2>
          <p className="text-muted-foreground">
            {selectedProjectId ? 'Project-specific' : 'All projects'} utility coordination meetings
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Utility Meeting</DialogTitle>
            </DialogHeader>
            <UtilityMeetingForm
              onSubmit={handleCreateMeeting}
              onCancel={() => setShowCreateDialog(false)}
              projects={projects}
              defaultProjectId={selectedProjectId}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="coordination">Coordination</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
              </SelectContent>
            </Select>

            <Select value={utilityFilter} onValueChange={setUtilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Utilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Utilities</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="telecom">Telecom</SelectItem>
                <SelectItem value="sewer">Sewer</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredMeetings.length} of {meetings.length} meetings
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMeetings.map(meeting => (
          <Card key={meeting.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getMeetingTypeIcon(meeting.meeting_type)}
                    {meeting.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getProjectName(meeting.project_id)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(meeting.status)}
                  <Badge variant="outline" className={getUtilityColor(meeting.utility_type)}>
                    {meeting.utility_type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Type:</span>
                  <p className="text-sm capitalize">{meeting.meeting_type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Format:</span>
                  <p className="text-sm capitalize">{meeting.meeting_format}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(meeting.meeting_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{meeting.meeting_time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{meeting.location}</span>
                </div>
              </div>

              {meeting.attendees && meeting.attendees.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Attendees:</span>
                  <p className="text-sm text-muted-foreground">
                    {meeting.attendees.join(', ')}
                  </p>
                </div>
              )}

              {meeting.description && (
                <div>
                  <span className="text-sm font-medium">Description:</span>
                  <p className="text-sm text-muted-foreground">{meeting.description}</p>
                </div>
              )}

              {meeting.follow_up_required && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Follow-up Required</Badge>
                  {meeting.follow_up_date && (
                    <span className="text-sm text-muted-foreground">
                      Due: {new Date(meeting.follow_up_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No utility meetings found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalUtilityMeetings;