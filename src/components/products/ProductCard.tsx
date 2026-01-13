import { motion } from 'framer-motion';
import { Edit, Eye, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductCard({ product, index, onEdit, onView, onDelete }: ProductCardProps) {
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group',
        isOutOfStock && 'opacity-70'
      )}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            'w-full h-full object-cover transition-transform duration-300',
            !isOutOfStock && 'group-hover:scale-105'
          )}
        />
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOutOfStock && (
            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge className="bg-warning text-foreground text-xs">Low Stock</Badge>
          )}
          {product.dietary.includes('eggless') && (
            <Badge className="bg-accent text-accent-foreground text-xs">Eggless</Badge>
          )}
          {product.dietary.includes('vegan') && (
            <Badge className="bg-accent text-accent-foreground text-xs">Vegan</Badge>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 rounded-full"
            onClick={() => onView?.(product)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 rounded-full"
            onClick={() => onEdit?.(product)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="w-8 h-8 rounded-full"
            onClick={() => onDelete?.(product)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
        
        <p className="text-lg font-display font-bold text-primary">
          ₹{product.price.toLocaleString()}
        </p>
        
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stock</span>
            <span className={cn(
              'font-medium',
              isOutOfStock ? 'text-destructive' : isLowStock ? 'text-warning' : 'text-foreground'
            )}>
              {product.stock} {product.unit}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Category</span>
            <Badge variant="secondary" className="text-xs">{product.category}</Badge>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{product.location.name}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
