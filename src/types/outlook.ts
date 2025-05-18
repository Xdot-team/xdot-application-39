
export interface OutlookDocument {
  id: string;
  name: string;
  projectId: string;
  type: string;
  category: 'rfi' | 'submittal' | 'change_order' | 'document' | 'other';
  path: string;
  lastModified: string;
}

export interface OutlookNotification {
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

export interface ProjectFolder {
  id: string;
  name: string;
  path: string;
  projectId: string;
  type: 'rfi' | 'submittal' | 'change_order' | 'document' | 'other';
  itemCount: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}
