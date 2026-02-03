import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  ClipboardList,
  Truck,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { HubLayout } from '@/components/hub/HubLayout';
import { useHubAuth } from '@/contexts/HubAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Product,
  Order,
  Employee,
  mockProducts,
  mockOrders,
  mockEmployees,
  getStoredData,
  initializeMockData,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock production data for the week
const weeklyProductionData = [
  { day: 'Mon', production: 450, target: 500 },
  { day: 'Tue', production: 520, target: 500 },
  { day: 'Wed', production: 480, target: 500 },
  { day: 'Thu', production: 510, target: 500 },
  { day: 'Fri', production: 490, target: 500 },
  { day: 'Sat', production: 600, target: 550 },
  { day: 'Sun', production: 400, target: 400 },
];

export default function HubDashboard() {
  const { hub, hubUser } = useHubAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<Employee[]>([]);

  useEffect(() => {
    initializeMockData();
    
    const allProducts = getStoredData<Product[]>('bakery_products', mockProducts);
    const allOrders = getStoredData<Order[]>('bakery_orders', mockOrders);
    const allEmployees = getStoredData<Employee[]>('bakery_employees', mockEmployees);

    // Filter products for this hub
    const hubProducts = allProducts.filter(p => p.location.id === hub?.id);
    setProducts(hubProducts);

    // Filter orders (in real app, would filter by hub)
    setOrders(allOrders.slice(0, 5));

    // Filter staff for this hub location
    const hubStaff = allEmployees.filter(e => 
      e.location.toLowerCase().includes(hub?.name.split(' - ')[1]?.toLowerCase() || '')
    );
    setStaff(hubStaff.length > 0 ? hubStaff : allEmployees.slice(0, 5));
  }, [hub]);

  if (!hub) return null;

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.stock > p.lowStockThreshold).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
    readyToDispatch: orders.filter(o => o.status === 'ready').length,
    presentStaff: staff.length,
    totalStaff: staff.length,
  };

  const stockPercentage = stats.totalProducts > 0 
    ? Math.round((stats.inStock / stats.totalProducts) * 100) 
    : 0;

  return (
    <HubLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {hubUser?.name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening at {hub.name} today.
            </p>
          </div>
          <Badge className={cn(
            'text-sm px-3 py-1',
            hub.status === 'operational' ? 'bg-accent' :
            hub.status === 'maintenance' ? 'bg-warning text-foreground' :
            'bg-destructive'
          )}>
            {hub.status}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    <p className="text-xs text-accent flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {stats.inStock} in stock
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Alerts</p>
                    <p className="text-2xl font-bold text-warning">{stats.lowStock}</p>
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <ArrowDownRight className="w-3 h-3" />
                      {stats.outOfStock} out of stock
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-warning/10">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                    <p className="text-xs text-info flex items-center gap-1 mt-1">
                      <Truck className="w-3 h-3" />
                      {stats.readyToDispatch} ready
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-info/10">
                    <ClipboardList className="w-6 h-6 text-info" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Staff Present</p>
                    <p className="text-2xl font-bold">{stats.presentStaff}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      of {stats.totalStaff} total
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-accent/10">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts and Lists */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Production Chart (Kitchen only) */}
          {hub.type === 'kitchen' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Production
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyProductionData}>
                      <defs>
                        <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="production" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorProd)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="target" 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeDasharray="5 5"
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stock Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Stock Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Stock Level</span>
                  <span className="text-sm font-medium">{stockPercentage}%</span>
                </div>
                <Progress value={stockPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-accent/10">
                  <p className="text-2xl font-bold text-accent">{stats.inStock}</p>
                  <p className="text-xs text-muted-foreground">In Stock</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-warning/10">
                  <p className="text-2xl font-bold text-warning">{stats.lowStock}</p>
                  <p className="text-xs text-muted-foreground">Low Stock</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-destructive/10">
                  <p className="text-2xl font-bold text-destructive">{stats.outOfStock}</p>
                  <p className="text-xs text-muted-foreground">Out</p>
                </div>
              </div>

              {stats.lowStock > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Low Stock Items</p>
                  {products
                    .filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold)
                    .slice(0, 3)
                    .map(product => (
                      <div key={product.id} className="flex items-center justify-between p-2 rounded-lg bg-warning/5 border border-warning/20">
                        <div className="flex items-center gap-2">
                          <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                        <Badge variant="outline" className="text-warning border-warning">
                          {product.stock} left
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className={hub.type === 'warehouse' ? 'lg:col-span-2' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.slice(0, 4).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.franchiseName}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={cn(
                        order.status === 'pending' ? 'bg-warning/20 text-warning' :
                        order.status === 'processing' ? 'bg-info/20 text-info' :
                        order.status === 'ready' ? 'bg-accent/20 text-accent' :
                        'bg-muted'
                      )}>
                        {order.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HubLayout>
  );
}
