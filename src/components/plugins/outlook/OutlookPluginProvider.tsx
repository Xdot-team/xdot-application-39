
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OutlookPluginContextType {
  isConnected: boolean;
  isAuthenticated: boolean;
  activeProject: string | null;
  setActiveProject: (projectId: string | null) => void;
  notifications: Array<{
    id: string;
    projectName: string;
    type: string;
    priority: string;
    dueDate: string;
    description: string;
    isRead: boolean;
  }>;
  markNotificationAsRead: (id: string) => void;
  emailTemplates: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  generateEmailContent: (templateId: string, projectId: string, recipient: string) => Promise<string>;
  searchProjects: (query: string) => Promise<Array<{id: string, name: string}>>;
  getProjectFolders: (projectId: string) => Promise<any>;
  searchDocuments: (query: string) => Promise<Array<{
    id: string;
    name: string;
    type: string;
    projectId: string;
    category: string;
  }>>;
}

const OutlookPluginContext = createContext<OutlookPluginContextType | undefined>(undefined);

export function OutlookPluginProvider({ children }: { children: ReactNode }) {
  const [isConnected] = useState(true);
  const [isAuthenticated] = useState(true);
  const [activeProject, setActiveProject] = useState<string | null>('project-1');
  const [notifications] = useState([
    {
      id: '1',
      projectName: 'I-75 Bridge Project',
      type: 'deadline',
      priority: 'high',
      dueDate: '2024-01-25',
      description: 'Submit progress report',
      isRead: false
    }
  ]);

  const [emailTemplates] = useState([
    { id: '1', name: 'Progress Update', category: 'project' },
    { id: '2', name: 'Meeting Request', category: 'communication' }
  ]);

  const markNotificationAsRead = (id: string) => {
    console.log(`Marking notification ${id} as read`);
  };

  const generateEmailContent = async (templateId: string, projectId: string, recipient: string) => {
    return `Sample email content for template ${templateId}, project ${projectId}, recipient ${recipient}`;
  };

  const searchProjects = async (query: string) => {
    return [
      { id: 'project-1', name: 'I-75 Bridge Project' },
      { id: 'project-2', name: 'Highway 400 Extension' }
    ];
  };

  const getProjectFolders = async (projectId: string) => {
    return [];
  };

  const searchDocuments = async (query: string) => {
    return [
      {
        id: 'doc-1',
        name: 'Project Specification.pdf',
        type: 'pdf',
        projectId: 'project-1',
        category: 'document'
      }
    ];
  };

  return (
    <OutlookPluginContext.Provider value={{
      isConnected,
      isAuthenticated,
      activeProject,
      setActiveProject,
      notifications,
      markNotificationAsRead,
      emailTemplates,
      generateEmailContent,
      searchProjects,
      getProjectFolders,
      searchDocuments
    }}>
      {children}
    </OutlookPluginContext.Provider>
  );
}

export function useOutlookPlugin() {
  const context = useContext(OutlookPluginContext);
  if (!context) {
    throw new Error('useOutlookPlugin must be used within OutlookPluginProvider');
  }
  return context;
}
