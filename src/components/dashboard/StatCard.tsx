import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
  variant?: 'primary' | 'accent' | 'warning' | 'info' | 'secondary' | 'default';
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  prefix = '', 
  suffix = '', 
  icon: Icon, 
  trend, 
  variant = 'default',
  delay = 0 
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const formatValue = (val: number) => {
    if (val >= 10000000) return (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return (val / 100000).toFixed(2) + ' L';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toLocaleString();
  };

  const gradients = {
    primary: 'bg-gradient-to-br from-primary via-primary to-orange-400',
    accent: 'bg-gradient-to-br from-accent via-emerald-500 to-teal-400',
    warning: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-400',
    info: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500',
    secondary: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
    default: 'bg-card border border-border'
  };

  const isGradient = variant !== 'default' && variant !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className={cn(
        'rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1',
        gradients[variant],
        isGradient ? 'text-white' : 'text-card-foreground'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            'text-sm font-medium mb-1',
            isGradient ? 'text-white/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className="font-display text-3xl font-bold">
            {prefix}{formatValue(displayValue)}{suffix}
          </p>
          {trend !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              isGradient 
                ? (trend >= 0 ? 'text-white/90' : 'text-red-200')
                : (trend >= 0 ? 'text-accent' : 'text-destructive')
            )}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl',
          isGradient ? 'bg-white/20' : 'bg-primary/10 text-primary'
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
