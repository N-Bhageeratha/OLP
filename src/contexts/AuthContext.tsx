/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string, role: 'student' | 'instructor') => boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    storage.initializeSampleData();
  }, []);

  const login = (email: string, password: string): boolean => {
    // password parameter currently not used (demo/local auth). Mark as used to satisfy linters.
    void password;
    const normalized = email.trim().toLowerCase();
    const user = storage.getUserByEmail(normalized);

    if (user) {
      storage.setCurrentUser(user);
      setUser(user);
      return true;
    }

    return false;
  };

  const register = (email: string, password: string, name: string, role: 'student' | 'instructor'): boolean => {
    // password parameter currently not stored/used in demo. Mark as used to satisfy linters.
    void password;
    const normalized = email.trim().toLowerCase();
    const existingUser = storage.getUserByEmail(normalized);

    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: normalized,
      name,
      role,
      enrolledCourses: [],
      createdAt: new Date().toISOString(),
    };

    storage.saveUser(newUser);
    storage.setCurrentUser(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setUser(null);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      storage.updateUser(user.id, updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
