import { memo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Store,
  Factory,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Rocket,
  Receipt,
  ShoppingCart,
  Bell,
  User,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Products', icon: Package, path: '/products' },
  { label: 'Franchises', icon: Store, path: '/franchises' },
  { label: 'Central Hub', icon: Factory, path: '/central-hub' },
  { label: 'Employees', icon: Users, path: '/employees' },
  { label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { label: 'Invoices', icon: Receipt, path: '/invoices' },
  { label: 'Reports', icon: FileText, path: '/reports' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Attendance', icon: Calendar, path: '/attendance' },
  { label: 'Product Launch', icon: Rocket, path: '/new-product-launch' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Careers', icon: Briefcase, path: '/careers' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

// Memoized NavItem component to prevent re-renders
const NavItemButton = memo(({ 
  item, 
  isActive, 
  isCollapsed, 
  onClick 
}: { 
  item: NavItem; 
  isActive: boolean; 
  isCollapsed: boolean;
  onClick: () => void;
}) => {
  const navButton = (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative w-full text-left',
        isActive
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 w-1 h-6 rounded-r-full bg-primary-foreground"
          transition={{ duration: 0.2 }}
        />
      )}
      <item.icon className={cn(
        'w-5 h-5 flex-shrink-0 transition-transform',
        isActive && 'scale-110'
      )} />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="font-medium text-sm whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {navButton}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <item.icon className="w-4 h-4" />
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return navButton;
});

NavItemButton.displayName = 'NavItemButton';

// Memoized SidebarContent component
const SidebarContent = memo(({ 
  isCollapsed, 
  onNavClick, 
  onToggleCollapse,
  onCloseMobile,
  currentPath
}: { 
  isCollapsed: boolean;
  onNavClick: (path: string) => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  currentPath: string;
}) => {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Coffee className="w-6 h-6 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-display font-bold text-lg whitespace-nowrap">Thatha Tea</h1>
              <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">Admin Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || 
            (item.path !== '/' && currentPath.startsWith(item.path));
          
          return (
            <NavItemButton
              key={item.path}
              item={item}
              isActive={isActive}
              isCollapsed={isCollapsed}
              onClick={() => onNavClick(item.path)}
            />
          );
        })}
      </nav>

      {/* Collapse Button - Desktop only */}
      <button
        onClick={onToggleCollapse}
        className="hidden md:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-sidebar-foreground/40 text-center"
            >
              © 2024 Thatha Tea
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

SidebarContent.displayName = 'SidebarContent';

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = useCallback((path: string) => {
    navigate(path);
    closeMobile();
  }, [navigate, closeMobile]);

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground z-50 hidden md:flex flex-col shadow-xl"
      >
        <SidebarContent 
          isCollapsed={isCollapsed}
          onNavClick={handleNavClick}
          onToggleCollapse={toggleCollapse}
          onCloseMobile={closeMobile}
          currentPath={location.pathname}
        />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen w-[280px] bg-sidebar text-sidebar-foreground z-50 md:hidden flex flex-col shadow-xl"
          >
            <SidebarContent 
              isCollapsed={false}
              onNavClick={handleNavClick}
              onToggleCollapse={toggleCollapse}
              onCloseMobile={closeMobile}
              currentPath={location.pathname}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
