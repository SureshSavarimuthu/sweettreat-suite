import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebar } from '@/contexts/SidebarContext';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.div 
        className="transition-all duration-300 min-h-screen flex flex-col"
        animate={{ 
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 
            ? (isCollapsed ? 80 : 260) 
            : 0 
        }}
        initial={false}
        style={{ marginLeft: isCollapsed ? 80 : 260 }}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
