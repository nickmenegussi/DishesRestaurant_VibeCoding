
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../backend/index';
import type { User } from '@supabase/supabase-js';

// Extend Supabase user with our app's extra fields if needed, or just use it directly
// For simplicity in this step, we keep the interface simple or map it.

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    authService.getSession().then(session => {
        setUser(session?.user ?? null);
        setIsLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = authService.onAuthStateChange((_event: any, session: any) => {
        setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // We update the signature to accept password
    const data = await authService.login(email, password);
    if (!data.user) throw new Error('Login failed');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
