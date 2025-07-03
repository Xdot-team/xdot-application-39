import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useScheduleEvents } from '@/hooks/useScheduleData';

const scheduleEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  event_type: z.enum(['project_milestone', 'equipment_maintenance', 'employee_shift', 'training_session', 'meeting', 'inspection', 'other']),
  category: z.enum(['project', 'equipment', 'labor', 'training', 'meeting', 'inspection', 'other']),
  priority: z.enum(['low', 'medium', 'high']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  all_day: z.boolean().default(false),
  location: z.string().optional(),
  assigned_to: z.array(z.string()).default([]),
  color_code: z.string().default('#3b82f6'),
});

type ScheduleEventFormData = z.infer<typeof scheduleEventSchema>;

export const ScheduleForm = () => {
  const [open, setOpen] = React.useState(false);
  const { createEvent } = useScheduleEvents();

  const form = useForm<ScheduleEventFormData>({
    resolver: zodResolver(scheduleEventSchema),
    defaultValues: {
      title: '',
      description: '',
      event_type: 'other',
      category: 'other',
      priority: 'medium',
      start_date: '',
      end_date: '',
      all_day: false,
      location: '',
      assigned_to: [],
      color_code: '#3b82f6',
    },
  });

  const onSubmit = async (data: ScheduleEventFormData) => {
    try {
      await createEvent({
        title: data.title,
        description: data.description || '',
        event_type: data.event_type,
        category: data.category,
        priority: data.priority,
        start_date: data.start_date,
        end_date: data.end_date,
        all_day: data.all_day,
        location: data.location || '',
        assigned_to: data.assigned_to,
        attendees: [],
        color_code: data.color_code,
        created_by: 'Current User', // TODO: Replace with actual user
        status: 'scheduled',
        completion_percentage: 0,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to create schedule event:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Schedule Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Event description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="project_milestone">Project Milestone</SelectItem>
                        <SelectItem value="equipment_maintenance">Equipment Maintenance</SelectItem>
                        <SelectItem value="employee_shift">Employee Shift</SelectItem>
                        <SelectItem value="training_session">Training Session</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="labor">Labor</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="all_day"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">All Day Event</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      This event lasts the entire day
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};