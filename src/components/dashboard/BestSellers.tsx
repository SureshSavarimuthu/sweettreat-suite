import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/mockData';

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    const newScroll = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount 
      : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Best Selling Products</h3>
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
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            className="flex-shrink-0 w-44 group cursor-pointer"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-3 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                  <span className="text-background text-xs font-medium px-2 py-1 bg-destructive rounded">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h4>
            <p className="text-primary font-semibold text-sm mt-1">₹{product.price}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{product.stock} in stock</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
