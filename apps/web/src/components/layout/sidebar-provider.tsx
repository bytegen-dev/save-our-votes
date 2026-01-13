'use client';

import { createContext, useContext, useState, useLayoutEffect } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_COOKIE_NAME = 'sidebar-collapsed';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [collapsed, setCollapsedState] = useState(defaultCollapsed);

  useLayoutEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('data-sidebar-collapsed', String(collapsed));
    }
  }, [collapsed]);

  const setCollapsed = (value: boolean) => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('data-sidebar-collapsed', String(value));
    }
    setCollapsedState(value);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
