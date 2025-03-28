'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user';
import { useMessage } from './ChatMessageContext';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
};

type JwtPayload = {
  exp: number;
  [key: string]: unknown;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { clearMessages } = useMessage();

  useEffect(() => {
    const storedUser = localStorage.getItem('ast-user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        const decoded = jwtDecode<JwtPayload>(parsedUser.token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('ast-user');
        }
      } catch (error) {
        console.error('Invalid user data in localStorage', error);
        localStorage.removeItem('ast-user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newUser: User) => {
    // every new user tried to access it, we clear the chat messages
    if (user?.id !== newUser.id) {
      clearMessages();
    }
    localStorage.setItem('ast-user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const updateUser = (user: User) => {
    localStorage.setItem('ast-user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('ast-user');
    clearMessages();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
