import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, AlertTriangle, Store, ShoppingCart, Settings } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Notification, mockNotifications, getStoredData, setStoredData, initializeMockData } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    initializeMockData();
    setNotifications(getStoredData('bakery_notifications', mockNotifications));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    setStoredData('bakery_notifications', updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setStoredData('bakery_notifications', updated);
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    setStoredData('bakery_notifications', updated);
    toast.success('Notification deleted');
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock': case 'out_of_stock': return AlertTriangle;
      case 'franchise_request': return Store;
      case 'order': return ShoppingCart;
      default: return Settings;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive';
      case 'high': return 'bg-warning text-foreground';
      case 'medium': return 'bg-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllRead}>
              <Check className="w-4 h-4 mr-2" />Mark All Read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((notif, idx) => {
            const Icon = getIcon(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  'bg-card rounded-xl p-4 shadow-card flex items-start gap-4',
                  !notif.read && 'border-l-4 border-primary'
                )}
              >
                <div className={cn('p-2 rounded-lg', getPriorityColor(notif.priority))}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{notif.title}</h3>
                    <Badge className={getPriorityColor(notif.priority)}>{notif.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  <p className="text-xs text-primary mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {!notif.read && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkRead(notif.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(notif.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
