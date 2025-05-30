
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

// Mock project notes data
const mockProjectNotes = [
  {
    id: 'note-001',
    title: 'Site Safety Observation',
    content: 'Observed excellent adherence to safety protocols during concrete pour operations. All workers wearing proper PPE.',
    category: 'safety',
    priority: 'medium',
    author: 'John Smith',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-15T10:30:00Z',
    tags: ['safety', 'concrete', 'ppe']
  },
  {
    id: 'note-002',
    title: 'Material Delivery Issue',
    content: 'Steel reinforcement delivery delayed by 2 days due to supplier issues. Adjusting schedule accordingly.',
    category: 'logistics',
    priority: 'high',
    author: 'Sarah Johnson',
    createdAt: '2023-10-14T14:20:00Z',
    updatedAt: '2023-10-14T14:20:00Z',
    tags: ['materials', 'steel', 'schedule']
  },
  {
    id: 'note-003',
    title: 'Quality Control Check',
    content: 'Completed quality inspection of foundation work. All measurements within tolerance. Ready for next phase.',
    category: 'quality',
    priority: 'low',
    author: 'Mike Wilson',
    createdAt: '2023-10-13T09:15:00Z',
    updatedAt: '2023-10-13T09:15:00Z',
    tags: ['quality', 'foundation', 'inspection']
  }
];

interface ProjectNoteListProps {
  projectId: string;
}

const ProjectNoteList = ({ projectId }: ProjectNoteListProps) => {
  const [notes, setNotes] = useState(mockProjectNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    tags: ''
  });

  // Mock current user for demonstration
  const currentUser = { name: 'Demo User' };

  // Filter notes based on search, category, and priority
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || note.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || note.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'safety':
        return <Badge className="bg-red-500">Safety</Badge>;
      case 'quality':
        return <Badge className="bg-blue-500">Quality</Badge>;
      case 'logistics':
        return <Badge className="bg-orange-500">Logistics</Badge>;
      case 'general':
        return <Badge className="bg-gray-500">General</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="text-red-600 border-red-600">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    const note = {
      id: `note-${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      priority: newNote.priority,
      author: currentUser?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setNotes([note, ...notes]);
    setNewNote({
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
      tags: ''
    });
    setIsDialogOpen(false);
    toast.success("Note created successfully");
  };

  const handleEdit = (note: any) => {
    setSelectedNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
      tags: note.tags.join(', ')
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id 
        ? {
            ...note,
            title: newNote.title,
            content: newNote.content,
            category: newNote.category,
            priority: newNote.priority,
            tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date().toISOString()
          }
        : note
    );

    setNotes(updatedNotes);
    setIsEditing(false);
    setIsDialogOpen(false);
    setSelectedNote(null);
    setNewNote({
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
      tags: ''
    });
    toast.success("Note updated successfully");
  };

  const handleDelete = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    toast.success("Note deleted successfully");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setIsEditing(false);
                setSelectedNote(null);
                setNewNote({
                  title: '',
                  content: '',
                  category: 'general',
                  priority: 'medium',
                  tags: ''
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Note' : 'Create New Note'}</DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Update the project note details' : 'Add a new note to track project information'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    placeholder="Enter note title"
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    placeholder="Enter note content"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={newNote.category} onValueChange={(value) => setNewNote({...newNote, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="quality">Quality</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={newNote.priority} onValueChange={(value) => setNewNote({...newNote, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={newNote.tags}
                    onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={isEditing ? handleUpdate : handleCreateNote}>
                    {isEditing ? 'Update Note' : 'Create Note'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getCategoryBadge(note.category)}
                      {getPriorityBadge(note.priority)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{note.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>By: {note.author}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-10">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">No notes found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectNoteList;
