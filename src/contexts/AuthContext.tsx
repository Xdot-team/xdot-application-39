
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, UserRole } from '@/types/auth';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

// Mock users for the prototype
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@xdotcontractor.com',
    name: 'Admin User',
    role: 'admin',
    profilePicture: 'https://i.pravatar.cc/150?u=admin',
    phoneNumber: '678-123-4567',
    department: 'Administration',
    position: 'System Administrator',
    createdAt: new Date(2023, 0, 1).toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'pm@xdotcontractor.com',
    name: 'Project Manager',
    role: 'project_manager',
    profilePicture: 'https://i.pravatar.cc/150?u=pm',
    phoneNumber: '678-234-5678',
    department: 'Operations',
    position: 'Senior Project Manager',
    createdAt: new Date(2023, 1, 15).toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'accountant@xdotcontractor.com',
    name: 'Finance User',
    role: 'accountant',
    profilePicture: 'https://i.pravatar.cc/150?u=accountant',
    phoneNumber: '678-345-6789',
    department: 'Finance',
    position: 'Senior Accountant',
    createdAt: new Date(2023, 2, 10).toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'field@xdotcontractor.com',
    name: 'Field Worker',
    role: 'field_worker',
    profilePicture: 'https://i.pravatar.cc/150?u=field',
    phoneNumber: '678-456-7890',
    department: 'Operations',
    position: 'Site Supervisor',
    createdAt: new Date(2023, 3, 5).toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'hr@xdotcontractor.com',
    name: 'HR Manager',
    role: 'hr',
    profilePicture: 'https://i.pravatar.cc/150?u=hr',
    phoneNumber: '678-567-8901',
    department: 'Human Resources',
    position: 'HR Director',
    createdAt: new Date(2023, 4, 20).toISOString(),
    lastLogin: new Date().toISOString(),
  },
];

// Password for all mock users is 'password'
const MOCK_PASSWORD = 'password';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterCredentials) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // For prototype: automatically log in as admin
    const autoLogin = async () => {
      try {
        const adminUser = MOCK_USERS.find(user => user.role === 'admin')!;
        
        // Update with current timestamp
        const updatedUser = {
          ...adminUser,
          lastLogin: new Date().toISOString(),
        };
        
        // Save to localStorage
        localStorage.setItem('xdot-user', JSON.stringify(updatedUser));
        
        setAuthState({
          user: updatedUser,
          isLoading: false,
          error: null,
        });
        
        // No need to navigate as App.tsx handles initial routing
      } catch (error) {
        console.error('Auto-login error:', error);
        setAuthState({
          user: null,
          isLoading: false,
          error: 'Failed to auto-authenticate',
        });
      }
    };

    autoLogin();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock authentication
      const matchedUser = MOCK_USERS.find(user => user.email === credentials.email);
      
      if (matchedUser && credentials.password === MOCK_PASSWORD) {
        // Update last login time
        const updatedUser = {
          ...matchedUser,
          lastLogin: new Date().toISOString(),
        };

        // Save to localStorage
        localStorage.setItem('xdot-user', JSON.stringify(updatedUser));
        
        setAuthState({
          user: updatedUser,
          isLoading: false,
          error: null,
        });

        toast.success(`Welcome back, ${updatedUser.name}!`);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({
        user: null,
        isLoading: false,
        error: (error as Error).message || 'Login failed',
      });
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const logout = (): void => {
    localStorage.removeItem('xdot-user');
    setAuthState({
      user: null,
      isLoading: false,
      error: null,
    });
    toast.info('You have been logged out.');
    navigate('/login');
  };

  const register = async (userData: RegisterCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Check if email already exists
      const existingUser = MOCK_USERS.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Create a new user (in a real app this would be done on the backend)
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      // In a real app, we would save this user to the database
      // For the prototype, we'll just save to localStorage
      localStorage.setItem('xdot-user', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isLoading: false,
        error: null,
      });
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message || 'Registration failed',
      }));
      toast.error((error as Error).message || 'Registration failed');
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...userData };
    localStorage.setItem('xdot-user', JSON.stringify(updatedUser));
    
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
    
    toast.success('Profile updated successfully');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const requireAuth = (role: UserRole | UserRole[] | null = null) => 
  (Component: React.ComponentType<any>) => {
    return (props: any) => {
      const { authState } = useAuth();
      const navigate = useNavigate();
      
      useEffect(() => {
        if (!authState.isLoading && !authState.user) {
          navigate('/dashboard'); // Changed from '/login' to '/dashboard'
        } else if (
          !authState.isLoading && 
          authState.user && 
          role !== null
        ) {
          const roles = Array.isArray(role) ? role : [role];
          if (!roles.includes(authState.user.role)) {
            toast.error('You do not have permission to access this page');
            navigate('/dashboard');
          }
        }
      }, [authState.isLoading, authState.user, navigate]);
      
      if (authState.isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
      }
      
      if (!authState.user) {
        return null; // Will redirect in useEffect
      }
      
      if (role !== null) {
        const roles = Array.isArray(role) ? role : [role];
        if (!roles.includes(authState.user.role)) {
          return null; // Will redirect in useEffect
        }
      }
      
      return <Component {...props} />;
    };
  };
