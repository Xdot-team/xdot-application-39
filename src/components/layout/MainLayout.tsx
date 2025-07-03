
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Chatbot } from '@/components/chatbot/Chatbot';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { authState } = useAuth();
  const location = useLocation();
  
  // Show loading state if auth is loading
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen min-w-0">
        <Header />
        <main className="flex-1 container max-w-none px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
          {children}
        </main>
        <footer className="py-2 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-center text-muted-foreground border-t">
          <p className="truncate">xDOTContractor &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </footer>
      </div>
      
      {/* Add Chatbot */}
      <Chatbot />
    </div>
  );
}
