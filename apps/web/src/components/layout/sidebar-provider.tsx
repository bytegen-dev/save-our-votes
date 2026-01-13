'use client';

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_COOKIE_NAME = 'sidebar-collapsed';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Return false during SSR and initial render to avoid hydration mismatch
  return mounted ? isMobile : false;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsedState] = useState(defaultCollapsed);
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (!isMobile) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('data-sidebar-collapsed', String(collapsed));
      }
    } else {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('data-sidebar-collapsed', 'false');
      }
    }
  }, [collapsed, isMobile]);

  const setCollapsed = (value: boolean) => {
    if (!isMobile) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('data-sidebar-collapsed', String(value));
      }
    }
    setCollapsedState(value);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };

  const toggle = () => {
    if (isMobile) {
      setOpenMobile((open) => !open);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggle,
        isMobile,
        openMobile,
        setOpenMobile,
      }}
    >
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
