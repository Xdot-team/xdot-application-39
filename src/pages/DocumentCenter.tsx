
import { requireAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FolderOpen, FileText, Upload, Download, Clock, Star } from "lucide-react";

const DocumentCenter = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Center</h1>
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
            />
          </div>
          
          <Button className="gap-1">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 md:w-[600px]">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="drawings">Drawings</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Project Specifications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">PDF Document • 2.4 MB</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Updated 2 days ago</p>
                  <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Site Plan R2</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">PDF Document • 5.1 MB</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Updated 5 days ago</p>
                  <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Foundation Detail</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">PDF Document • 3.2 MB</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Updated 1 week ago</p>
                  <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Change Order #103</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">PDF Document • 1.3 MB</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Updated 2 weeks ago</p>
                  <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Safety Manual</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">PDF Document • 8.7 MB</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Updated 2 days ago</p>
                  <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer transition-all hover:shadow-md bg-muted/50 flex items-center justify-center h-[143px]">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Upload New Document</p>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Highway 101 Bridge</CardTitle>
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">23 documents</p>
                <div className="flex items-center gap-3 mt-3">
                  <Button variant="outline" size="sm" className="w-full">Open</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Peachtree Street Extension</CardTitle>
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">18 documents</p>
                <div className="flex items-center gap-3 mt-3">
                  <Button variant="outline" size="sm" className="w-full">Open</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">I-85 North Resurfacing</CardTitle>
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">35 documents</p>
                <div className="flex items-center gap-3 mt-3">
                  <Button variant="outline" size="sm" className="w-full">Open</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="drawings" className="mt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-lg text-muted-foreground">Select a project to view associated drawings</p>
          </div>
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-lg text-muted-foreground">Select a project to view associated contracts</p>
          </div>
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
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Site Plan R2 was uploaded</p>
                <p className="text-xs text-muted-foreground">by Michael Johnson • 5 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Change Order #103 was approved</p>
                <p className="text-xs text-muted-foreground">by Sarah Williams • 2 weeks ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Foundation Detail was annotated</p>
                <p className="text-xs text-muted-foreground">by Robert Chen • 1 week ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Favorites Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-sm">Project Specifications</span>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-sm">Site Plan R2</span>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-sm">Safety Manual</span>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default requireAuth()(DocumentCenter);
