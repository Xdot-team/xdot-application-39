
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, Download, File, FileText, FolderOpen, Search, Upload } from "lucide-react";
import { useState } from "react";

type ResourceType = "specification" | "license" | "insurance" | "study" | "general";

interface LibraryResource {
  id: string;
  title: string;
  type: ResourceType;
  category: string;
  fileType: string;
  fileSize: string;
  lastUpdated: string;
  icon: React.ElementType;
}

const mockLibraryResources: LibraryResource[] = [
  {
    id: "1",
    title: "Standard Construction Specifications",
    type: "specification",
    category: "Construction",
    fileType: "PDF Document",
    fileSize: "4.2 MB",
    lastUpdated: "2025-03-15",
    icon: FileText,
  },
  {
    id: "2",
    title: "Company Insurance Certificate",
    type: "insurance",
    category: "Legal",
    fileType: "PDF Document",
    fileSize: "1.8 MB",
    lastUpdated: "2025-04-10",
    icon: FileText,
  },
  {
    id: "3",
    title: "Bonding License",
    type: "license",
    category: "Legal",
    fileType: "PDF Document",
    fileSize: "1.3 MB",
    lastUpdated: "2025-01-22",
    icon: FileText,
  },
  {
    id: "4",
    title: "Material Safety Data Sheets",
    type: "specification",
    category: "Safety",
    fileType: "PDF Document",
    fileSize: "8.7 MB",
    lastUpdated: "2025-02-28",
    icon: FileText,
  },
  {
    id: "5",
    title: "Concrete Pour Best Practices",
    type: "study",
    category: "Training",
    fileType: "PDF Document",
    fileSize: "3.5 MB",
    lastUpdated: "2025-03-05",
    icon: Book,
  },
  {
    id: "6",
    title: "Heavy Equipment Operation Manual",
    type: "study",
    category: "Training",
    fileType: "PDF Document",
    fileSize: "12.3 MB",
    lastUpdated: "2025-02-10",
    icon: Book,
  },
  {
    id: "7",
    title: "State Contractor License",
    type: "license",
    category: "Legal",
    fileType: "PDF Document",
    fileSize: "2.1 MB",
    lastUpdated: "2025-01-15",
    icon: FileText,
  },
  {
    id: "8",
    title: "Highway Construction Standards",
    type: "specification",
    category: "Construction",
    fileType: "PDF Document",
    fileSize: "7.8 MB",
    lastUpdated: "2024-12-05",
    icon: FileText,
  },
];

export function LibraryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Filtering logic
  const filteredResources = mockLibraryResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || resource.type === selectedType;
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(mockLibraryResources.map(resource => resource.category)));
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search library resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="specification">Specifications</SelectItem>
            <SelectItem value="license">Licenses</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="study">Study Material</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Resources grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{resource.title}</CardTitle>
              <resource.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span className="text-xs bg-muted px-2 py-1 rounded-md">{resource.category}</span>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">{resource.type}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{resource.fileType} • {resource.fileSize}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs">Updated {new Date(resource.lastUpdated).toLocaleDateString()}</p>
                <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Upload Card */}
        <Card className="cursor-pointer transition-all hover:shadow-md bg-muted/50 flex items-center justify-center h-[165px]">
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Upload New Resource</p>
          </div>
        </Card>
      </div>
      
      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resource Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {categories.map((category) => {
              const count = mockLibraryResources.filter(r => r.category === category).length;
              return (
                <div key={category} className="flex items-center gap-3 p-3 border rounded-md">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{category}</p>
                    <p className="text-xs text-muted-foreground">{count} resources</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
