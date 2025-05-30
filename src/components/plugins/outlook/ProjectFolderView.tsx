
import React, { useState, useEffect } from 'react';
import { FolderOpen, ChevronRight, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOutlookPlugin } from './OutlookPluginProvider';

interface ProjectFolderViewProps {
  searchQuery: string;
}

interface Project {
  id: string;
  name: string;
}

export function ProjectFolderView({ searchQuery }: ProjectFolderViewProps) {
  const { searchProjects, getProjectFolders, searchDocuments } = useOutlookPlugin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [documents, setDocuments] = useState<{ id: string; name: string; type: string; projectId: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Get initial projects
        const initialProjects = await searchProjects('');
        setProjects(initialProjects.slice(0, 3)); // Just show a few projects initially
        
        // Preload some documents
        if (initialProjects.length > 0) {
          const docs = await searchDocuments('');
          setDocuments(docs);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [searchProjects, searchDocuments]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;
      
      setIsLoading(true);
      try {
        // Search projects
        const projectResults = await searchProjects(searchQuery);
        setProjects(projectResults);
        
        // Search documents
        const documentResults = await searchDocuments(searchQuery);
        setDocuments(documentResults);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, searchProjects, searchDocuments]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    // Auto-expand project when selected
    setExpandedFolders(prev => ({
      ...prev,
      [project.id]: true
    }));
  };

  return (
    <div className="p-3">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <>
          {!selectedProject ? (
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Projects</h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => selectProject(project)}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {project.name}
                  </Button>
                ))}
              </div>
              
              {searchQuery && documents.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-sm mb-2">Documents</h3>
                  <div className="space-y-2">
                    {documents.slice(0, 5).map(doc => (
                      <div 
                        key={doc.id} 
                        className="flex items-center p-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{doc.name}</span>
                        <Badge variant="outline" className="ml-auto text-[10px]">{doc.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{selectedProject.name}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2" 
                  onClick={() => setSelectedProject(null)}
                >
                  Back
                </Button>
              </div>
              
              <div className="space-y-1">
                {getProjectFolders(selectedProject.id).map((folder, index) => (
                  <div key={index}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => toggleFolder(`${selectedProject.id}_${folder.name}`)}
                    >
                      <ChevronRight 
                        className={`h-4 w-4 mr-1 transition-transform ${expandedFolders[`${selectedProject.id}_${folder.name}`] ? 'transform rotate-90' : ''}`} 
                      />
                      <FolderOpen className="h-4 w-4 mr-2" />
                      {folder.name}
                    </Button>
                    
                    {expandedFolders[`${selectedProject.id}_${folder.name}`] && (
                      <div className="pl-8 space-y-1 mt-1">
                        {documents
                          .filter(doc => doc.projectId === selectedProject.id)
                          .slice(0, 3)
                          .map(doc => (
                            <div 
                              key={doc.id} 
                              className="flex items-center p-2 text-xs hover:bg-gray-100 rounded-md"
                            >
                              <File className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{doc.name}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
