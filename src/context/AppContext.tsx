'use client';

import React, { createContext, useContext, useState } from 'react';

interface AppContextProps {
  messages: Messages;
  setMessages: React.Dispatch<React.SetStateAction<Messages>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  conversations: string[];
  setConversations: React.Dispatch<React.SetStateAction<string[]>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface Messages {
  [conversation: string]: { type: 'user' | 'ai'; text: string }[];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>({ 'General Chat': [] });
  const [conversations, setConversations] = useState<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        messages,
        setMessages,
        loading,
        setLoading,
        conversations,
        setConversations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};