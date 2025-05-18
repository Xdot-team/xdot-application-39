
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FilePen, Upload, Download, Search, FileArchive } from "lucide-react";
import { toast } from "sonner";

export default function BidDocuments() {
  const [activeTab, setActiveTab] = useState("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Mock documents data
  const mockDocuments = [
    { id: "doc-1", name: "Highway 101 Bridge - RFP", date: "2025-04-10", type: "pdf" },
    { id: "doc-2", name: "I-85 North Resurfacing - Specifications", date: "2025-04-15", type: "pdf" },
    { id: "doc-3", name: "Peachtree St Extension - Drawing Set", date: "2025-04-18", type: "pdf" },
    { id: "doc-4", name: "Gwinnett County Sidewalk - Addendum", date: "2025-04-22", type: "pdf" },
  ];

  // Filter documents based on search query
  const filteredDocuments = searchQuery 
    ? mockDocuments.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockDocuments;

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocument(docId);
    setActiveTab("view");
    toast.info("Loading document...");
  };

  const handleUpload = () => {
    toast.success("Document upload interface would open here");
  };

  const handleDownload = () => {
    toast.info("Downloading selected document...");
  };

  const handleExtractData = () => {
    toast.success("Data extracted from document and saved to estimate");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="library" className="flex items-center gap-1">
              <FileArchive className="h-4 w-4" />
              <span>Document Library</span>
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>View Document</span>
            </TabsTrigger>
            <TabsTrigger value="extract" className="flex items-center gap-1">
              <FilePen className="h-4 w-4" />
              <span>Extract Data</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload} 
            disabled={!selectedDocument}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <TabsContent value="library" className="mt-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Document Library</CardTitle>
            <CardDescription>View and manage all bid documents</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-2">{doc.name}</td>
                        <td className="px-4 py-2">{doc.date}</td>
                        <td className="px-4 py-2 uppercase">{doc.type}</td>
                        <td className="px-4 py-2 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDocumentSelect(doc.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center">
                        No documents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="view" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Document Viewer</CardTitle>
            <CardDescription>
              {selectedDocument 
                ? `Viewing: ${mockDocuments.find(d => d.id === selectedDocument)?.name}` 
                : "Select a document to view"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-[600px] rounded-md flex items-center justify-center">
              {selectedDocument ? (
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">PDF Document Viewer</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Document viewer would be integrated here
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No document selected. Please select a document from the library.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="extract" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Extraction</CardTitle>
            <CardDescription>
              Extract important information from bid documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Document Information</h3>
                  <div className="rounded-md border p-4">
                    <dl className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <dt className="text-sm font-medium">Document:</dt>
                        <dd className="text-sm">
                          {selectedDocument 
                            ? mockDocuments.find(d => d.id === selectedDocument)?.name 
                            : "None selected"}
                        </dd>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <dt className="text-sm font-medium">Date:</dt>
                        <dd className="text-sm">
                          {selectedDocument 
                            ? mockDocuments.find(d => d.id === selectedDocument)?.date 
                            : "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Extraction Tools</h3>
                  <div className="rounded-md border p-4 flex flex-col gap-4">
                    <div>
                      <p className="text-sm mb-2">Select information to extract:</p>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                          Quantities
                        </Button>
                        <Button variant="outline" size="sm">
                          Specifications
                        </Button>
                        <Button variant="outline" size="sm">
                          Due Dates
                        </Button>
                        <Button variant="outline" size="sm">
                          Requirements
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleExtractData} 
                      disabled={!selectedDocument}
                    >
                      Extract Data
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Extracted Information</h3>
                <div className="rounded-md border p-4 h-64 bg-muted/30">
                  {selectedDocument ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Extracted data will appear here after processing the document</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Select a document first</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
