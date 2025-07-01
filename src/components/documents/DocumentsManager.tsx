import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Download, Trash2, Search, Filter, Eye, Edit, Clock, FileStack } from 'lucide-react';
import { useDocuments, useUploadDocument, useDeleteDocument, useUpdateDocument, useCreateDocumentVersion, useDocumentVersions } from '@/hooks/useDocuments';
import { Document } from '@/services/documentService';
import DocumentStats from './DocumentStats';

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
  
  // Form states
  const [documentName, setDocumentName] = useState('');
  const [documentCategory, setDocumentCategory] = useState('document');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentTags, setDocumentTags] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [versionNotes, setVersionNotes] = useState('');

  const { data: documents = [], isLoading, error } = useDocuments(projectId);
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

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentName(file.name);
    }
  };

  const handleVersionFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVersionFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const metadata = {
      name: documentName || selectedFile.name,
      category: documentCategory,
      description: documentDescription,
      tags: documentTags.split(',').map(tag => tag.trim()).filter(Boolean),
      version: '1.0'
    };

    try {
      await uploadDocument.mutateAsync({
        file: selectedFile,
        projectId,
        metadata
      });
      
      // Reset form
      resetUploadForm();
      setIsUploadOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedDocument) return;

    const updates = {
      name: documentName,
      category: documentCategory,
      description: documentDescription,
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
    if (!selectedDocument || !versionFile || !newVersion) return;

    try {
      await createVersion.mutateAsync({
        documentId: selectedDocument.id,
        file: versionFile,
        version: newVersion,
        notes: versionNotes
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

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument.mutateAsync(documentId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = window.document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
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
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">Error loading documents</div>
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
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.jpg,.jpeg,.png,.txt,.csv"
                />
              </div>
              
              <div>
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
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
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Enter document description"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={documentTags}
                  onChange={(e) => setDocumentTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || uploadDocument.isPending}
                  className="flex-1"
                >
                  {uploadDocument.isPending ? 'Uploading...' : 'Upload'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsUploadOpen(false);
                    resetUploadForm();
                  }}
                  className="flex-1"
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
                
                <div className="flex items-center gap-1 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(document.file_url, '_blank')}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(document.file_url, document.file_name)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openVersionDialog(document)}
                  >
                    <FileStack className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(document)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(document.id)}
                    disabled={deleteDocument.isPending}
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
              <Label htmlFor="editName">Document Name</Label>
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
              <Label htmlFor="editTags">Tags (comma-separated)</Label>
              <Input
                id="editTags"
                value={documentTags}
                onChange={(e) => setDocumentTags(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleUpdate} 
                disabled={updateDocument.isPending}
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
                  <Label htmlFor="versionFile">Select File</Label>
                  <Input
                    id="versionFile"
                    type="file"
                    onChange={handleVersionFileSelect}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="version">Version Number</Label>
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
                  disabled={!versionFile || !newVersion || createVersion.isPending}
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(version.file_url, `${selectedDocument?.name}_v${version.version}`)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
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
