
import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Chatbot } from '@/components/chatbot/Chatbot';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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
      
      <Chatbot />
    </div>
  );
}
