
import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, Trash2, Search, Filter, Eye, Edit, Clock, FileStack, AlertCircle } from 'lucide-react';
import { useDocuments, useUploadDocument, useDeleteDocument, useUpdateDocument, useCreateDocumentVersion, useDocumentVersions } from '@/hooks/useDocuments';
import { Document, documentService } from '@/services/documentService';
import DocumentStats from './DocumentStats';
import { toast } from '@/components/ui/sonner';

interface DocumentsManagerProps {
  projectId: string;
}

const DocumentsManager = ({ projectId }: DocumentsManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [versionFile, setVersionFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states
  const [documentName, setDocumentName] = useState('');
  const [documentCategory, setDocumentCategory] = useState('document');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentTags, setDocumentTags] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [versionNotes, setVersionNotes] = useState('');

  const { data: documents = [], isLoading, error, refetch } = useDocuments(projectId);
  const { data: versions = [] } = useDocumentVersions(selectedDocument?.id || '');
  const uploadDocument = useUploadDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const createVersion = useCreateDocumentVersion();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'document', label: 'General Documents' },
    { value: 'drawing', label: 'Drawings' },
    { value: 'specification', label: 'Specifications' },
    { value: 'contract', label: 'Contracts' },
    { value: 'photo', label: 'Photos' },
    { value: 'report', label: 'Reports' },
    { value: 'manual', label: 'Manuals' },
    { value: 'certificate', label: 'Certificates' },
  ];

  // Enhanced search with debouncing
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        doc.name.toLowerCase().includes(searchLower) ||
        doc.file_name.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchTerm, categoryFilter]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('File type not supported. Please upload PDF, Word, Excel, or image files.');
        return;
      }
      
      setSelectedFile(file);
      setDocumentName(file.name);
    }
  }, []);

  const handleVersionFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setVersionFile(file);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!documentName.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const metadata = {
      name: documentName.trim(),
      category: documentCategory,
      description: documentDescription.trim(),
      tags: documentTags.split(',').map(tag => tag.trim()).filter(Boolean),
      version: '1.0'
    };

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await uploadDocument.mutateAsync({
        file: selectedFile,
        projectId,
        metadata
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset form and close dialog
      setTimeout(() => {
        resetUploadForm();
        setIsUploadOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error('Upload error:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedDocument) return;

    if (!documentName.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    const updates = {
      name: documentName.trim(),
      category: documentCategory,
      description: documentDescription.trim(),
      tags: documentTags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      await updateDocument.mutateAsync({ id: selectedDocument.id, updates });
      setIsEditOpen(false);
      setSelectedDocument(null);
      resetUploadForm();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleCreateVersion = async () => {
    if (!selectedDocument || !versionFile || !newVersion.trim()) {
      toast.error('Please select a file and enter version number');
      return;
    }

    try {
      await createVersion.mutateAsync({
        documentId: selectedDocument.id,
        file: versionFile,
        version: newVersion.trim(),
        notes: versionNotes.trim()
      });
      
      setIsVersionOpen(false);
      setVersionFile(null);
      setNewVersion('');
      setVersionNotes('');
      setSelectedDocument(null);
    } catch (error) {
      console.error('Version creation error:', error);
    }
  };

  const handleDelete = async (documentId: string, documentName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${documentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDocument.mutateAsync(documentId);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      await documentService.downloadDocument(fileUrl, fileName);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download document');
      console.error('Download error:', error);
    }
  };

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const openEditDialog = (document: Document) => {
    setSelectedDocument(document);
    setDocumentName(document.name);
    setDocumentCategory(document.category);
    setDocumentDescription(document.description || '');
    setDocumentTags(document.tags.join(', '));
    setIsEditOpen(true);
  };

  const openVersionDialog = (document: Document) => {
    setSelectedDocument(document);
    setIsVersionOpen(true);
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setDocumentName('');
    setDocumentCategory('document');
    setDocumentDescription('');
    setDocumentTags('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      drawing: 'bg-blue-100 text-blue-800',
      specification: 'bg-green-100 text-green-800',
      contract: 'bg-purple-100 text-purple-800',
      photo: 'bg-yellow-100 text-yellow-800',
      report: 'bg-red-100 text-red-800',
      manual: 'bg-indigo-100 text-indigo-800',
      certificate: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error loading documents</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <DocumentStats projectId={projectId} />

      {/* Header with Search and Upload */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="w-full md:w-[250px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Select File *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.jpg,.jpeg,.png,.gif,.txt,.csv"
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 50MB. Supported formats: PDF, Word, Excel, PowerPoint, Images, Text files
                </p>
              </div>
              
              {selectedFile && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{selectedFile.name}</span>
                    <Badge variant="outline">{formatFileSize(selectedFile.size)}</Badge>
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="name">Document Name *</Label>
                <Input
                  id="name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className="mt-1"
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={documentCategory} onValueChange={setDocumentCategory} disabled={isUploading}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Enter document description"
                  className="mt-1"
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={documentTags}
                  onChange={(e) => setDocumentTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="mt-1"
                  disabled={isUploading}
                />
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || !documentName.trim() || isUploading}
                  className="flex-1"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsUploadOpen(false);
                    resetUploadForm();
                  }}
                  className="flex-1"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium line-clamp-2 pr-2">
                    {document.name}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
                {document.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {document.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getCategoryColor(document.category)}>
                    {document.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    v{document.version}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(document.file_size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{new Date(document.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-5 gap-1 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleView(document.file_url)}
                    title="View document"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(document.file_url, document.file_name)}
                    title="Download document"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openVersionDialog(document)}
                    title="Manage versions"
                  >
                    <FileStack className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(document)}
                    title="Edit document"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(document.id, document.name)}
                    disabled={deleteDocument.isPending}
                    title="Delete document"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first document to get started'
            }
          </p>
          {(searchTerm || categoryFilter !== 'all') && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Edit Document Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Document Name *</Label>
              <Input
                id="editName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="editCategory">Category</Label>
              <Select value={documentCategory} onValueChange={setDocumentCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="editTags">Tags</Label>
              <Input
                id="editTags"
                value={documentTags}
                onChange={(e) => setDocumentTags(e.target.value)}
                className="mt-1"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleUpdate} 
                disabled={updateDocument.isPending || !documentName.trim()}
                className="flex-1"
              >
                {updateDocument.isPending ? 'Updating...' : 'Update'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Dialog */}
      <Dialog open={isVersionOpen} onOpenChange={setIsVersionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Versions</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Create New Version */}
            <div className="border-b pb-4">
              <h4 className="font-medium mb-3">Upload New Version</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="versionFile">Select File *</Label>
                  <Input
                    id="versionFile"
                    type="file"
                    onChange={handleVersionFileSelect}
                    className="mt-1"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.jpg,.jpeg,.png,.gif,.txt,.csv"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="version">Version Number *</Label>
                    <Input
                      id="version"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      placeholder="e.g., 2.0, 1.1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Version Notes</Label>
                    <Input
                      id="notes"
                      value={versionNotes}
                      onChange={(e) => setVersionNotes(e.target.value)}
                      placeholder="What changed?"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleCreateVersion} 
                  disabled={!versionFile || !newVersion.trim() || createVersion.isPending}
                  className="w-full"
                >
                  {createVersion.isPending ? 'Creating Version...' : 'Create Version'}
                </Button>
              </div>
            </div>

            {/* Existing Versions */}
            <div>
              <h4 className="font-medium mb-3">Version History</h4>
              {versions.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {versions.map((version) => (
                    <div key={version.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">v{version.version}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(version.file_size)}
                          </span>
                        </div>
                        {version.notes && (
                          <p className="text-sm text-muted-foreground">{version.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(version.uploaded_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(version.file_url)}
                          title="View version"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(version.file_url, `${selectedDocument?.name}_v${version.version}`)}
                          title="Download version"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No versions available</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsManager;
