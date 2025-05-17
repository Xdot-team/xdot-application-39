
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { mockHeadOfficeTasks } from '@/data/mockAdminData';
import { HeadOfficeTask } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export function HeadOfficeTasks() {
  const [tasks, setTasks] = useState<HeadOfficeTask[]>(mockHeadOfficeTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<HeadOfficeTask>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
  });
  
  const { authState } = useAuth();
  const currentUser = authState.user;

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const createdTask: HeadOfficeTask = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assigneeId: newTask.assigneeId,
      assigneeName: newTask.assigneeName,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate,
      priority: newTask.priority as 'low' | 'medium' | 'high',
      status: newTask.status as 'pending' | 'in_progress' | 'completed',
      notes: newTask.notes
    };

    setTasks([createdTask, ...tasks]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
    });
    setDialogOpen(false);
    toast.success("Task created successfully");
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    toast.success(`Task status updated to ${newStatus.replace('_', ' ')}`);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Head Office Tasks</CardTitle>
              <CardDescription>
                Manage and track administrative tasks and responsibilities
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new administrative task with details and assignment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Task Title*</label>
                    <Input
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description*</label>
                    <Textarea
                      placeholder="Describe the task"
                      rows={3}
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Assignee</label>
                      <Input
                        placeholder="Assignee name"
                        value={newTask.assigneeName || ''}
                        onChange={(e) => setNewTask({...newTask, assigneeName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Due Date</label>
                      <Input
                        type="date"
                        value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <Select 
                        value={newTask.priority} 
                        onValueChange={(value) => setNewTask({...newTask, priority: value as 'low' | 'medium' | 'high'})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <Select 
                        value={newTask.status} 
                        onValueChange={(value) => setNewTask({...newTask, status: value as 'pending' | 'in_progress' | 'completed'})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <Textarea
                      placeholder="Additional notes"
                      rows={2}
                      value={newTask.notes || ''}
                      onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h3 className="font-medium text-base">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      </div>
                    </div>
                    <div>{getPriorityBadge(task.priority)}</div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t">
                    <div className="space-y-2">
                      {task.assigneeName && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Assignee:</span> {task.assigneeName}
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Select 
                        value={task.status} 
                        onValueChange={(value) => handleUpdateTaskStatus(task.id, value as 'pending' | 'in_progress' | 'completed')}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">No tasks found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
