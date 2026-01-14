import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

interface ProductSliderProps {
  products: Product[];
  title: string;
  type: 'top' | 'low';
}

export function ProductSlider({ products, title, type }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (type === 'top') {
      return b.stock - a.stock; // Higher stock = better selling
    }
    return a.stock - b.stock; // Lower stock = slower selling
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sortedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/products/${product.slug}`)}
            className={`flex-shrink-0 w-[140px] md:w-[160px] rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-elevated ${
              type === 'low' && product.stock === 0 ? 'opacity-60' : ''
            }`}
          >
            <div className="relative h-24 md:h-28 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Out of Stock</span>
                </div>
              )}
              {type === 'top' && product.stock > 50 && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-medium rounded-full">
                  Bestseller
                </div>
              )}
              {type === 'low' && product.stock > 0 && product.stock <= product.lowStockThreshold && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-warning text-foreground text-[10px] font-medium rounded-full">
                  Low Stock
                </div>
              )}
            </div>
            <div className="p-3 bg-background">
              <h4 className="font-medium text-sm truncate">{product.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-primary font-semibold text-sm">₹{product.price}</span>
                <span className="text-xs text-muted-foreground">{product.stock} left</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
