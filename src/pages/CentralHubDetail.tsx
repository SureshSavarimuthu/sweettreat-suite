import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, AlertTriangle, DollarSign, TrendingUp, Factory, Warehouse, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CentralHub,
  Product,
  mockCentralHubs,
  mockProducts,
  getStoredData,
  initializeMockData
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock production sales data
const generateSalesData = (hubId: string, period: string) => {
  const baseData = {
    day: Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      sales: Math.floor(Math.random() * 5000) + 1000,
      production: Math.floor(Math.random() * 4000) + 800
    })),
    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      name: day,
      sales: Math.floor(Math.random() * 30000) + 10000,
      production: Math.floor(Math.random() * 25000) + 8000
    })),
    month: Array.from({ length: 30 }, (_, i) => ({
      name: `${i + 1}`,
      sales: Math.floor(Math.random() * 40000) + 15000,
      production: Math.floor(Math.random() * 35000) + 12000
    })),
    year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
      name: month,
      sales: Math.floor(Math.random() * 500000) + 200000,
      production: Math.floor(Math.random() * 450000) + 180000
    }))
  };
  return baseData[period as keyof typeof baseData] || baseData.week;
};

export default function CentralHubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hub, setHub] = useState<CentralHub | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesPeriod, setSalesPeriod] = useState('week');
  const [productFilter, setProductFilter] = useState('all');
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    initializeMockData();
    const hubs = getStoredData<CentralHub[]>('bakery_central_hubs', mockCentralHubs);
    const allProducts = getStoredData<Product[]>('bakery_products', mockProducts);
    
    const foundHub = hubs.find(h => h.id === id);
    if (foundHub) {
      setHub(foundHub);
      // Filter products by location id OR location name matching hub name
      const hubProducts = allProducts.filter(p => 
        p.location.id === id || 
        p.location.name === foundHub.name ||
        p.location.name.toLowerCase().includes(foundHub.name.toLowerCase().split(' - ')[1] || '')
      );
      setProducts(hubProducts);
      setSalesData(generateSalesData(id || '', salesPeriod));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setSalesData(generateSalesData(id, salesPeriod));
    }
  }, [salesPeriod, id]);

  if (!hub) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Hub not found</p>
        </div>
      </MainLayout>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString()}`;
  };

  const filteredProducts = productFilter === 'all' 
    ? products 
    : productFilter === 'low-stock'
    ? products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold)
    : productFilter === 'out-of-stock'
    ? products.filter(p => p.stock === 0)
    : products.filter(p => p.stock > p.lowStockThreshold);

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.stock > p.lowStockThreshold).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    revenue: hub.dailyRevenue,
    weeklyRevenue: hub.dailyRevenue * 7,
    monthlyRevenue: hub.dailyRevenue * 30
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/central-hub')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                hub.type === 'kitchen' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
              )}>
                {hub.type === 'kitchen' ? <Factory className="w-6 h-6" /> : <Warehouse className="w-6 h-6" />}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{hub.name}</h1>
                <p className="text-muted-foreground">{hub.code} • {hub.city}</p>
              </div>
            </div>
          </div>
          <Badge className={cn(
            hub.status === 'operational' ? 'bg-accent' :
            hub.status === 'maintenance' ? 'bg-warning text-foreground' :
            'bg-destructive'
          )}>
            {hub.status}
          </Badge>
        </div>

        {/* Stats Cards with Range Filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Package className="w-4 h-4" />
              <span className="text-sm">Total Products</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
          </div>
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Package className="w-4 h-4" />
              <span className="text-sm">In Stock</span>
            </div>
            <p className="text-2xl font-bold text-accent">{stats.inStock}</p>
          </div>
          <div className="bg-gradient-to-br from-warning/20 to-warning/5 rounded-xl p-4 border border-warning/20">
            <div className="flex items-center gap-2 text-warning mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Low Stock</span>
            </div>
            <p className="text-2xl font-bold text-warning">{stats.lowStock}</p>
          </div>
          <div className="bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-xl p-4 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Out of Stock</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{stats.outOfStock}</p>
          </div>
          <div className="bg-gradient-to-br from-info/20 to-info/5 rounded-xl p-4 border border-info/20">
            <div className="flex items-center gap-2 text-info mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Daily Revenue</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.revenue)}</p>
          </div>
          <div className="bg-gradient-to-br from-secondary to-secondary/50 rounded-xl p-4 border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Monthly Est.</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.monthlyRevenue)}</p>
          </div>
        </div>

        {/* Production Sales Chart */}
        {hub.type === 'kitchen' && (
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="font-semibold text-lg">Production & Sales Trend</h3>
              <div className="flex gap-2">
                <Select value={salesPeriod} onValueChange={setSalesPeriod}>
                  <SelectTrigger className="w-32">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    name="Sales"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="production" 
                    stroke="hsl(var(--accent))" 
                    fillOpacity={1} 
                    fill="url(#colorProduction)" 
                    name="Production"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Products at Hub */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="font-semibold text-lg">Products at this Hub ({products.length})</h3>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/products/${product.slug}`)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-2 relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Out</span>
                      </div>
                    )}
                    {product.stock > 0 && product.stock <= product.lowStockThreshold && (
                      <div className="absolute top-1 right-1">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate">{product.name}</p>
                  <p className={cn(
                    'text-xs',
                    product.stock === 0 ? 'text-destructive' :
                    product.stock <= product.lowStockThreshold ? 'text-warning' :
                    'text-muted-foreground'
                  )}>
                    {product.stock} {product.unit}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Hub Details */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="font-semibold text-lg mb-4">Hub Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Manager</p>
              <p className="font-medium">{hub.managerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{hub.managerPhone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{hub.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">City</p>
              <p className="font-medium">{hub.city}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
