'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type User = {
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      setUser(null);
    } finally {
        setLoading(false);
    }
  }, []);

  const login = useCallback((userToLogin: User | null) => {
    if (userToLogin) {
      localStorage.setItem('currentUser', JSON.stringify(userToLogin));
    } else {
      localStorage.removeItem('currentUser');
    }
    setUser(userToLogin);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loading }}>
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
