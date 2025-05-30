// Mock data for admin components

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  category: 'general' | 'announcements' | 'technical' | 'field' | 'safety';
  tags: string[];
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes: string[];
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

export interface EmployeeAppreciation {
  id: string;
  recipientId: string;
  recipientName: string;
  senderId: string;
  senderName: string;
  title: string;
  message: string;
  category: 'achievement' | 'teamwork' | 'innovation' | 'safety' | 'leadership';
  createdAt: string;
  isPublic: boolean;
}

// Mock additional users
export const mockAdditionalUsers = [
  {
    id: '3',
    email: 'accountant@xdotcontractor.com',
    name: 'Jane Smith',
    role: 'accountant' as const,
    lastLogin: '2023-10-21T09:15:00Z'
  },
  {
    id: '4',
    email: 'field@xdotcontractor.com',
    name: 'Mike Johnson',
    role: 'field_worker' as const,
    lastLogin: '2023-10-20T14:30:00Z'
  },
  {
    id: '5',
    email: 'hr@xdotcontractor.com',
    name: 'Sarah Wilson',
    role: 'hr' as const,
    lastLogin: '2023-10-19T11:20:00Z'
  }
];

// Mock forum posts
export const mockForumPosts: ForumPost[] = [
  {
    id: 'post_1',
    title: 'Welcome to the xDOTContractor Community Forum!',
    content: 'This is our central hub for team communication, knowledge sharing, and collaboration. Feel free to ask questions, share insights, and connect with colleagues across all departments.',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: '2023-10-20T10:00:00Z',
    updatedAt: '2023-10-20T10:00:00Z',
    likes: ['2', '3', '4'],
    category: 'announcements',
    tags: ['welcome', 'community'],
    replies: [
      {
        id: 'reply_1',
        content: 'Great initiative! Looking forward to collaborating with everyone.',
        authorId: '2',
        authorName: 'Project Manager',
        createdAt: '2023-10-20T11:30:00Z',
        likes: ['1', '3']
      }
    ]
  },
  {
    id: 'post_2',
    title: 'Safety Protocol Updates - Please Review',
    content: 'We have updated our safety protocols following the latest industry standards. All field workers should review the new guidelines in the safety section.',
    authorId: '5',
    authorName: 'Sarah Wilson',
    createdAt: '2023-10-21T14:00:00Z',
    updatedAt: '2023-10-21T14:00:00Z',
    likes: ['1', '2', '4'],
    category: 'safety',
    tags: ['safety', 'protocols', 'updates'],
    replies: []
  },
  {
    id: 'post_3',
    title: 'Equipment Maintenance Schedule',
    content: 'Can someone from the field team provide an update on the excavator maintenance schedule? We need to ensure all equipment is serviced before the next project phase.',
    authorId: '2',
    authorName: 'Project Manager',
    createdAt: '2023-10-22T09:15:00Z',
    updatedAt: '2023-10-22T09:15:00Z',
    likes: ['4'],
    category: 'field',
    tags: ['equipment', 'maintenance'],
    replies: [
      {
        id: 'reply_2',
        content: 'The excavator is scheduled for maintenance this Friday. All other equipment is up to date.',
        authorId: '4',
        authorName: 'Mike Johnson',
        createdAt: '2023-10-22T10:30:00Z',
        likes: ['2']
      }
    ]
  }
];

// Mock head office tasks
export const mockHeadOfficeTasks: HeadOfficeTask[] = [
  {
    id: 'task_1',
    title: 'Review Q4 Budget Allocations',
    description: 'Conduct a comprehensive review of Q4 budget allocations across all active projects and prepare recommendations for adjustments.',
    assigneeId: '3',
    assigneeName: 'Jane Smith',
    createdAt: '2023-10-15T08:00:00Z',
    dueDate: '2023-10-30T17:00:00Z',
    priority: 'high',
    status: 'in_progress',
    notes: 'Focus on projects with cost overruns'
  },
  {
    id: 'task_2',
    title: 'Update Employee Handbook',
    description: 'Revise the employee handbook to include new remote work policies and updated safety guidelines.',
    assigneeId: '5',
    assigneeName: 'Sarah Wilson',
    createdAt: '2023-10-18T10:30:00Z',
    dueDate: '2023-11-15T17:00:00Z',
    priority: 'medium',
    status: 'pending',
    notes: 'Coordinate with legal team for policy reviews'
  },
  {
    id: 'task_3',
    title: 'Implement New Project Management Software',
    description: 'Research, evaluate, and implement a new project management software solution to improve workflow efficiency.',
    assigneeId: '1',
    assigneeName: 'Admin User',
    createdAt: '2023-10-20T14:00:00Z',
    dueDate: '2023-12-01T17:00:00Z',
    priority: 'high',
    status: 'pending',
    notes: 'Consider integration with existing systems'
  },
  {
    id: 'task_4',
    title: 'Organize Company Holiday Party',
    description: 'Plan and organize the annual company holiday party for all employees and their families.',
    assigneeId: '5',
    assigneeName: 'Sarah Wilson',
    createdAt: '2023-10-22T11:00:00Z',
    dueDate: '2023-12-15T17:00:00Z',
    priority: 'low',
    status: 'pending',
    notes: 'Budget approved for up to 200 attendees'
  },
  {
    id: 'task_5',
    title: 'Quarterly Safety Training',
    description: 'Coordinate and conduct quarterly safety training sessions for all field workers and site supervisors.',
    assigneeId: '4',
    assigneeName: 'Mike Johnson',
    createdAt: '2023-10-10T09:00:00Z',
    dueDate: '2023-10-25T17:00:00Z',
    priority: 'high',
    status: 'completed',
    notes: 'Training materials updated with latest OSHA requirements'
  }
];

// Mock employee appreciations
export const mockEmployeeAppreciations: EmployeeAppreciation[] = [
  {
    id: 'appreciation_1',
    recipientId: '4',
    recipientName: 'Mike Johnson',
    senderId: '2',
    senderName: 'Project Manager',
    title: 'Outstanding Safety Leadership',
    message: 'Mike has consistently demonstrated exceptional safety leadership on the I-85 project. His proactive approach to identifying and addressing potential hazards has kept our entire team safe.',
    category: 'safety',
    createdAt: '2023-10-20T15:30:00Z',
    isPublic: true
  },
  {
    id: 'appreciation_2',
    recipientId: '3',
    recipientName: 'Jane Smith',
    senderId: '1',
    senderName: 'Admin User',
    title: 'Exceptional Budget Management',
    message: 'Jane\'s meticulous attention to detail in budget tracking has saved the company significant costs this quarter. Her financial analysis is always thorough and insightful.',
    category: 'achievement',
    createdAt: '2023-10-18T11:00:00Z',
    isPublic: true
  },
  {
    id: 'appreciation_3',
    recipientId: '5',
    recipientName: 'Sarah Wilson',
    senderId: '2',
    senderName: 'Project Manager',
    title: 'Team Building Excellence',
    message: 'Sarah organized an amazing team building event that brought everyone together. Her efforts in maintaining team morale are truly appreciated.',
    category: 'teamwork',
    createdAt: '2023-10-16T14:20:00Z',
    isPublic: false
  }
];

export const mockKickoffMeetings = [
  {
    id: '1',
    projectId: 'project-1',
    title: 'I-75 Bridge Project Kickoff',
    date: '2024-01-15',
    time: '09:00',
    location: 'Main Conference Room',
    attendees: ['John Smith', 'Jane Doe', 'Mike Johnson'],
    status: 'completed' as const,
    notes: 'Initial project planning and timeline discussion'
  },
  {
    id: '2',
    projectId: 'project-2',
    title: 'Highway 400 Extension Kickoff',
    date: '2024-01-20',
    time: '14:00',
    location: 'Virtual Meeting',
    attendees: ['Sarah Wilson', 'Tom Brown', 'Lisa Davis'],
    status: 'scheduled' as const,
    notes: 'Review project scope and requirements'
  }
];
