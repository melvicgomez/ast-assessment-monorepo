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
  isLogout: boolean;
  loading: boolean;
  login: (user: User) => void;
  setIsLogout: (value: boolean) => void;
  logout: () => void;
};

type JwtPayload = {
  exp: number;
  [key: string]: unknown;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isLogout, setIsLogout] = useState(false);

  const { clearMessages } = useMessage();

  useEffect(() => {
    const storedUser = localStorage.getItem('ast-user');
    const storedUserId = localStorage.getItem('ast-user-id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
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
    if (userId !== newUser.id.toString()) {
      clearMessages();
    }
    localStorage.setItem('ast-user', JSON.stringify(newUser));
    localStorage.setItem('ast-user-id', `${newUser.id}`);
    setUser(newUser);
  };

  const logout = () => {
    setIsLogout(true);
    setUser(null);
    localStorage.removeItem('ast-user');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isLogout, setIsLogout }}
    >
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
