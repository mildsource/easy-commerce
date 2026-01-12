import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { mockApi } from '@/lib/mockApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Check if we're in production (self-hosted) or Lovable preview
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   !window.location.hostname.includes('lovable'));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({ user, token: savedToken, isLoading: false });
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({ user: null, token: null, isLoading: false });
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try real API first (for production)
      if (isProduction) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setState({ user: data.user, token: data.token, isLoading: false });
          return true;
        }
        return false;
      }
      
      // Use mock API for Lovable preview
      const result = await mockApi.login(email, password);
      
      if (!result) {
        return false;
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setState({ user: result.user, token: result.token, isLoading: false });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, isLoading: false });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isAdmin: state.user?.isAdmin ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
