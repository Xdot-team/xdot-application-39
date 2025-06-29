
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, UserRole } from '@/types/auth';
import { ENHANCED_MOCK_USERS, INDIVIDUAL_PROFILES } from '@/data/mockAuthData';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { profileService } from '@/services/database';

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
  const { user: supabaseUser, session, loading: supabaseLoading, signIn, signUp, signOut } = useSupabaseAuth();

  // Check if we should use Supabase auth or mock auth
  const useSupabase = process.env.NODE_ENV === 'production' || localStorage.getItem('use-supabase-auth') === 'true';

  useEffect(() => {
    if (useSupabase) {
      // Use Supabase authentication
      if (!supabaseLoading) {
        if (supabaseUser) {
          // Fetch user profile from database
          profileService.getCurrent()
            .then((profile) => {
              const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role as UserRole,
                profilePicture: profile.profile_picture,
                phoneNumber: profile.phone_number,
                department: profile.department,
                position: profile.position,
                createdAt: profile.created_at,
                lastLogin: new Date().toISOString(),
                isVerified: profile.is_verified,
                twoFactorEnabled: profile.two_factor_enabled,
                companyId: profile.company_id,
              };
              
              setAuthState({
                user,
                isLoading: false,
                error: null,
              });
            })
            .catch((error) => {
              console.error('Failed to fetch user profile:', error);
              setAuthState({
                user: null,
                isLoading: false,
                error: 'Failed to fetch user profile',
              });
            });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      }
    } else {
      // Use mock authentication (existing logic)
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
    }
  }, [useSupabase, supabaseUser, supabaseLoading]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (useSupabase) {
        await signIn(credentials.email, credentials.password);
        // User state will be updated through the useEffect hook
      } else {
        // Mock authentication (existing logic)
        const matchedUser = ALL_MOCK_USERS.find(user => user.email === credentials.email);
        
        if (matchedUser && credentials.password === MOCK_PASSWORD) {
          const updatedUser = {
            ...matchedUser,
            lastLogin: new Date().toISOString(),
          };

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
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({
        user: null,
        isLoading: false,
        error: (error as Error).message || 'Login failed',
      });
      if (!useSupabase) {
        toast.error('Login failed. Please check your credentials.');
      }
    }
  };

  const logout = (): void => {
    if (useSupabase) {
      signOut();
    } else {
      localStorage.removeItem('xdot-user');
      toast.info('You have been logged out.');
    }
    
    setAuthState({
      user: null,
      isLoading: false,
      error: null,
    });
    navigate('/login');
  };

  const register = async (userData: RegisterCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (useSupabase) {
        await signUp(userData.email, userData.password, {
          name: userData.name,
          role: userData.role,
          phone_number: userData.phoneNumber,
        });
        // User state will be updated through the useEffect hook
      } else {
        // Mock registration (existing logic)
        const existingUser = ALL_MOCK_USERS.find(user => user.email === userData.email);
        if (existingUser) {
          throw new Error('Email already in use');
        }
        
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
        
        localStorage.setItem('xdot-user', JSON.stringify(newUser));
        
        setAuthState({
          user: newUser,
          isLoading: false,
          error: null,
        });
        
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message || 'Registration failed',
      }));
      if (!useSupabase) {
        toast.error((error as Error).message || 'Registration failed');
      }
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (!authState.user) return;
    
    if (useSupabase) {
      // Update profile in Supabase
      profileService.update({
        name: userData.name,
        phone_number: userData.phoneNumber,
        department: userData.department,
        position: userData.position,
      }).then(() => {
        const updatedUser = { ...authState.user, ...userData };
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
        toast.success('Profile updated successfully');
      }).catch((error) => {
        console.error('Failed to update profile:', error);
        toast.error('Failed to update profile');
      });
    } else {
      // Mock update (existing logic)
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('xdot-user', JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      toast.success('Profile updated successfully');
    }
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
