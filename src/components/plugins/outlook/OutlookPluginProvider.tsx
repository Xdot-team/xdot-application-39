
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OutlookNotification, OutlookDocument, ProjectFolder, EmailTemplate } from '@/types/outlook';

interface OutlookPluginContextType {
  notifications: OutlookNotification[];
  emailTemplates: EmailTemplate[];
  markNotificationAsRead: (id: string) => void;
  getProjectFolders: (projectId: string) => { name: string; path: string }[];
  searchProjects: (query: string) => Promise<{ id: string; name: string }[]>;
  searchDocuments: (query: string) => Promise<OutlookDocument[]>;
  getEmailTemplate: (templateId: string) => EmailTemplate | undefined;
  generateEmailContent: (templateId: string, projectId: string, recipient?: string) => Promise<string>;
  isAuthenticated: boolean;
}

const OutlookPluginContext = createContext<OutlookPluginContextType | undefined>(undefined);

// Sample data for notifications
const sampleNotifications: OutlookNotification[] = [
  {
    id: 'notif1',
    projectId: '1',
    projectName: 'I-85 North Resurfacing',
    type: 'rfi',
    priority: 'high',
    dueDate: '2025-05-22',
    description: 'RFI #45 response needed regarding asphalt mixture specifications',
    link: '/projects/1/rfis/45',
    isRead: false
  },
  {
    id: 'notif2',
    projectId: '1',
    projectName: 'I-85 North Resurfacing',
    type: 'submittal',
    priority: 'medium',
    dueDate: '2025-05-25',
    description: 'Submittal #23 approval pending for traffic control plan',
    link: '/projects/1/submittals/23',
    isRead: false
  },
  {
    id: 'notif3',
    projectId: '2',
    projectName: 'Highway 400 Bridge Repair',
    type: 'change_order',
    priority: 'high',
    dueDate: '2025-05-20',
    description: 'Change Order #8 requires your review - Additional structural support',
    link: '/projects/2/change-orders/8',
    isRead: false
  },
  {
    id: 'notif4',
    projectId: '2',
    projectName: 'Highway 400 Bridge Repair',
    type: 'task',
    priority: 'low',
    dueDate: '2025-05-30',
    description: 'Complete weekly inspection report for Highway 400 Bridge',
    link: '/projects/2/tasks/inspection-report',
    isRead: false
  },
  {
    id: 'notif5',
    projectId: '3',
    projectName: 'Peachtree Street Extension',
    type: 'update',
    priority: 'medium',
    dueDate: '2025-05-21',
    description: 'Project schedule updated - Review new timeline',
    link: '/projects/3/schedule',
    isRead: false
  }
];

// Sample data for email templates
const sampleEmailTemplates: EmailTemplate[] = [
  {
    id: 'template1',
    name: 'RFI Follow-up',
    subject: 'Follow-up on RFI #{rfiNumber} - {projectName}',
    content: 'Dear {recipientName},\n\nI am writing to follow up on RFI #{rfiNumber} for {projectName}...',
    category: 'rfi'
  },
  {
    id: 'template2',
    name: 'Change Order Request',
    subject: 'Change Order Request #{coNumber} - {projectName}',
    content: 'Dear {recipientName},\n\nAttached is Change Order #{coNumber} for {projectName}...',
    category: 'change_order'
  },
  {
    id: 'template3',
    name: 'Weekly Project Update',
    subject: 'Weekly Update - {projectName} - Week of {weekDate}',
    content: 'Dear {recipientName},\n\nHere is the weekly update for {projectName}...',
    category: 'update'
  }
];

interface OutlookPluginProviderProps {
  children: ReactNode;
}

export const OutlookPluginProvider = ({ children }: OutlookPluginProviderProps) => {
  const { authState } = useAuth();
  const [notifications, setNotifications] = useState<OutlookNotification[]>(sampleNotifications);
  const [emailTemplates] = useState<EmailTemplate[]>(sampleEmailTemplates);
  const isAuthenticated = !!authState.user;

  useEffect(() => {
    // Filter notifications by user role
    if (isAuthenticated && authState.user) {
      const userRole = authState.user.role;
      let filteredNotifications = [...sampleNotifications];
      
      if (userRole === 'accountant') {
        filteredNotifications = filteredNotifications.filter(n => 
          n.type === 'change_order' || n.projectName.includes('I-85')
        );
      } else if (userRole === 'field_worker') {
        filteredNotifications = filteredNotifications.filter(n => 
          n.type === 'task' || n.type === 'update'
        );
      }
      
      setNotifications(filteredNotifications);
    }
  }, [isAuthenticated, authState.user]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const getProjectFolders = (projectId: string) => {
    // In a real implementation, this would fetch from an API
    return [
      { name: 'RFIs', path: `/projects/${projectId}/rfis` },
      { name: 'Submittals', path: `/projects/${projectId}/submittals` },
      { name: 'Change Orders', path: `/projects/${projectId}/change-orders` },
      { name: 'Documents', path: `/projects/${projectId}/documents` },
      { name: 'Schedule', path: `/projects/${projectId}/schedule` }
    ];
  };

  const searchProjects = async (query: string) => {
    // Mock implementation - would call an API
    const mockProjects = [
      { id: '1', name: 'I-85 North Resurfacing' },
      { id: '2', name: 'Highway 400 Bridge Repair' },
      { id: '3', name: 'Peachtree Street Extension' },
      { id: '4', name: 'GA-400 Expansion' },
      { id: '5', name: 'I-75 Bridge Repair' }
    ];
    
    if (!query) return mockProjects;
    
    return mockProjects.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchDocuments = async (query: string): Promise<OutlookDocument[]> => {
    // Mock implementation - would call an API
    const mockDocuments: OutlookDocument[] = [
      { 
        id: 'd1', 
        name: 'Traffic Control Plan', 
        projectId: '1', 
        type: 'PDF', 
        category: 'submittal',
        path: '/projects/1/submittals/23',
        lastModified: '2025-05-15'
      },
      { 
        id: 'd2', 
        name: 'Structural Analysis', 
        projectId: '2', 
        type: 'PDF',
        category: 'rfi',
        path: '/projects/2/rfis/12',
        lastModified: '2025-05-14'
      },
      { 
        id: 'd3', 
        name: 'Change Order #8', 
        projectId: '2', 
        type: 'PDF',
        category: 'change_order',
        path: '/projects/2/change-orders/8',
        lastModified: '2025-05-16'
      },
      { 
        id: 'd4', 
        name: 'Site Survey', 
        projectId: '3', 
        type: 'PDF',
        category: 'document',
        path: '/projects/3/documents/site-survey',
        lastModified: '2025-05-10'
      },
      { 
        id: 'd5', 
        name: 'Material Specifications', 
        projectId: '1', 
        type: 'DOCX',
        category: 'document',
        path: '/projects/1/documents/materials',
        lastModified: '2025-05-12'
      }
    ];
    
    if (!query) return mockDocuments;
    
    return mockDocuments.filter(d => 
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.type.toLowerCase().includes(query.toLowerCase()) ||
      d.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getEmailTemplate = (templateId: string) => {
    return emailTemplates.find(t => t.id === templateId);
  };

  const generateEmailContent = async (
    templateId: string,
    projectId: string,
    recipient?: string
  ): Promise<string> => {
    const template = getEmailTemplate(templateId);
    if (!template) return '';
    
    // This would be populated with real data from the project
    const variables = {
      projectName: 'I-85 North Resurfacing',
      rfiNumber: '45',
      coNumber: '8',
      weekDate: '05/22/2025',
      recipientName: recipient || 'Project Team'
    };
    
    let content = template.content;
    
    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    
    return content;
  };

  return (
    <OutlookPluginContext.Provider
      value={{
        notifications,
        emailTemplates,
        markNotificationAsRead,
        getProjectFolders,
        searchProjects,
        searchDocuments,
        getEmailTemplate,
        generateEmailContent,
        isAuthenticated
      }}
    >
      {children}
    </OutlookPluginContext.Provider>
  );
};

export const useOutlookPlugin = (): OutlookPluginContextType => {
  const context = useContext(OutlookPluginContext);
  if (context === undefined) {
    throw new Error('useOutlookPlugin must be used within an OutlookPluginProvider');
  }
  return context;
};
