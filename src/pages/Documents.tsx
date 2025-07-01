
import { requireAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FolderOpen, FileText, Upload, Download, Clock, Star, Book, Eye, AlertCircle } from "lucide-react";
import { LibraryView } from "@/components/documents/LibraryView";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";
import { projectService } from "@/services/database";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all documents and projects
  const { data: allDocuments = [], isLoading: documentsLoading, error: documentsError } = useQuery({
    queryKey: ['all-documents'],
    queryFn: () => documentService.getAllDocuments(),
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
  });

  // Filter documents based on search term
  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return allDocuments;
    
    const searchLower = searchTerm.toLowerCase();
    return allDocuments.filter(doc => 
      doc.name.toLowerCase().includes(searchLower) ||
      doc.file_name.toLowerCase().includes(searchLower) ||
      doc.description?.toLowerCase().includes(searchLower) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [allDocuments, searchTerm]);

  // Group documents by project
  const documentsByProject = useMemo(() => {
    const grouped: Record<string, typeof allDocuments> = {};
    
    filteredDocuments.forEach(doc => {
      if (!grouped[doc.project_id]) {
        grouped[doc.project_id] = [];
      }
      grouped[doc.project_id].push(doc);
    });
    
    return grouped;
  }, [filteredDocuments]);

  // Filter documents by category
  const getDocumentsByCategory = (category: string) => {
    return filteredDocuments.filter(doc => doc.category === category);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      await documentService.downloadDocument(fileUrl, fileName);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  if (documentsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-lg">Loading documents...</div>
      </div>
    );
  }

  if (documentsError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error loading documents</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Central repository for all project documents, drawings, and specifications
          </p>
        </div>
        
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
        </div>
      </div>

      {/* Document Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allDocuments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(allDocuments.reduce((sum, doc) => sum + doc.file_size, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(documentsByProject).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(allDocuments.map(doc => doc.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 md:w-[720px]">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-1">
            <Book className="h-4 w-4" />
            <span>Library</span>
          </TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="drawings">Drawings</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredDocuments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="cursor-pointer transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium line-clamp-2 pr-2">
                      {doc.name}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(doc.category)}>
                          {doc.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          v{doc.version}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.file_size)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                      
                      {doc.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(doc.file_url)}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(doc.file_url, doc.file_name)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search criteria' : 'No documents have been uploaded yet'}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="library" className="mt-6">
          <LibraryView />
        </TabsContent>
        
        <TabsContent value="projects" className="mt-6">
          {Object.keys(documentsByProject).length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(documentsByProject).map(([projectId, docs]) => {
                const project = projects.find(p => p.id === projectId);
                return (
                  <Card key={projectId}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">
                          {project?.name || 'Unknown Project'}
                        </CardTitle>
                        <FolderOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {docs.length} document{docs.length !== 1 ? 's' : ''}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open(`/projects/${projectId}?tab=documents`, '_blank')}
                        >
                          Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No project documents found</h3>
              <p className="text-muted-foreground">
                Upload documents to your projects to see them here
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="drawings" className="mt-6">
          {getDocumentsByCategory('drawing').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getDocumentsByCategory('drawing').map((doc) => (
                <Card key={doc.id} className="cursor-pointer transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{doc.name}</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      {formatFileSize(doc.file_size)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(doc.file_url)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(doc.file_url, doc.file_name)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-lg text-muted-foreground">No drawings found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-6">
          {getDocumentsByCategory('contract').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getDocumentsByCategory('contract').map((doc) => (
                <Card key={doc.id} className="cursor-pointer transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{doc.name}</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      {formatFileSize(doc.file_size)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(doc.file_url)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(doc.file_url, doc.file_name)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-lg text-muted-foreground">No contracts found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">RFI Template</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">Form Template</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Company Standard</p>
                  <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Submittal Form</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">Form Template</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Company Standard</p>
                  <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Change Order Request</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">Form Template</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Company Standard</p>
                  <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allDocuments.slice(0, 5).map((doc) => (
              <div key={doc.id} className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{doc.name} was uploaded</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {allDocuments.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default requireAuth()(Documents);
