'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { Message } from '../models/messages';

type MessageContextType = {
  messageHistory: Message[];
  loading: boolean;
  setNewMessage: (message: Message) => void;
  clearMessages: () => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chat-messages');
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages);
        if (Array.isArray(parsed)) {
          setMessageHistory(parsed);
        } else {
          setMessageHistory([]);
        }
      } catch (error) {
        console.error('Invalid messages format in localStorage', error);
        setMessageHistory([]);
      }
    } else {
      setMessageHistory([]);
    }
    setLoading(false);
  }, []);

  const setNewMessage = (message: Message) => {
    setMessageHistory((prev) => {
      const updated = [...prev, message];
      localStorage.setItem('chat-messages', JSON.stringify(updated));
      return updated;
    });
  };

  const clearMessages = () => {
    setMessageHistory([]);
    localStorage.removeItem('chat-messages');
  };

  return (
    <MessageContext.Provider
      value={{ messageHistory, setNewMessage, clearMessages, loading }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
