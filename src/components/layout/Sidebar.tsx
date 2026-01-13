import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  { label: 'Reports', icon: FileText, path: '/reports' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Attendance', icon: Calendar, path: '/attendance' },
  { label: 'Product Launch', icon: Rocket, path: '/new-product-launch' },
  { label: 'Invoices', icon: Receipt, path: '/invoices' },
  { label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Careers', icon: Briefcase, path: '/careers' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground z-50 flex flex-col shadow-xl"
    >
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
              <h1 className="font-display font-bold text-lg whitespace-nowrap">Tea & Bakery</h1>
              <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">Admin Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
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
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
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
              © 2024 Tea & Bakery
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
