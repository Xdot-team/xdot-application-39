
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { JobSafetyAnalysisData, JSATemplate } from "@/types/safety";
import { ClipboardList, Calendar, MapPin, User, Pencil, Plus, Trash, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { mockJSAData, mockJSATemplates } from "@/data/mockSafetyData";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JSAForm } from "./forms/JSAForm";

export function JobSafetyAnalysis() {
  const [activeTab, setActiveTab] = useState("overview");
  const [jsaData, setJsaData] = useState<JobSafetyAnalysisData[]>(mockJSAData);
  const [jsaTemplates, setJsaTemplates] = useState<JSATemplate[]>(mockJSATemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [showJsaForm, setShowJsaForm] = useState(false);
  const [editingJsa, setEditingJsa] = useState<JobSafetyAnalysisData | null>(null);
  const isMobile = useIsMobile();

  // Filter JSAs based on search, status, and project
  const filteredJSAs = jsaData.filter(jsa => {
    const matchesSearch = 
      jsa.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      jsa.taskDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jsa.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || jsa.status === selectedStatus;
    const matchesProject = selectedProject === "all" || jsa.projectId === selectedProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const handleCreateJSA = () => {
    setEditingJsa(null);
    setShowJsaForm(true);
  };

  const handleEditJSA = (jsa: JobSafetyAnalysisData) => {
    setEditingJsa(jsa);
    setShowJsaForm(true);
  };

  const handleSaveJSA = (jsaData: JobSafetyAnalysisData) => {
    if (editingJsa) {
      // Update existing JSA
      setJsaData(prevJSAs => prevJSAs.map(j => j.id === jsaData.id ? jsaData : j));
    } else {
      // Add new JSA
      setJsaData(prevJSAs => [...prevJSAs, jsaData]);
    }
    setShowJsaForm(false);
    setEditingJsa(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get unique project IDs for filtering
  const projectOptions = Array.from(
    new Set(jsaData.map(jsa => jsa.projectId))
  ).map(projectId => {
    const project = jsaData.find(jsa => jsa.projectId === projectId);
    return {
      id: projectId,
      name: project?.projectName || projectId
    };
  });

  if (showJsaForm) {
    return (
      <JSAForm 
        jsaData={editingJsa} 
        templates={jsaTemplates}
        onSave={handleSaveJSA} 
        onCancel={() => {
          setShowJsaForm(false);
          setEditingJsa(null);
        }}
      />
    );
  }

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">JSA Overview</TabsTrigger>
          <TabsTrigger value="templates">JSA Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-1/2">
              <Input
                placeholder="Search JSAs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projectOptions.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="default" onClick={handleCreateJSA}>
                <Plus className="h-4 w-4 mr-1" /> Create JSA
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredJSAs.length > 0 ? (
              filteredJSAs.map((jsa) => (
                <Card key={jsa.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{jsa.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(jsa.createdDate), "MMM d, yyyy")}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {getStatusBadge(jsa.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-3">
                      {jsa.taskDescription}
                    </p>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span className="truncate">{jsa.location}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1" />
                        <span>Created by: {jsa.createdBy}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        <span>Project: {jsa.projectName}</span>
                      </div>
                      <div className="flex items-center">
                        <ClipboardList className="h-3.5 w-3.5 mr-1" />
                        <span>Tasks: {jsa.items.length}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditJSA(jsa)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" /> View/Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No JSAs match your search criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">JSA Templates</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {jsaTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{template.taskDescription}</p>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-1">Task Steps:</h4>
                    <ul className="text-sm list-disc pl-5">
                      {template.items.map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item.taskStep}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-1">Required PPE:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.requiredPPE.map((ppe, index) => (
                        <Badge key={index} variant="outline">{ppe}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Use Template
                    </Button>
                    <Button variant="ghost" size="sm" className="w-auto">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
