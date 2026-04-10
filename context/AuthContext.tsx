'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authUtils, AuthData } from '@/lib/auth';

interface AuthContextType {
  authData: AuthData | null;
  isAuthenticated: boolean;
  setAuthData: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthDataState] = useState<AuthData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = authUtils.getAuthData();
    setAuthDataState(data);
    setIsLoaded(true);
  }, []);

  const setAuthData = (data: AuthData) => {
    authUtils.saveAuthData(data);
    setAuthDataState(data);
  };

  const logout = () => {
    authUtils.clearAuthData();
    setAuthDataState(null);
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ authData, isAuthenticated: !!authData, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
