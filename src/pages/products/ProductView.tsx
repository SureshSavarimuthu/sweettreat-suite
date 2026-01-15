import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Edit, MapPin, Calendar, Scale, Tag } from 'lucide-react';
import {
  Product,
  mockProducts,
  getStoredData,
  initializeMockData
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function ProductView() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    initializeMockData();
    const products = getStoredData<Product[]>('bakery_products', mockProducts);
    const found = products.find(p => p.slug === slug);
    setProduct(found || null);
  }, [slug]);

  if (!product) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold">Product not found</h2>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </MainLayout>
    );
  }

  const stockStatus = product.stock === 0 ? 'out' : product.stock <= product.lowStockThreshold ? 'low' : 'in';

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/products')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">{product.category}</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/products/${product.slug}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl overflow-hidden shadow-card">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={cn(
                    product.status === 'active' ? 'bg-accent' : 'bg-muted text-muted-foreground'
                  )}>
                    {product.status}
                  </Badge>
                  <Badge className={cn(
                    stockStatus === 'in' ? 'bg-accent' :
                    stockStatus === 'low' ? 'bg-warning text-foreground' :
                    'bg-destructive'
                  )}>
                    {stockStatus === 'in' ? 'In Stock' : stockStatus === 'low' ? 'Low Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                {product.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.dietary.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-semibold text-lg mb-4">Pricing Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary">₹{product.price}</p>
                  <p className="text-xs text-muted-foreground">Base Price</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{product.gst}%</p>
                  <p className="text-xs text-muted-foreground">GST</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-accent">₹{(product.price * (1 + product.gst / 100)).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Final Price</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{product.weight}</p>
                  <p className="text-xs text-muted-foreground">{product.unit}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-semibold text-lg mb-4">Stock Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    stockStatus === 'in' ? 'bg-accent/20 text-accent' :
                    stockStatus === 'low' ? 'bg-warning/20 text-foreground' :
                    'bg-destructive/20 text-destructive'
                  )}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{product.stock}</p>
                    <p className="text-xs text-muted-foreground">Current Stock</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/20 text-primary">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{product.lowStockThreshold}</p>
                    <p className="text-xs text-muted-foreground">Low Stock Threshold</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-semibold text-lg mb-4">Additional Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{product.location.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{product.createdAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
