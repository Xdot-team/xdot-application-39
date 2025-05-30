
export type UserRole = 'admin' | 'project_manager' | 'accountant' | 'field_worker' | 'hr';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  createdAt: string;
  lastLogin: string;
  // New fields for enhanced profiles
  companyId?: string; // For future company association
  verificationProviders?: {
    google?: string;
    microsoft?: string;
    linkedin?: string;
  };
  isVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  adminUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: UserRole;
  phoneNumber?: string;
  companyName?: string;
  companyAddress?: string;
  accountType?: 'individual' | 'corporate';
}

export interface SocialAuthProvider {
  id: string;
  name: string;
  email: string;
  profileId: string;
}
