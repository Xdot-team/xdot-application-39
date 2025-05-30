
import React, { useState, useEffect } from 'react';
import { FolderOpen, ChevronRight, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOutlookPlugin } from './OutlookPluginProvider';
import { ProjectFolderItem } from './ProjectFolderItem';
import { OutlookDocument, ProjectFolder } from '@/types/outlook';

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
  const [documents, setDocuments] = useState<OutlookDocument[]>([]);
  const [folders, setFolders] = useState<ProjectFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Get initial projects
        const initialProjects = await searchProjects('');
        setProjects(initialProjects.slice(0, 5));
        
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
    // Generate sample folders when project is selected
    if (selectedProject) {
      const projectFolders: ProjectFolder[] = [
        { 
          id: `${selectedProject.id}_rfi`, 
          name: 'RFIs', 
          path: `/projects/${selectedProject.id}/rfis`,
          projectId: selectedProject.id,
          type: 'rfi',
          itemCount: 4
        },
        { 
          id: `${selectedProject.id}_submittal`, 
          name: 'Submittals', 
          path: `/projects/${selectedProject.id}/submittals`,
          projectId: selectedProject.id,
          type: 'submittal',
          itemCount: 3
        },
        { 
          id: `${selectedProject.id}_change_order`, 
          name: 'Change Orders', 
          path: `/projects/${selectedProject.id}/change-orders`,
          projectId: selectedProject.id,
          type: 'change_order',
          itemCount: 2
        },
        { 
          id: `${selectedProject.id}_document`, 
          name: 'Documents', 
          path: `/projects/${selectedProject.id}/documents`,
          projectId: selectedProject.id,
          type: 'document',
          itemCount: 5
        }
      ];
      setFolders(projectFolders);
    }
  }, [selectedProject]);

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
    // Reset expanded folders when changing projects
    setExpandedFolders({});
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
                    <FolderOpen className="h-4 w-4 mr-2 text-blue-600" />
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
                {folders.map((folder) => (
                  <div key={folder.id}>
                    <ProjectFolderItem 
                      folder={folder}
                      expanded={!!expandedFolders[folder.id]} 
                      onToggle={() => toggleFolder(folder.id)}
                    />
                    
                    {expandedFolders[folder.id] && (
                      <div className="pl-8 space-y-1 mt-1">
                        {documents
                          .filter(doc => 
                            doc.projectId === selectedProject.id && 
                            doc.category === folder.type
                          )
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
