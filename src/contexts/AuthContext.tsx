import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, UserRole } from '@/types/auth';
import { ENHANCED_MOCK_USERS, INDIVIDUAL_PROFILES } from '@/data/mockAuthData';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

// All available users for authentication
const ALL_MOCK_USERS = [...ENHANCED_MOCK_USERS, ...INDIVIDUAL_PROFILES];

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
    // Auto-login as admin user immediately (no authentication required)
    const adminUser = ALL_MOCK_USERS.find(user => user.role === 'admin')!;
    const updatedUser = {
      ...adminUser,
      lastLogin: new Date().toISOString(),
    };
    
    setAuthState({
      user: updatedUser,
      isLoading: false,
      error: null,
    });
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    // Not needed but keeping for compatibility
    const matchedUser = ALL_MOCK_USERS.find(user => user.email === credentials.email);
    
    if (matchedUser) {
      const updatedUser = {
        ...matchedUser,
        lastLogin: new Date().toISOString(),
      };
      
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
  };

  const logout = (): void => {
    // Keep user logged in - just show a message
    toast.info('Logout disabled for demo mode.');
  };

  const register = async (userData: RegisterCredentials): Promise<void> => {
    // Not needed but keeping for compatibility
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
    
    setAuthState({
      user: newUser,
      isLoading: false,
      error: null,
    });
    
    toast.success('Registration successful!');
    navigate('/dashboard');
  };

  const updateUser = (userData: Partial<User>): void => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...userData };
    
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
      
      // No authentication required - always render the component
      if (authState.isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
      }
      
      return <Component {...props} />;
    };
  };

// Export mock users for backward compatibility
export { ENHANCED_MOCK_USERS as MOCK_USERS };
