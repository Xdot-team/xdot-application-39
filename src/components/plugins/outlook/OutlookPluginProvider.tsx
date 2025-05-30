
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PluginNotification {
  id: string;
  projectId: string;
  projectName: string;
  type: 'rfi' | 'submittal' | 'change_order' | 'task' | 'update';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description: string;
  link: string;
  isRead: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  category: 'rfi' | 'change_order' | 'project_update' | 'submittal' | 'general';
  subject: string;
  content: string;
  variables: string[];
}

interface OutlookPluginContextType {
  notifications: PluginNotification[];
  emailTemplates: EmailTemplate[];
  markNotificationAsRead: (id: string) => void;
  getProjectFolders: (projectId: string) => { name: string; path: string }[];
  searchProjects: (query: string) => Promise<{ id: string; name: string }[]>;
  searchDocuments: (query: string) => Promise<{ id: string; name: string; type: string; projectId: string }[]>;
  getEmailTemplate: (templateId: string) => EmailTemplate | undefined;
  generateEmailContent: (templateId: string, projectId: string, recipient?: string) => Promise<string>;
  isAuthenticated: boolean;
}

const OutlookPluginContext = createContext<OutlookPluginContextType | undefined>(undefined);

// Sample data for email templates
const sampleEmailTemplates: EmailTemplate[] = [
  {
    id: 'template1',
    name: 'RFI Follow-up',
    category: 'rfi',
    subject: 'Follow-up on RFI #{rfiNumber} - {projectName}',
    content: `Dear {recipientName},

I hope this email finds you well. I am writing to follow up on the Request for Information (RFI #{rfiNumber}) that was submitted on {submitDate} regarding {projectName}.

The RFI concerns {rfiDescription} and we require this information to proceed with {taskDescription}. As the response deadline of {dueDate} has passed, we would appreciate your prompt attention to this matter.

Please let me know if you need any additional information to address this RFI.

Best regards,
{senderName}
{senderPosition}
xDOTContractor`,
    variables: ['rfiNumber', 'projectName', 'recipientName', 'submitDate', 'rfiDescription', 'taskDescription', 'dueDate', 'senderName', 'senderPosition']
  },
  {
    id: 'template2',
    name: 'Change Order Request',
    category: 'change_order',
    subject: 'Change Order Request #{changeOrderNumber} for {projectName}',
    content: `Dear {recipientName},

Please find attached Change Order Request #{changeOrderNumber} for the {projectName} project.

This change order addresses the following items:
- {changeDescription}

The total cost impact of this change order is {costImpact}, with a schedule impact of {scheduleImpact} days.

The change is necessary due to {reasonForChange}. All supporting documentation is attached to this email.

Please review and approve this change order at your earliest convenience so that we can proceed with the adjusted scope of work.

Thank you for your prompt attention to this matter.

Best regards,
{senderName}
{senderPosition}
xDOTContractor`,
    variables: ['changeOrderNumber', 'projectName', 'recipientName', 'changeDescription', 'costImpact', 'scheduleImpact', 'reasonForChange', 'senderName', 'senderPosition']
  },
  {
    id: 'template3',
    name: 'GA Project Update',
    category: 'project_update',
    subject: 'Weekly Progress Update - {projectName} - Week of {weekStartDate}',
    content: `Dear {recipientName},

I'm writing to provide you with the weekly progress update for the {projectName} project for the week of {weekStartDate}.

Weekly Progress Summary:
- Completed activities: {completedActivities}
- Current activities: {currentActivities}
- Planned for next week: {plannedActivities}

Schedule Status:
- Overall project completion: {completionPercentage}%
- Current status: {onSchedule}
- Weather days this week: {weatherDays}

Issues/Concerns:
{issuesAndConcerns}

Please let me know if you need any clarification or have questions regarding this update.

Best regards,
{senderName}
{senderPosition}
xDOTContractor`,
    variables: ['projectName', 'recipientName', 'weekStartDate', 'completedActivities', 'currentActivities', 'plannedActivities', 'completionPercentage', 'onSchedule', 'weatherDays', 'issuesAndConcerns', 'senderName', 'senderPosition']
  }
];

// Sample notifications
const sampleNotifications: PluginNotification[] = [
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

interface OutlookPluginProviderProps {
  children: ReactNode;
}

export const OutlookPluginProvider = ({ children }: OutlookPluginProviderProps) => {
  const { authState } = useAuth();
  const [notifications, setNotifications] = useState<PluginNotification[]>(sampleNotifications);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(sampleEmailTemplates);
  const isAuthenticated = !!authState.user;

  useEffect(() => {
    // In a real implementation, we would fetch the notifications from the server
    // based on the authenticated user's role and permissions
    if (isAuthenticated) {
      // Filter notifications based on user role
      const userRole = authState.user?.role;
      const filteredNotifications = sampleNotifications.filter(notification => {
        // This is a simplified example of role-based filtering
        // In a real implementation, this would be more sophisticated
        switch (userRole) {
          case 'project_manager':
            return true; // Project managers see all notifications
          case 'accountant':
            return notification.type === 'change_order'; // Accountants only see change orders
          case 'field_worker':
            return notification.type === 'task' || notification.type === 'update'; // Field workers see tasks and updates
          case 'hr':
            return false; // HR doesn't see project notifications
          default:
            return true; // Admin sees everything
        }
      });

      setNotifications(filteredNotifications);
    }
  }, [authState.user, isAuthenticated]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const getProjectFolders = (projectId: string) => {
    // In a real implementation, this would fetch from an API
    return [
      { name: 'RFIs', path: `/projects/${projectId}/rfis` },
      { name: 'Submittals', path: `/projects/${projectId}/submittals` },
      { name: 'Change Orders', path: `/projects/${projectId}/change-orders` },
      { name: 'Documents', path: `/projects/${projectId}/documents` },
      { name: 'Schedule', path: `/projects/${projectId}/schedule` },
      { name: 'Tasks', path: `/projects/${projectId}/tasks` }
    ];
  };

  const searchProjects = async (query: string): Promise<{ id: string; name: string }[]> => {
    // Mock implementation - in reality would call an API
    const mockProjects = [
      { id: '1', name: 'I-85 North Resurfacing' },
      { id: '2', name: 'Highway 400 Bridge Repair' },
      { id: '3', name: 'Peachtree Street Extension' },
      { id: '4', name: 'GA-400 Expansion' },
      { id: '5', name: 'I-75 Bridge Repair' }
    ];
    
    return mockProjects.filter(project => 
      project.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchDocuments = async (query: string): Promise<{ id: string; name: string; type: string; projectId: string }[]> => {
    // Mock implementation - in reality would call an API
    const mockDocuments = [
      { id: 'doc1', name: 'I-85 Traffic Control Plan', type: 'PDF', projectId: '1' },
      { id: 'doc2', name: 'Highway 400 Structural Analysis', type: 'PDF', projectId: '2' },
      { id: 'doc3', name: 'Peachtree St Site Survey', type: 'PDF', projectId: '3' },
      { id: 'doc4', name: 'Material Specifications', type: 'DOCX', projectId: '1' },
      { id: 'doc5', name: 'Safety Compliance Checklist', type: 'XLSX', projectId: '2' }
    ];
    
    return mockDocuments.filter(doc => 
      doc.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getEmailTemplate = (templateId: string) => {
    return emailTemplates.find(template => template.id === templateId);
  };

  const generateEmailContent = async (templateId: string, projectId: string, recipient?: string): Promise<string> => {
    const template = getEmailTemplate(templateId);
    if (!template) return '';

    // Mock data for template variables - in a real implementation this would be fetched from the project data
    const mockVariables: Record<string, string> = {
      rfiNumber: '45',
      projectName: 'I-85 North Resurfacing',
      recipientName: recipient || 'John Smith',
      submitDate: '2025-05-10',
      rfiDescription: 'asphalt mixture specifications',
      taskDescription: 'road base preparation',
      dueDate: '2025-05-22',
      senderName: authState.user?.name || 'Site Manager',
      senderPosition: 'Project Manager',
      changeOrderNumber: '8',
      changeDescription: 'Additional structural support for bridge section B',
      costImpact: '$45,000',
      scheduleImpact: '5',
      reasonForChange: 'unexpected soil conditions',
      weekStartDate: '2025-05-13',
      completedActivities: 'Base preparation, drainage installation',
      currentActivities: 'Concrete pouring, reinforcement installation',
      plannedActivities: 'Curing, surface preparation',
      completionPercentage: '45',
      onSchedule: 'On schedule',
      weatherDays: '1',
      issuesAndConcerns: 'None at this time'
    };

    let content = template.content;
    for (const variable of template.variables) {
      const value = mockVariables[variable] || `{${variable}}`;
      content = content.replace(new RegExp(`{${variable}}`, 'g'), value);
    }

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
