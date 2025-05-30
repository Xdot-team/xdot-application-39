
import { User, Company } from '@/types/auth';

// Enhanced mock users for Georgia contractor
export const ENHANCED_MOCK_USERS: User[] = [
  {
    id: 'admin_001',
    email: 'admin@peachstateroads.com',
    name: 'Sarah Johnson',
    role: 'admin',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (770) 555-0001',
    department: 'Administration',
    position: 'Operations Director',
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2025-05-30T14:30:00Z',
    companyId: 'company_001',
    verificationProviders: {
      google: 'sarah.johnson.admin@gmail.com',
      microsoft: 'sarah.johnson@peachstateroads.onmicrosoft.com'
    },
    isVerified: true,
    twoFactorEnabled: true
  },
  {
    id: 'pm_001',
    email: 'mike.chen@peachstateroads.com',
    name: 'Mike Chen',
    role: 'project_manager',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (770) 555-0002',
    department: 'Project Management',
    position: 'Senior Project Manager',
    createdAt: '2024-02-01T09:00:00Z',
    lastLogin: '2025-05-30T12:15:00Z',
    companyId: 'company_001',
    verificationProviders: {
      linkedin: 'mike-chen-construction'
    },
    isVerified: true,
    twoFactorEnabled: true
  },
  {
    id: 'acc_001',
    email: 'jennifer.williams@peachstateroads.com',
    name: 'Jennifer Williams',
    role: 'accountant',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (770) 555-0003',
    department: 'Finance',
    position: 'Chief Financial Officer',
    createdAt: '2024-01-20T10:00:00Z',
    lastLogin: '2025-05-30T11:45:00Z',
    companyId: 'company_001',
    verificationProviders: {
      microsoft: 'jennifer.williams@peachstateroads.onmicrosoft.com'
    },
    isVerified: true,
    twoFactorEnabled: false
  },
  {
    id: 'fw_001',
    email: 'david.garcia@peachstateroads.com',
    name: 'David Garcia',
    role: 'field_worker',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (770) 555-0004',
    department: 'Field Operations',
    position: 'Site Supervisor',
    createdAt: '2024-03-10T07:30:00Z',
    lastLogin: '2025-05-30T06:00:00Z',
    companyId: 'company_001',
    verificationProviders: {},
    isVerified: true,
    twoFactorEnabled: true
  },
  {
    id: 'hr_001',
    email: 'lisa.thompson@peachstateroads.com',
    name: 'Lisa Thompson',
    role: 'hr',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (770) 555-0005',
    department: 'Human Resources',
    position: 'HR Director',
    createdAt: '2024-02-15T08:30:00Z',
    lastLogin: '2025-05-30T13:20:00Z',
    companyId: 'company_001',
    verificationProviders: {
      linkedin: 'lisa-thompson-hr-ga'
    },
    isVerified: true,
    twoFactorEnabled: false
  }
];

// Individual contractor profiles (not associated with companies)
export const INDIVIDUAL_PROFILES: User[] = [
  {
    id: 'ind_001',
    email: 'robert.miller.contractor@gmail.com',
    name: 'Robert Miller',
    role: 'project_manager',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (678) 555-0101',
    department: 'Independent',
    position: 'Independent Contractor',
    createdAt: '2024-04-01T09:00:00Z',
    lastLogin: '2025-05-29T16:30:00Z',
    verificationProviders: {
      google: 'robert.miller.contractor@gmail.com'
    },
    isVerified: true,
    twoFactorEnabled: true
  },
  {
    id: 'ind_002',
    email: 'amy.rodriguez.construction@gmail.com',
    name: 'Amy Rodriguez',
    role: 'field_worker',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (678) 555-0102',
    department: 'Independent',
    position: 'Specialized Equipment Operator',
    createdAt: '2024-04-15T10:30:00Z',
    lastLogin: '2025-05-30T07:45:00Z',
    verificationProviders: {
      google: 'amy.rodriguez.construction@gmail.com',
      linkedin: 'amy-rodriguez-equipment-operator'
    },
    isVerified: true,
    twoFactorEnabled: false
  },
  {
    id: 'ind_003',
    email: 'james.kim.consulting@gmail.com',
    name: 'James Kim',
    role: 'admin',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (678) 555-0103',
    department: 'Independent',
    position: 'Construction Consultant',
    createdAt: '2024-05-01T11:00:00Z',
    lastLogin: '2025-05-30T15:10:00Z',
    verificationProviders: {
      google: 'james.kim.consulting@gmail.com'
    },
    isVerified: true,
    twoFactorEnabled: true
  },
  {
    id: 'ind_004',
    email: 'maria.santos.estimator@gmail.com',
    name: 'Maria Santos',
    role: 'accountant',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (678) 555-0104',
    department: 'Independent',
    position: 'Freelance Estimator',
    createdAt: '2024-05-10T12:15:00Z',
    lastLogin: '2025-05-29T20:00:00Z',
    verificationProviders: {
      google: 'maria.santos.estimator@gmail.com',
      microsoft: 'maria.santos@outlook.com'
    },
    isVerified: true,
    twoFactorEnabled: false
  },
  {
    id: 'ind_005',
    email: 'kevin.lee.safety@gmail.com',
    name: 'Kevin Lee',
    role: 'hr',
    profilePicture: '/api/placeholder/150/150',
    phoneNumber: '+1 (678) 555-0105',
    department: 'Independent',
    position: 'Safety Compliance Specialist',
    createdAt: '2024-05-20T13:30:00Z',
    lastLogin: '2025-05-30T09:20:00Z',
    verificationProviders: {
      google: 'kevin.lee.safety@gmail.com'
    },
    isVerified: true,
    twoFactorEnabled: true
  }
];

// Mock company data for Georgia contractors
export const MOCK_COMPANIES: Company[] = [
  {
    id: 'company_001',
    name: 'Peach State Roads LLC',
    email: 'info@peachstateroads.com',
    phoneNumber: '+1 (770) 555-0000',
    address: '1234 Highway 400, Alpharetta, GA 30005',
    adminUserId: 'admin_001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-05-30T00:00:00Z'
  },
  {
    id: 'company_002',
    name: 'Georgia Infrastructure Solutions',
    email: 'contact@ga-infrastructure.com',
    phoneNumber: '+1 (404) 555-0200',
    address: '5678 Peachtree Industrial Blvd, Norcross, GA 30071',
    adminUserId: 'admin_002',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-05-30T00:00:00Z'
  }
];
