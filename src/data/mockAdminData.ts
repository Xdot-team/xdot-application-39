
import { 
  ForumPost, 
  HeadOfficeTask, 
  FrontDeskLog, 
  EmployeeAppreciation, 
  Permission,
  SystemSettings,
  KickoffMeeting
} from '@/types/admin';
import { User } from '@/types/auth';

// Mock Users (extending existing auth types)
export const mockAdditionalUsers: User[] = [
  {
    id: '6',
    email: 'front_desk@xdotcontractor.com',
    name: 'Front Desk Staff',
    role: 'hr', // Closest existing role, would be 'front_desk' if added
    profilePicture: 'https://i.pravatar.cc/150?u=frontdesk',
    phoneNumber: '678-678-9012',
    department: 'Administration',
    position: 'Front Desk Coordinator',
    createdAt: new Date(2023, 5, 15).toISOString(),
    lastLogin: new Date().toISOString(),
    isVerified: true,
    twoFactorEnabled: false,
  },
  {
    id: '7',
    email: 'contractor1@xdotcontractor.com',
    name: 'John Contractor',
    role: 'field_worker',
    profilePicture: 'https://i.pravatar.cc/150?u=contractor1',
    phoneNumber: '678-789-0123',
    department: 'Field Operations',
    position: 'Senior Contractor',
    createdAt: new Date(2023, 6, 5).toISOString(),
    lastLogin: new Date().toISOString(),
    isVerified: true,
    twoFactorEnabled: true,
  },
  {
    id: '8',
    email: 'supervisor1@xdotcontractor.com',
    name: 'Sarah Supervisor',
    role: 'project_manager',
    profilePicture: 'https://i.pravatar.cc/150?u=supervisor1',
    phoneNumber: '678-890-1234',
    department: 'Project Management',
    position: 'Site Supervisor',
    createdAt: new Date(2023, 7, 20).toISOString(),
    lastLogin: new Date().toISOString(),
    isVerified: true,
    twoFactorEnabled: true,
  },
  {
    id: '9',
    email: 'finance1@xdotcontractor.com',
    name: 'Mike Money',
    role: 'accountant',
    profilePicture: 'https://i.pravatar.cc/150?u=finance1',
    phoneNumber: '678-901-2345',
    department: 'Finance',
    position: 'Financial Analyst',
    createdAt: new Date(2023, 8, 10).toISOString(),
    lastLogin: new Date().toISOString(),
    isVerified: true,
    twoFactorEnabled: false,
  },
  {
    id: '10',
    email: 'safety1@xdotcontractor.com',
    name: 'Hannah Health',
    role: 'hr',
    profilePicture: 'https://i.pravatar.cc/150?u=safety1',
    phoneNumber: '678-012-3456',
    department: 'Safety',
    position: 'Safety Coordinator',
    createdAt: new Date(2023, 9, 1).toISOString(),
    lastLogin: new Date().toISOString(),
    isVerified: true,
    twoFactorEnabled: true,
  },
];

// Permissions
export const mockPermissions: Permission[] = [
  { id: '1', name: 'user_management', description: 'Manage users and permissions', module: 'admin' },
  { id: '2', name: 'forum_management', description: 'Manage community forum', module: 'admin' },
  { id: '3', name: 'task_management', description: 'Manage head office tasks', module: 'admin' },
  { id: '4', name: 'front_desk_management', description: 'Manage front desk logs', module: 'admin' },
  { id: '5', name: 'appreciation_management', description: 'Manage employee appreciations', module: 'admin' },
  { id: '6', name: 'system_settings', description: 'Manage system settings', module: 'admin' },
  { id: '7', name: 'project_view', description: 'View projects', module: 'projects' },
  { id: '8', name: 'project_edit', description: 'Edit projects', module: 'projects' },
  { id: '9', name: 'finance_view', description: 'View financial data', module: 'finance' },
  { id: '10', name: 'finance_edit', description: 'Edit financial data', module: 'finance' },
];

// Mock Forum Posts
export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Welcome to the xDOTContractor Community Forum',
    content: 'This is a place for team members to share ideas, ask questions, and collaborate across departments.',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date(2023, 11, 1).toISOString(),
    updatedAt: new Date(2023, 11, 1).toISOString(),
    likes: ['2', '3', '4'],
    category: 'announcements',
    tags: ['welcome', 'announcement'],
    replies: [
      {
        id: '101',
        content: 'Great to have a place to communicate across teams!',
        authorId: '2',
        authorName: 'Project Manager',
        createdAt: new Date(2023, 11, 1, 10, 30).toISOString(),
        likes: ['1', '3']
      }
    ]
  },
  {
    id: '2',
    title: 'New Safety Protocols for Georgia DOT Projects',
    content: 'Please review the updated safety protocols for all Georgia DOT projects. These will be in effect starting next month.',
    authorId: '5',
    authorName: 'HR Manager',
    createdAt: new Date(2023, 11, 5).toISOString(),
    updatedAt: new Date(2023, 11, 5).toISOString(),
    likes: ['1', '2', '4'],
    category: 'safety',
    tags: ['safety', 'protocols', 'Georgia DOT'],
    replies: [
      {
        id: '102',
        content: 'Will these be covered in the next safety training session?',
        authorId: '4',
        authorName: 'Field Worker',
        createdAt: new Date(2023, 11, 5, 14, 15).toISOString(),
        likes: ['5']
      },
      {
        id: '103',
        content: 'Yes, we will cover all updates in the next monthly training.',
        authorId: '5',
        authorName: 'HR Manager',
        createdAt: new Date(2023, 11, 5, 15, 20).toISOString(),
        parentId: '102',
        likes: ['4']
      }
    ]
  },
  {
    id: '3',
    title: 'Equipment Maintenance Schedule Updated',
    content: 'The maintenance schedule for all heavy equipment has been updated for Q1 2024. Please check the Assets module for details.',
    authorId: '3',
    authorName: 'Finance User',
    createdAt: new Date(2023, 11, 10).toISOString(),
    updatedAt: new Date(2023, 11, 10).toISOString(),
    likes: ['1', '2'],
    category: 'general',
    tags: ['equipment', 'maintenance', 'schedule'],
    replies: []
  },
  {
    id: '4',
    title: 'Tips for Using the New Estimating Module',
    content: 'Here are some tips for getting the most out of our new estimating module. Feel free to share your own tips!',
    authorId: '2',
    authorName: 'Project Manager',
    createdAt: new Date(2023, 11, 15).toISOString(),
    updatedAt: new Date(2023, 11, 16).toISOString(),
    likes: ['1', '3', '5'],
    category: 'technical',
    tags: ['estimating', 'tips', 'software'],
    replies: [
      {
        id: '104',
        content: 'I found that using templates saves a lot of time for similar projects.',
        authorId: '3',
        authorName: 'Finance User',
        createdAt: new Date(2023, 11, 15, 9, 45).toISOString(),
        likes: ['2']
      }
    ]
  },
  {
    id: '5',
    title: 'Site Photos from Atlanta Highway Project',
    content: 'Check out these progress photos from our Atlanta Highway expansion project. Great work everyone!',
    authorId: '4',
    authorName: 'Field Worker',
    createdAt: new Date(2023, 11, 20).toISOString(),
    updatedAt: new Date(2023, 11, 20).toISOString(),
    likes: ['1', '2', '5'],
    category: 'field',
    tags: ['photos', 'Atlanta', 'progress'],
    replies: []
  },
  {
    id: '6',
    title: 'Updated Holiday Schedule',
    content: 'Please note the updated company holiday schedule for the upcoming year.',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date(2023, 11, 25).toISOString(),
    updatedAt: new Date(2023, 11, 25).toISOString(),
    likes: ['2', '3', '4', '5'],
    category: 'announcements',
    tags: ['holidays', 'schedule'],
    replies: []
  },
  {
    id: '7',
    title: 'Contractor License Renewal Reminder',
    content: 'Don\'t forget to renew your contractor licenses if they expire in the next 60 days.',
    authorId: '2',
    authorName: 'Project Manager',
    createdAt: new Date(2023, 12, 1).toISOString(),
    updatedAt: new Date(2023, 12, 1).toISOString(),
    likes: ['4'],
    category: 'general',
    tags: ['licenses', 'renewal', 'compliance'],
    replies: []
  },
  {
    id: '8',
    title: 'New Fleet Vehicles Arriving Next Week',
    content: 'We\'re getting 5 new pickup trucks for the field team next week. Sign-up for vehicle assignments will be available soon.',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date(2023, 12, 5).toISOString(),
    updatedAt: new Date(2023, 12, 6).toISOString(),
    likes: ['2', '4'],
    category: 'announcements',
    tags: ['fleet', 'vehicles', 'equipment'],
    replies: []
  },
  {
    id: '9',
    title: 'Question About New Timesheet System',
    content: 'I\'m having trouble submitting hours on the new timesheet system. Is anyone else experiencing this?',
    authorId: '4',
    authorName: 'Field Worker',
    createdAt: new Date(2023, 12, 10).toISOString(),
    updatedAt: new Date(2023, 12, 10).toISOString(),
    likes: [],
    category: 'technical',
    tags: ['timesheet', 'help', 'question'],
    replies: [
      {
        id: '105',
        content: 'I\'ll send out a quick tutorial video later today.',
        authorId: '1',
        authorName: 'Admin User',
        createdAt: new Date(2023, 12, 10, 11, 30).toISOString(),
        likes: ['4']
      }
    ]
  },
  {
    id: '10',
    title: 'Material Delivery Delays for Savannah Project',
    content: 'Please be aware that concrete deliveries for the Savannah project will be delayed by 2 days due to supplier issues.',
    authorId: '2',
    authorName: 'Project Manager',
    createdAt: new Date(2023, 12, 15).toISOString(),
    updatedAt: new Date(2023, 12, 15).toISOString(),
    likes: ['1'],
    category: 'field',
    tags: ['materials', 'delays', 'Savannah'],
    replies: []
  }
];

// Mock Head Office Tasks
export const mockHeadOfficeTasks: HeadOfficeTask[] = [
  {
    id: '1',
    title: 'Update Employee Handbook',
    description: 'Incorporate new safety protocols and remote work policies into the employee handbook.',
    assigneeId: '5',
    assigneeName: 'HR Manager',
    createdAt: new Date(2023, 11, 1).toISOString(),
    dueDate: new Date(2023, 11, 15).toISOString(),
    priority: 'high',
    status: 'completed',
    notes: 'Updated and distributed to all employees via email.'
  },
  {
    id: '2',
    title: 'Review Q4 Budget Projections',
    description: 'Review and finalize Q4 budget projections for all active projects.',
    assigneeId: '3',
    assigneeName: 'Finance User',
    createdAt: new Date(2023, 11, 5).toISOString(),
    dueDate: new Date(2023, 11, 10).toISOString(),
    priority: 'high',
    status: 'completed',
    notes: 'Projections reviewed and approved by CFO.'
  },
  {
    id: '3',
    title: 'Schedule Annual Equipment Inspections',
    description: 'Coordinate with vendors for annual heavy equipment inspections.',
    assigneeId: '2',
    assigneeName: 'Project Manager',
    createdAt: new Date(2023, 11, 10).toISOString(),
    dueDate: new Date(2023, 12, 15).toISOString(),
    priority: 'medium',
    status: 'in_progress',
    notes: 'Vendor contacts updated, scheduling in progress for January.'
  },
  {
    id: '4',
    title: 'Organize Company Holiday Party',
    description: 'Plan and coordinate the annual company holiday celebration.',
    assigneeId: '6',
    assigneeName: 'Front Desk Staff',
    createdAt: new Date(2023, 11, 15).toISOString(),
    dueDate: new Date(2023, 12, 10).toISOString(),
    priority: 'medium',
    status: 'in_progress',
    notes: 'Venue reserved, menu selection in progress.'
  },
  {
    id: '5',
    title: 'Renew Business Licenses',
    description: 'Process renewal applications for state contractor licenses.',
    assigneeId: '1',
    assigneeName: 'Admin User',
    createdAt: new Date(2023, 11, 20).toISOString(),
    dueDate: new Date(2023, 12, 31).toISOString(),
    priority: 'high',
    status: 'pending',
    notes: 'Forms prepared, awaiting signature from CEO.'
  },
  {
    id: '6',
    title: 'Update Website Content',
    description: 'Refresh project portfolio and team information on the company website.',
    assigneeId: '1',
    assigneeName: 'Admin User',
    createdAt: new Date(2023, 12, 1).toISOString(),
    dueDate: new Date(2023, 12, 20).toISOString(),
    priority: 'low',
    status: 'pending',
    notes: 'Gathering updated project photos and employee bios.'
  },
  {
    id: '7',
    title: 'Prepare Year-End Tax Documents',
    description: 'Gather and prepare all necessary tax documents for year-end filing.',
    assigneeId: '3',
    assigneeName: 'Finance User',
    createdAt: new Date(2023, 12, 5).toISOString(),
    dueDate: new Date(2024, 1, 31).toISOString(),
    priority: 'high',
    status: 'pending',
    notes: 'Coordinating with external accounting firm.'
  }
];

// Mock Front Desk Logs
export const mockFrontDeskLogs: FrontDeskLog[] = [
  {
    id: '1',
    type: 'visitor',
    visitorName: 'James Wilson',
    company: 'Georgia DOT',
    contactPerson: 'Project Manager',
    purpose: 'Project Review Meeting',
    timestamp: new Date(2023, 11, 1, 9, 30).toISOString(),
    checkedIn: true,
    checkedOut: new Date(2023, 11, 1, 11, 45).toISOString(),
    notes: 'Scheduled follow-up for next month',
    loggedById: '6'
  },
  {
    id: '2',
    type: 'delivery',
    deliveryCompany: 'FastShip Courier',
    packageDescription: 'Office supplies',
    recipientName: 'Admin Department',
    timestamp: new Date(2023, 11, 2, 14, 15).toISOString(),
    checkedIn: true,
    notes: 'Left in supply room',
    loggedById: '6'
  },
  {
    id: '3',
    type: 'visitor',
    visitorName: 'Maria Rodriguez',
    company: 'Safety First Consultants',
    contactPerson: 'HR Manager',
    purpose: 'Safety Audit',
    timestamp: new Date(2023, 11, 5, 10, 0).toISOString(),
    checkedIn: true,
    checkedOut: new Date(2023, 11, 5, 16, 30).toISOString(),
    notes: 'Completed safety audit, report pending',
    loggedById: '6'
  },
  {
    id: '4',
    type: 'pickup',
    deliveryCompany: 'Document Express',
    packageDescription: 'Bid documents for Savannah project',
    timestamp: new Date(2023, 11, 8, 11, 45).toISOString(),
    checkedIn: true,
    notes: 'Picked up by courier',
    loggedById: '6'
  },
  {
    id: '5',
    type: 'visitor',
    visitorName: 'Robert Chen',
    company: 'ABC Equipment',
    contactPerson: 'Field Supervisor',
    purpose: 'Equipment demonstration',
    timestamp: new Date(2023, 11, 10, 13, 0).toISOString(),
    checkedIn: true,
    checkedOut: new Date(2023, 11, 10, 15, 15).toISOString(),
    notes: 'Demonstrated new excavator model',
    loggedById: '6'
  },
  {
    id: '6',
    type: 'delivery',
    deliveryCompany: 'Tech Solutions',
    packageDescription: 'New laptops for project managers',
    recipientName: 'IT Department',
    timestamp: new Date(2023, 11, 15, 9, 20).toISOString(),
    checkedIn: true,
    notes: 'Delivered to IT for setup',
    loggedById: '6'
  },
  {
    id: '7',
    type: 'other',
    purpose: 'Fire alarm test',
    timestamp: new Date(2023, 11, 20, 8, 30).toISOString(),
    checkedIn: true,
    notes: 'Scheduled test completed successfully',
    loggedById: '6'
  }
];

// Mock Employee Appreciations
export const mockEmployeeAppreciations: EmployeeAppreciation[] = [
  {
    id: '1',
    recipientId: '4',
    recipientName: 'Field Worker',
    senderId: '2',
    senderName: 'Project Manager',
    message: 'Outstanding work on completing the Atlanta highway project ahead of schedule. Your dedication to quality and timeliness is greatly appreciated.',
    createdAt: new Date(2023, 11, 5).toISOString(),
    public: true,
    likes: 8,
    category: 'exceptional_work'
  },
  {
    id: '2',
    recipientId: '3',
    recipientName: 'Finance User',
    senderId: '1',
    senderName: 'Admin User',
    message: 'Thank you for identifying cost-saving opportunities in our supply chain. Your attention to detail saved the company over $50,000 this quarter.',
    createdAt: new Date(2023, 11, 10).toISOString(),
    public: true,
    likes: 12,
    category: 'innovation'
  },
  {
    id: '3',
    recipientId: '5',
    recipientName: 'HR Manager',
    senderId: '1',
    senderName: 'Admin User',
    message: 'Your proactive approach to implementing new safety protocols has significantly improved our safety record. Well done!',
    createdAt: new Date(2023, 11, 15).toISOString(),
    public: true,
    likes: 10,
    category: 'safety'
  },
  {
    id: '4',
    recipientId: '7',
    recipientName: 'John Contractor',
    senderId: '8',
    senderName: 'Sarah Supervisor',
    message: 'Great teamwork in helping the new crew members get up to speed on the Savannah project. Your mentorship is making a real difference.',
    createdAt: new Date(2023, 11, 20).toISOString(),
    public: true,
    likes: 7,
    category: 'teamwork'
  },
  {
    id: '5',
    recipientId: '6',
    recipientName: 'Front Desk Staff',
    senderId: '5',
    senderName: 'HR Manager',
    message: 'Your excellent handling of the client visit from Georgia DOT made a very positive impression. The client specifically mentioned your professionalism.',
    createdAt: new Date(2023, 12, 1).toISOString(),
    public: true,
    likes: 9,
    category: 'customer_service'
  }
];

// Mock System Settings
export const mockSystemSettings: SystemSettings[] = [
  {
    id: '1',
    settingKey: 'company_name',
    settingValue: 'xDOTContractor Inc.',
    description: 'Legal company name used in reports and documents',
    category: 'general',
    updatedAt: new Date(2023, 1, 1).toISOString(),
    updatedBy: 'Admin User'
  },
  {
    id: '2',
    settingKey: 'smtp_server',
    settingValue: 'smtp.xdotcontractor.com',
    description: 'SMTP server for sending system emails',
    category: 'email',
    updatedAt: new Date(2023, 2, 15).toISOString(),
    updatedBy: 'Admin User'
  },
  {
    id: '3',
    settingKey: 'document_retention_days',
    settingValue: '730',
    description: 'Number of days to retain documents before archiving',
    category: 'general',
    updatedAt: new Date(2023, 3, 10).toISOString(),
    updatedBy: 'Admin User'
  },
  {
    id: '4',
    settingKey: 'password_expiry_days',
    settingValue: '90',
    description: 'Number of days before user passwords expire',
    category: 'security',
    updatedAt: new Date(2023, 4, 5).toISOString(),
    updatedBy: 'Admin User'
  },
  {
    id: '5',
    settingKey: 'api_key_weather',
    settingValue: 'wth_a1b2c3d4e5f6g7h8i9j0',
    description: 'API key for weather service integration',
    category: 'api',
    updatedAt: new Date(2023, 5, 20).toISOString(),
    updatedBy: 'Admin User'
  }
];

// Mock Kickoff Meetings
export const mockKickoffMeetings: KickoffMeeting[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'GA-400 Highway Expansion',
    title: 'GA-400 Highway Expansion Kickoff',
    date: new Date(2023, 5, 15).toISOString(),
    time: '09:00',
    location: 'Main Conference Room + Virtual',
    status: 'completed',
    agenda: [
      {
        id: '1',
        topic: 'Project Overview',
        description: 'Overview of the GA-400 Highway Expansion project scope',
        duration: 30,
        presenter: 'Sarah Supervisor',
        order: 1
      },
      {
        id: '2',
        topic: 'Permits and Regulatory Requirements',
        description: 'Discussion of required permits and regulatory compliance',
        duration: 45,
        presenter: 'Mike Money',
        order: 2
      },
      {
        id: '3',
        topic: 'Site Preparation and Logistics',
        description: 'Plans for site preparation and logistics coordination',
        duration: 60,
        presenter: 'John Contractor',
        order: 3
      }
    ],
    attendees: [
      {
        id: '1',
        name: 'Sarah Supervisor',
        company: 'xDOTContractor',
        email: 'supervisor1@xdotcontractor.com',
        phone: '678-890-1234',
        role: 'Project Manager',
        attendance: 'attended'
      },
      {
        id: '2',
        name: 'John Contractor',
        company: 'xDOTContractor',
        email: 'contractor1@xdotcontractor.com',
        phone: '678-789-0123',
        role: 'Senior Contractor',
        attendance: 'attended'
      },
      {
        id: '3',
        name: 'Mike Money',
        company: 'xDOTContractor',
        email: 'finance1@xdotcontractor.com',
        phone: '678-901-2345',
        role: 'Financial Analyst',
        attendance: 'attended'
      },
      {
        id: '4',
        name: 'Robert Chen',
        company: 'Georgia DOT',
        email: 'rchen@gadot.gov',
        phone: '404-555-1234',
        role: 'DOT Representative',
        attendance: 'attended'
      }
    ],
    minutes: 'Meeting was productive with all key stakeholders. We discussed project timelines, budget constraints, and regulatory requirements. The Georgia DOT team expressed concerns about traffic management during construction phases.',
    actionItems: [
      {
        id: '1',
        description: 'Submit final permit applications',
        assignedTo: 'Sarah Supervisor',
        dueDate: new Date(2023, 5, 30).toISOString(),
        status: 'completed',
        completedDate: new Date(2023, 5, 28).toISOString(),
        priority: 'high'
      },
      {
        id: '2',
        description: 'Prepare traffic management plan',
        assignedTo: 'John Contractor',
        dueDate: new Date(2023, 6, 15).toISOString(),
        status: 'completed',
        completedDate: new Date(2023, 6, 14).toISOString(),
        priority: 'high'
      },
      {
        id: '3',
        description: 'Finalize subcontractor agreements',
        assignedTo: 'Mike Money',
        dueDate: new Date(2023, 6, 10).toISOString(),
        status: 'completed',
        completedDate: new Date(2023, 6, 8).toISOString(),
        priority: 'medium'
      }
    ],
    documents: ['GA400_project_brief.pdf', 'GA400_permits_checklist.pdf', 'Traffic_management_template.docx'],
    createdBy: '8', // Sarah Supervisor
    createdAt: new Date(2023, 4, 20).toISOString(),
    updatedAt: new Date(2023, 6, 16).toISOString()
  },
  {
    id: '2',
    projectId: '3',
    projectName: 'Atlanta BeltLine Extension',
    title: 'BeltLine Eastside Extension Kickoff',
    date: new Date(2023, 7, 10).toISOString(),
    time: '10:30',
    location: 'Field Office + Virtual',
    status: 'completed',
    agenda: [
      {
        id: '1',
        topic: 'Project Scope and Timeline',
        description: 'Overview of the BeltLine extension scope and timeline',
        duration: 45,
        presenter: 'Sarah Supervisor',
        order: 1
      },
      {
        id: '2',
        topic: 'Community Engagement Strategy',
        description: 'Plans for community outreach and engagement',
        duration: 30,
        presenter: 'Hannah Health',
        order: 2
      },
      {
        id: '3',
        topic: 'Environmental Considerations',
        description: 'Environmental impact assessment and mitigation strategies',
        duration: 45,
        presenter: 'John Contractor',
        order: 3
      }
    ],
    attendees: [
      {
        id: '1',
        name: 'Sarah Supervisor',
        company: 'xDOTContractor',
        email: 'supervisor1@xdotcontractor.com',
        phone: '678-890-1234',
        role: 'Project Manager',
        attendance: 'attended'
      },
      {
        id: '2',
        name: 'John Contractor',
        company: 'xDOTContractor',
        email: 'contractor1@xdotcontractor.com',
        phone: '678-789-0123',
        role: 'Senior Contractor',
        attendance: 'attended'
      },
      {
        id: '3',
        name: 'Hannah Health',
        company: 'xDOTContractor',
        email: 'safety1@xdotcontractor.com',
        phone: '678-012-3456',
        role: 'Safety Coordinator',
        attendance: 'attended'
      },
      {
        id: '4',
        name: 'Maria Rodriguez',
        company: 'Atlanta BeltLine Inc.',
        email: 'mrodriguez@beltline.org',
        phone: '404-555-5678',
        role: 'BeltLine Representative',
        attendance: 'attended'
      },
      {
        id: '5',
        name: 'James Wilson',
        company: 'City of Atlanta',
        email: 'jwilson@atlantaga.gov',
        phone: '404-555-9012',
        role: 'City Representative',
        attendance: 'attended'
      }
    ],
    minutes: 'Meeting focused on the unique challenges of the BeltLine extension, particularly regarding community impact and environmental concerns. City representatives emphasized the importance of maintaining pedestrian access during construction.',
    actionItems: [
      {
        id: '1',
        description: 'Develop community outreach materials',
        assignedTo: 'Hannah Health',
        dueDate: new Date(2023, 7, 25).toISOString(),
        status: 'completed',
        completedDate: new Date(2023, 7, 23).toISOString(),
        priority: 'high'
      },
      {
        id: '2',
        description: 'Schedule environmental survey',
        assignedTo: 'John Contractor',
        dueDate: new Date(2023, 8, 5).toISOString(),
        status: 'completed',
        completedDate: new Date(2023, 8, 3).toISOString(),
        priority: 'high'
      },
      {
        id: '3',
        description: 'Create pedestrian detour plans',
        assignedTo: 'Sarah Supervisor',
        dueDate: new Date(2023, 8, 10).toISOString(),
        status: 'completed',
        completedDate: new Date(2023, 8, 9).toISOString(),
        priority: 'medium'
      }
    ],
    documents: ['Beltline_extension_plans.pdf', 'Community_engagement_strategy.pptx', 'Environmental_checklist.pdf'],
    createdBy: '8', // Sarah Supervisor
    createdAt: new Date(2023, 6, 25).toISOString(),
    updatedAt: new Date(2023, 8, 15).toISOString()
  },
  {
    id: '3',
    projectId: '5',
    projectName: 'Savannah Port Access Road',
    title: 'Savannah Port Access Project Kickoff',
    date: new Date(2023, 10, 5).toISOString(),
    time: '09:30',
    location: 'Savannah Office + Virtual',
    status: 'scheduled',
    agenda: [
      {
        id: '1',
        topic: 'Project Overview and Objectives',
        description: 'Overview of the Savannah Port Access Road project',
        duration: 30,
        presenter: 'Sarah Supervisor',
        order: 1
      },
      {
        id: '2',
        topic: 'Port Authority Requirements',
        description: 'Special requirements from the Savannah Port Authority',
        duration: 45,
        presenter: 'Mike Money',
        order: 2
      },
      {
        id: '3',
        topic: 'Construction Phasing',
        description: 'Proposed construction phases to minimize port operations disruption',
        duration: 60,
        presenter: 'John Contractor',
        order: 3
      },
      {
        id: '4',
        topic: 'Safety Protocols for Port Proximity',
        description: 'Special safety considerations for working near an active port',
        duration: 45,
        presenter: 'Hannah Health',
        order: 4
      }
    ],
    attendees: [
      {
        id: '1',
        name: 'Sarah Supervisor',
        company: 'xDOTContractor',
        email: 'supervisor1@xdotcontractor.com',
        phone: '678-890-1234',
        role: 'Project Manager',
        attendance: 'confirmed'
      },
      {
        id: '2',
        name: 'John Contractor',
        company: 'xDOTContractor',
        email: 'contractor1@xdotcontractor.com',
        phone: '678-789-0123',
        role: 'Senior Contractor',
        attendance: 'confirmed'
      },
      {
        id: '3',
        name: 'Mike Money',
        company: 'xDOTContractor',
        email: 'finance1@xdotcontractor.com',
        phone: '678-901-2345',
        role: 'Financial Analyst',
        attendance: 'confirmed'
      },
      {
        id: '4',
        name: 'Hannah Health',
        company: 'xDOTContractor',
        email: 'safety1@xdotcontractor.com',
        phone: '678-012-3456',
        role: 'Safety Coordinator',
        attendance: 'confirmed'
      },
      {
        id: '5',
        name: 'Thomas Lee',
        company: 'Georgia Ports Authority',
        email: 'tlee@gaports.com',
        phone: '912-555-3456',
        role: 'Port Operations Director',
        attendance: 'tentative'
      },
      {
        id: '6',
        name: 'Lisa Johnson',
        company: 'Georgia DOT',
        email: 'ljohnson@gadot.gov',
        phone: '912-555-7890',
        role: 'DOT Coastal Region Representative',
        attendance: 'confirmed'
      }
    ],
    minutes: '',
    actionItems: [
      {
        id: '1',
        description: 'Obtain port security clearances for team members',
        assignedTo: 'Sarah Supervisor',
        dueDate: new Date(2023, 10, 25).toISOString(),
        status: 'in_progress',
        priority: 'high'
      },
      {
        id: '2',
        description: 'Finalize construction phasing plan',
        assignedTo: 'John Contractor',
        dueDate: new Date(2023, 11, 10).toISOString(),
        status: 'pending',
        priority: 'high'
      },
      {
        id: '3',
        description: 'Prepare port operations impact assessment',
        assignedTo: 'Mike Money',
        dueDate: new Date(2023, 11, 5).toISOString(),
        status: 'pending',
        priority: 'medium'
      },
      {
        id: '4',
        description: 'Develop special safety training for port environment',
        assignedTo: 'Hannah Health',
        dueDate: new Date(2023, 11, 15).toISOString(),
        status: 'pending',
        priority: 'high'
      }
    ],
    documents: ['Savannah_port_access_plans.pdf', 'Port_authority_requirements.pdf', 'Construction_phasing_draft.xlsx'],
    createdBy: '8', // Sarah Supervisor
    createdAt: new Date(2023, 9, 15).toISOString(),
    updatedAt: new Date(2023, 10, 1).toISOString()
  }
];
