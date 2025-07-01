
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, FileText, Plus, Paperclip, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectNotes, useCreateProjectNote, useUpdateProjectNote, useDeleteProjectNote } from '@/hooks/useProjectNotes';

interface ProjectNoteListProps {
  projectId: string;
}

const ProjectNoteList = ({ projectId }: ProjectNoteListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const isMobile = useIsMobile();
  const { authState } = useAuth();
  const canEdit = authState.user?.role === 'admin' || authState.user?.role === 'project_manager';
  const canSubmit = canEdit || authState.user?.role === 'field_worker';
  
  const { data: notes = [], isLoading, error } = useProjectNotes(projectId);
  const createNote = useCreateProjectNote();
  const updateNote = useUpdateProjectNote();
  const deleteNote = useDeleteProjectNote();

  const filteredNotes = searchTerm 
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : notes;

  const handleCreateNote = async () => {
    if (!title.trim()) return;
    
    try {
      await createNote.mutateAsync({
        project_id: projectId,
        title: title.trim(),
        content: content.trim() || undefined,
        author: authState.user?.name || 'Unknown User'
      });
      
      setTitle('');
      setContent('');
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Create note error:', error);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !title.trim()) return;
    
    try {
      await updateNote.mutateAsync({
        id: editingNote.id,
        updates: {
          title: title.trim(),
          content: content.trim() || undefined
        }
      });
      
      setTitle('');
      setContent('');
      setEditingNote(null);
      setIsEditOpen(false);
    } catch (error) {
      console.error('Update note error:', error);
    }
  };

  const handleEditClick = (note: any) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content || '');
    setIsEditOpen(true);
  };

  const handleDeleteClick = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote.mutateAsync(noteId);
      } catch (error) {
        console.error('Delete note error:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading notes...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-12">Error loading notes: {error.message}</div>;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {canSubmit && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-1" /> New Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter note title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter note content"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateNote} disabled={createNote.isPending}>
                      {createNote.isPending ? 'Creating...' : 'Create Note'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {filteredNotes.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? "Try adjusting your search term" : "Create your first project note to get started"}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotes.map((note) => (
              <div key={note.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{note.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(note.timestamp).toLocaleString()} by {note.author}
                    </p>
                  </div>
                </div>
                {note.content && <p className="text-sm mt-2 line-clamp-2">{note.content}</p>}
                <div className="mt-3 flex justify-end space-x-2">
                  {canEdit && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(note)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteClick(note.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter note content"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateNote} disabled={updateNote.isPending}>
                  {updateNote.isPending ? 'Updating...' : 'Update Note'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {canSubmit && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Add Project Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter note title"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter note content"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateNote} disabled={createNote.isPending}>
                    {createNote.isPending ? 'Creating...' : 'Create Note'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {filteredNotes.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium">No notes found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ? "Try adjusting your search term" : "Create your first project note to get started"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.title}</TableCell>
                  <TableCell>{note.author || 'Unknown'}</TableCell>
                  <TableCell>{new Date(note.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {note.content || 'No content'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {canEdit && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(note)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteClick(note.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateNote} disabled={updateNote.isPending}>
                {updateNote.isPending ? 'Updating...' : 'Update Note'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectNoteList;
