
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, UserRole } from '@/types/auth';
import { ENHANCED_MOCK_USERS, INDIVIDUAL_PROFILES } from '@/data/mockAuthData';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

// All available users for authentication
const ALL_MOCK_USERS = [...ENHANCED_MOCK_USERS, ...INDIVIDUAL_PROFILES];

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
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        const savedUser = localStorage.getItem('xdot-user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setAuthState({
            user: {
              ...user,
              lastLogin: new Date().toISOString(),
            },
            isLoading: false,
            error: null,
          });
        } else {
          // For demo: auto-login as admin after a brief delay
          setTimeout(() => {
            const adminUser = ALL_MOCK_USERS.find(user => user.role === 'admin')!;
            const updatedUser = {
              ...adminUser,
              lastLogin: new Date().toISOString(),
            };
            
            localStorage.setItem('xdot-user', JSON.stringify(updatedUser));
            setAuthState({
              user: updatedUser,
              isLoading: false,
              error: null,
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setAuthState({
          user: null,
          isLoading: false,
          error: 'Failed to restore session',
        });
      }
    };

    checkExistingSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock authentication
      const matchedUser = ALL_MOCK_USERS.find(user => user.email === credentials.email);
      
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
      const existingUser = ALL_MOCK_USERS.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Create a new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isVerified: false,
        twoFactorEnabled: true,
        verificationProviders: {},
      };
      
      // Save to localStorage
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
          navigate('/login');
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

// Export mock users for backward compatibility
export { ENHANCED_MOCK_USERS as MOCK_USERS };
