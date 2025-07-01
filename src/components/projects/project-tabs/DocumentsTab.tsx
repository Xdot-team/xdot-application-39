
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Trash2, FileStack, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/database';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentsTabProps {
  projectId: string;
}

const DocumentsTab = ({ projectId }: DocumentsTabProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [versionFile, setVersionFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('document');
  const [version, setVersion] = useState('');
  const [versionNotes, setVersionNotes] = useState('');

  const queryClient = useQueryClient();

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentService.getByProjectId(projectId),
    enabled: !!projectId,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: any }) => 
      documentService.upload(file, projectId, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
      toast.success('Document uploaded successfully');
      setIsUploadOpen(false);
      setUploadFile(null);
      setDocumentName('');
      setCategory('document');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
  });

  // Version mutation
  const versionMutation = useMutation({
    mutationFn: ({ documentId, file, version, notes }: { documentId: string; file: File; version: string; notes: string }) => 
      documentService.createVersion(documentId, file, version, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
      toast.success('New document version created successfully');
      setIsVersionOpen(false);
      setVersionFile(null);
      setVersion('');
      setVersionNotes('');
      setSelectedDocId('');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create document version: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: documentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
      toast.success('Document deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });

  const handleUpload = () => {
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }

    const metadata = {
      name: documentName || uploadFile.name,
      category,
      version: '1.0'
    };

    uploadMutation.mutate({ file: uploadFile, metadata });
  };

  const handleVersionUpload = () => {
    if (!versionFile || !version) {
      toast.error('Please select a file and enter version number');
      return;
    }

    versionMutation.mutate({
      documentId: selectedDocId,
      file: versionFile,
      version,
      notes: versionNotes
    });
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'drawing': return 'bg-blue-100 text-blue-800';
      case 'specification': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'photo': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading documents...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Documents</h3>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload a new document to this project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <Label htmlFor="name">Document Name (optional)</Label>
                <Input
                  id="name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name or leave blank to use filename"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="drawing">Drawing</SelectItem>
                    <SelectItem value="specification">Specification</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleUpload} 
                disabled={uploadMutation.isPending}
                className="w-full"
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded yet. Click "Upload Document" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{doc.name}</p>
                        <Badge className={getCategoryColor(doc.category)}>
                          {doc.category}
                        </Badge>
                        <Badge variant="outline">v{doc.version}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {new Date(doc.uploaded_at).toLocaleDateString()} • {Math.round(doc.file_size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc.file_url, doc.file_name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setIsVersionOpen(true);
                      }}
                    >
                      <FileStack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this document?')) {
                          deleteMutation.mutate(doc.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Upload Dialog */}
      <Dialog open={isVersionOpen} onOpenChange={setIsVersionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Version</DialogTitle>
            <DialogDescription>
              Upload a new version of the selected document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="versionFile">Select File</Label>
              <Input
                id="versionFile"
                type="file"
                onChange={(e) => setVersionFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.jpg,.jpeg,.png"
              />
            </div>
            <div>
              <Label htmlFor="version">Version Number</Label>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g., 2.0, 1.1"
              />
            </div>
            <div>
              <Label htmlFor="notes">Version Notes (optional)</Label>
              <Input
                id="notes"
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                placeholder="Describe what changed in this version"
              />
            </div>
            <Button 
              onClick={handleVersionUpload} 
              disabled={versionMutation.isPending}
              className="w-full"
            >
              {versionMutation.isPending ? 'Uploading Version...' : 'Upload New Version'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsTab;
