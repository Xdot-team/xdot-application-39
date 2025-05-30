
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
}
