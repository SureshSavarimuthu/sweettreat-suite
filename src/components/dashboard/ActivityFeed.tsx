import { motion } from 'framer-motion';
import { AlertTriangle, Store, ShoppingCart, AlertCircle } from 'lucide-react';
import { Activity } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'low_stock': return AlertTriangle;
      case 'franchise_request': return Store;
      case 'order': return ShoppingCart;
      case 'urgent': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'low_stock': return 'text-warning bg-warning/10';
      case 'franchise_request': return 'text-primary bg-primary/10';
      case 'order': return 'text-accent bg-accent/10';
      case 'urgent': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-2xl p-6 shadow-card h-full"
    >
      <h3 className="font-display text-lg font-semibold mb-4">Recent Activities</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type);
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className={cn('p-2 rounded-lg', getIconColor(activity.type))}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-primary mt-1">{activity.timestamp}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
