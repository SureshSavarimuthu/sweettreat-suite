import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Shop } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ShopSliderProps {
  shops: Shop[];
  title: string;
}

export function ShopSlider({ shops, title }: ShopSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    const newScroll = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount 
      : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1) 
      : Math.min(shops.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {shops.map((shop, index) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex-shrink-0 w-72 bg-secondary/50 rounded-xl p-5 hover:bg-secondary transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {shop.name}
                </h4>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{shop.location}</span>
                </div>
              </div>
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                shop.trend >= 0 
                  ? 'bg-accent/10 text-accent' 
                  : 'bg-destructive/10 text-destructive'
              )}>
                {shop.trend >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(shop.trend)}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-display font-bold text-foreground">
                {formatCurrency(shop.sales)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Monthly Revenue</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {shops.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: index * 320, behavior: 'smooth' });
              }
            }}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
            )}
          />
        ))}
      </div>
    </motion.div>
  );
}
