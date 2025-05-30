
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
  
  // Don't render layout for login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Show loading state if auth is loading
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  // Redirect to login happens in the useEffect in requireAuth HOC
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header />
        <main className="flex-1 container py-6">
          {children}
        </main>
        <footer className="py-4 px-6 text-sm text-center text-muted-foreground border-t">
          <p>xDOTContractor &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </footer>
      </div>
      
      {/* Add Chatbot */}
      <Chatbot />
    </div>
  );
}
