
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OutlookPluginContextType {
  isConnected: boolean;
  activeProject: string | null;
  setActiveProject: (projectId: string | null) => void;
}

const OutlookPluginContext = createContext<OutlookPluginContextType | undefined>(undefined);

export function OutlookPluginProvider({ children }: { children: ReactNode }) {
  const [isConnected] = useState(true);
  const [activeProject, setActiveProject] = useState<string | null>('project-1');

  return (
    <OutlookPluginContext.Provider value={{
      isConnected,
      activeProject,
      setActiveProject
    }}>
      {children}
    </OutlookPluginContext.Provider>
  );
}

export function useOutlookPlugin() {
  const context = useContext(OutlookPluginContext);
  if (!context) {
    throw new Error('useOutlookPlugin must be used within OutlookPluginProvider');
  }
  return context;
}
