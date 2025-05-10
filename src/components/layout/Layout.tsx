import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebarContext';
// import { AuthProvider } from '@/components/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar />
        <div className="flex flex-col flex-grow">
          <Navbar />
          <main className="flex-grow p-4 md:p-6 overflow-auto animate-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}