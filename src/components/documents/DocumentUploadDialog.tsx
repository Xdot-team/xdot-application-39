
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useUploadDocument } from '@/hooks/useDocuments';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/database';
import { toast } from '@/components/ui/sonner';

interface DocumentUploadDialogProps {
  onUploadComplete?: () => void;
}

const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip'
];

const DOCUMENT_CATEGORIES = [
  'drawing',
  'specification', 
  'contract',
  'photo',
  'report',
  'manual',
  'certificate',
  'document'
];

export const DocumentUploadDialog = ({ onUploadComplete }: DocumentUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState<string>('');
  const [category, setCategory] = useState<string>('document');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
  });

  const uploadMutation = useUploadDocument();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      toast.error('File type not supported');
      return false;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!selectedFile || !projectId) {
      toast.error('Please select a file and project');
      return;
    }

    try {
      setUploadProgress(10);
      
      const metadata = {
        name: selectedFile.name,
        category,
        description,
        tags,
        version: '1.0'
      };

      setUploadProgress(50);
      
      await uploadMutation.mutateAsync({
        file: selectedFile,
        projectId,
        metadata
      });

      setUploadProgress(100);
      
      // Reset form
      setSelectedFile(null);
      setProjectId('');
      setCategory('document');
      setDescription('');
      setTags([]);
      setTagInput('');
      setUploadProgress(0);
      setOpen(false);
      
      onUploadComplete?.();
      toast.success('Document uploaded successfully');
    } catch (error) {
      setUploadProgress(0);
      toast.error('Failed to upload document');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setProjectId('');
    setCategory('document');
    setDescription('');
    setTags([]);
    setTagInput('');
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>File *</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="flex items-center gap-2 justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop a file here, or click to select
                  </p>
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    accept={SUPPORTED_FILE_TYPES.join(',')}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Select File</span>
                    </Button>
                  </Label>
                </div>
              )}
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button onClick={addTag} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || !projectId || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
