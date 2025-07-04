
import React, { useState } from 'react';
import { useMeetings } from '@/hooks/useScheduleData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, MapPin, Users, Video, Plus, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';

interface MeetingFormData {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  virtual: boolean;
  meeting_link?: string;
  related_project_id?: string;
}

export function MeetingList() {
  const { meetings, loading, createMeeting } = useMeetings();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<MeetingFormData>();
  const isVirtual = watch('virtual');

  const onSubmit = async (data: MeetingFormData) => {
    try {
      await createMeeting({
        ...data,
        attendees: [],
        agenda: [],
        minutes: null,
        related_project_name: null,
        documents: [],
        status: 'scheduled'
      });
      setIsCreateOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create meeting:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastMeetings = meetings.filter(meeting => 
    new Date(meeting.date) < new Date()
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="mx-auto h-8 w-8 text-muted-foreground animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meetings</h2>
          <p className="text-muted-foreground">
            {upcomingMeetings.length} upcoming, {pastMeetings.length} completed
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Weekly project review"
                  />
                  {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input
                    id="organizer"
                    {...register('organizer', { required: 'Organizer is required' })}
                    placeholder="John Smith"
                  />
                  {errors.organizer && <p className="text-sm text-red-600">{errors.organizer.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Meeting agenda and objectives"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                  />
                  {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    {...register('start_time', { required: 'Start time is required' })}
                  />
                  {errors.start_time && <p className="text-sm text-red-600">{errors.start_time.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    {...register('end_time', { required: 'End time is required' })}
                  />
                  {errors.end_time && <p className="text-sm text-red-600">{errors.end_time.message}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="virtual"
                  {...register('virtual')}
                />
                <Label htmlFor="virtual">Virtual Meeting</Label>
              </div>

              {isVirtual ? (
                <div className="space-y-2">
                  <Label htmlFor="meeting_link">Meeting Link</Label>
                  <Input
                    id="meeting_link"
                    {...register('meeting_link')}
                    placeholder="https://zoom.us/j/123456789"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register('location', { required: !isVirtual ? 'Location is required' : false })}
                    placeholder="Conference Room A"
                  />
                  {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Meeting</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Meetings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
        {upcomingMeetings.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-semibold mb-2">No Upcoming Meetings</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule your first meeting to get started.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingMeetings.map((meeting) => (
              <Card key={meeting.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{meeting.title}</h4>
                      <p className="text-sm text-muted-foreground">{meeting.description}</p>
                    </div>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(parseISO(meeting.date), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.start_time} - {meeting.end_time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {meeting.virtual ? (
                        <>
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>Virtual Meeting</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Organized by {meeting.organizer}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {meeting.virtual && meeting.meeting_link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedMeeting(meeting);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Past Meetings</h3>
          <div className="grid gap-4">
            {pastMeetings.slice(0, 5).map((meeting) => (
              <Card key={meeting.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{meeting.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(meeting.date), 'MMM d, yyyy')} • {meeting.start_time} - {meeting.end_time}
                      </p>
                    </div>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Meeting Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.title}</DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date & Time</Label>
                  <p className="text-sm">
                    {format(parseISO(selectedMeeting.date), 'EEEE, MMMM d, yyyy')}
                    <br />
                    {selectedMeeting.start_time} - {selectedMeeting.end_time}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">
                    {selectedMeeting.virtual ? 'Virtual Meeting' : selectedMeeting.location}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm mt-1">{selectedMeeting.description || 'No description provided'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Organizer</Label>
                <p className="text-sm mt-1">{selectedMeeting.organizer}</p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedMeeting.virtual && selectedMeeting.meeting_link && (
                  <Button asChild>
                    <a href={selectedMeeting.meeting_link} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
