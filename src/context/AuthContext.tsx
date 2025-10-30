import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginForm } from '@/types';
import { authService } from '../services';
import { reToast } from '../utils';
import { logger } from '../utils/logger';
import { migrateUserData, needsUserDataRefresh, refreshUserData } from '../utils/userMigration';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for stored auth data on app load
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedToken) {
        // Migrate user data if needed
        const migratedUser = migrateUserData();
        
        if (migratedUser) {
          setToken(storedToken);
          setUser(migratedUser as unknown as User);
          
          // If user data still needs refresh, fetch from backend
          if (needsUserDataRefresh()) {
            logger.info('User data needs refresh, fetching from backend...');
            const freshUser = await refreshUserData(storedToken);
            if (freshUser) {
              setUser(freshUser as unknown as User);
            }
          }
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();

    // Handle browser back button - only check when page is loaded from cache
    const handlePageShow = (event: PageTransitionEvent) => {
      // Only check if page was loaded from bfcache (back/forward button)
      if (event.persisted) {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        
        // Only redirect if on a protected route and not authenticated
        if ((!storedToken || !storedUser) && window.location.pathname.includes('dashboard')) {
          window.location.href = '/login';
        }
      }
    };

    // Listen for pageshow event (fired when navigating back)
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const login = async (credentials: LoginForm): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      
  setToken(response.access);
  setUser(response.user);

  localStorage.setItem('auth_token', response.access);
  localStorage.setItem('refresh_token', response.refresh);
  localStorage.setItem('auth_user', JSON.stringify(response.user));
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    setIsLoading(true);
    try {
      // Register the user
      await authService.register(userData);
      
      // Auto-login after successful registration
      const loginCredentials = {
        email: userData.email,
        password: userData.password
      };
      
      const response = await authService.login(loginCredentials);
      
      setToken(response.access);
      setUser(response.user);
      
      localStorage.setItem('auth_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: Partial<User>): void => {
    const newUser = { ...user, ...updatedUser } as User;
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    
    // Clear session storage as well
    sessionStorage.clear();
    
    // Show success toast
    reToast.auth.logoutSuccess();
    
    // Clear browser history state to prevent back button access
    if (window.history.state) {
      window.history.replaceState(null, '', '/login');
    }
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
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