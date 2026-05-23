// File: src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '../services/authService';
import { User } from '../types';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userData = await authService.getCurrentUser(fbUser.uid);
        setUser(userData);
        setDarkMode(userData?.darkMode || false);
      } else {
        setUser(null);
        setDarkMode(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const toggleDarkMode = async () => {
    if (!user) return;
    const newMode = !darkMode;
    setDarkMode(newMode);
    await authService.updateProfile(user.id, { darkMode: newMode } as any);
  };

  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    setDarkMode(userData?.darkMode || false);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const userData = await authService.register(email, password, displayName);
    setUser(userData);
    setDarkMode(false);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setFirebaseUser(null);
    setDarkMode(false);
  };

  const resetPassword = async (email: string) => { await authService.resetPassword(email); };
  
  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;
    await authService.updateProfile(user.id, userData);
    setUser({ ...user, ...userData });
  };
  
  const refreshUser = async () => {
    if (!firebaseUser) return;
    const userData = await authService.getCurrentUser(firebaseUser.uid);
    setUser(userData);
    setDarkMode(userData?.darkMode || false);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, darkMode, toggleDarkMode, login, register, logout, resetPassword, updateUserProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};