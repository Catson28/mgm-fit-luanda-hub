"use client"
// sidebarContext.tsx
import React, { createContext, useContext, useState } from 'react';

type SidebarContextType = {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvidery = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvidery');
  }
  return context;
};