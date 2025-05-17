
export type UserRole = 'admin' | 'project_manager' | 'accountant' | 'field_worker' | 'hr' | 'front_desk';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface UserPermission {
  userId: string;
  permissionId: string;
  granted: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: string[]; // Array of user IDs who liked the post
  category: 'announcements' | 'general' | 'technical' | 'field' | 'safety';
  tags: string[];
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  parentId?: string; // For threaded replies
  likes: string[]; // Array of user IDs who liked the reply
}

export interface HeadOfficeTask {
  id: string;
  title: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

export interface FrontDeskLog {
  id: string;
  type: 'visitor' | 'delivery' | 'pickup' | 'other';
  visitorName?: string;
  company?: string;
  contactPerson?: string;
  purpose?: string;
  deliveryCompany?: string;
  packageDescription?: string;
  recipientName?: string;
  timestamp: string;
  checkedIn: boolean;
  checkedOut?: string;
  notes?: string;
  loggedById: string;
}

export interface EmployeeAppreciation {
  id: string;
  recipientId: string;
  recipientName: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
  public: boolean;
  likes: number;
  category: 'exceptional_work' | 'teamwork' | 'innovation' | 'safety' | 'customer_service';
}

export interface SystemSettings {
  id: string;
  settingKey: string;
  settingValue: string;
  description: string;
  category: 'api' | 'email' | 'security' | 'general' | 'notifications';
  updatedAt: string;
  updatedBy: string;
}
