
import { useState, useEffect } from 'react';
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
import { ProjectNote } from '@/types/projects';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, FileText, Plus, Paperclip } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjectNotes } from '@/data/mockProjectNotes';

interface ProjectNoteListProps {
  projectId: string;
}

const ProjectNoteList = ({ projectId }: ProjectNoteListProps) => {
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  const { authState } = useAuth();
  const canEdit = authState.user?.role === 'admin' || authState.user?.role === 'project_manager';
  const canSubmit = canEdit || authState.user?.role === 'field_worker';
  
  useEffect(() => {
    // Get notes for this project
    const projectNotes = mockProjectNotes.filter(note => note.projectId === projectId);
    setNotes(projectNotes);
  }, [projectId]);

  const filteredNotes = searchTerm 
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : notes;

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
            <Button size="sm" className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-1" /> New Note
            </Button>
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
                <p className="text-sm mt-2 line-clamp-2">{note.content}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" /> View
                  </Button>
                  {note.attachments && (
                    <Button size="sm" variant="outline">
                      <Paperclip className="h-4 w-4 mr-1" /> {note.attachments.length}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
          <Button>
            <Plus className="h-4 w-4 mr-1" /> Add Project Note
          </Button>
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
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.title}</TableCell>
                  <TableCell>{note.author}</TableCell>
                  <TableCell>{new Date(note.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" /> View
                    </Button>
                    {note.attachments && (
                      <Button size="sm" variant="outline">
                        <Paperclip className="h-4 w-4 mr-1" /> {note.attachments.length}
                      </Button>
                    )}
                    {canEdit && (
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Comment
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProjectNoteList;
