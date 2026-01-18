import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingCart, Package, Store, TrendingUp, TrendingDown, Users, AlertTriangle, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ShopSlider } from '@/components/dashboard/ShopSlider';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ProductSlider } from '@/components/dashboard/ProductSlider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  mockDashboardStats,
  mockShops,
  mockActivities,
  mockProducts,
  mockOrders,
  mockFranchises,
  mockEmployees,
  initializeMockData,
  getStoredData,
  DashboardStats,
  Shop,
  Activity,
  Product,
  Order,
  Franchise,
  Employee
} from '@/lib/mockData';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
  { name: 'Aug', sales: 6500 },
  { name: 'Sep', sales: 8000 },
  { name: 'Oct', sales: 7500 },
  { name: 'Nov', sales: 9000 },
  { name: 'Dec', sales: 8500 },
];

const categoryData = [
  { name: 'Cakes', value: 35, color: 'hsl(28, 73%, 50%)' },
  { name: 'Tea & Coffee', value: 25, color: 'hsl(152, 55%, 48%)' },
  { name: 'Bakery', value: 20, color: 'hsl(54, 95%, 60%)' },
  { name: 'Drinks', value: 12, color: 'hsl(210, 80%, 55%)' },
  { name: 'Others', value: 8, color: 'hsl(20, 25%, 18%)' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [activities] = useState<Activity[]>(mockActivities);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [franchises, setFranchises] = useState<Franchise[]>(mockFranchises);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  useEffect(() => {
    initializeMockData();
    setStats(getStoredData('bakery_stats', mockDashboardStats));
    setShops(getStoredData('bakery_shops', mockShops));
    setProducts(getStoredData('bakery_products', mockProducts));
    setOrders(getStoredData('bakery_orders', mockOrders));
    setFranchises(getStoredData('bakery_franchises', mockFranchises));
    setEmployees(getStoredData('bakery_employees', mockEmployees));
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const activeFranchises = franchises.filter(f => f.status === 'active').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/reports')}>
              View Reports
            </Button>
            <Button size="sm" onClick={() => navigate('/orders')}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Orders ({pendingOrders})
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales"
            value={stats.totalSales}
            prefix="₹"
            icon={DollarSign}
            trend={12}
            variant="primary"
            delay={0}
          />
          <StatCard
            title="Monthly Sales"
            value={stats.monthlySales}
            prefix="₹"
            icon={TrendingUp}
            trend={8}
            variant="accent"
            delay={100}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend={15}
            variant="info"
            delay={200}
          />
          <StatCard
            title="Total Products"
            value={products.length}
            icon={Package}
            variant="secondary"
            delay={300}
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl p-4 shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
            onClick={() => navigate('/franchises')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeFranchises}</p>
                <p className="text-xs text-muted-foreground">Active Franchises</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl p-4 shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
            onClick={() => navigate('/employees')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeEmployees}</p>
                <p className="text-xs text-muted-foreground">Active Employees</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl p-4 shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
            onClick={() => navigate('/products')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20 text-foreground">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lowStockProducts}</p>
                <p className="text-xs text-muted-foreground">Low Stock Items</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card rounded-xl p-4 shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
            onClick={() => navigate('/orders')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10 text-info">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingOrders}</p>
                <p className="text-xs text-muted-foreground">Pending Orders</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Performing Shops */}
        <ShopSlider shops={shops} title="Top Performing Shops" />

        {/* Top Selling & Low Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductSlider products={products} title="Top Selling Products" type="top" />
          <ProductSlider products={products} title="Low Selling Products" type="low" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-card rounded-xl p-5 shadow-card"
          >
            <h3 className="font-display font-semibold mb-4">Sales Trend</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(28, 73%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(28, 73%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
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
                    dataKey="sales" 
                    stroke="hsl(28, 73%, 50%)" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl p-5 shadow-card"
          >
            <h3 className="font-display font-semibold mb-4">Sales by Category</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activities & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 bg-card rounded-xl p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Recent Orders</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => navigate('/orders')}
                >
                  <div>
                    <p className="font-medium text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.franchiseName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{order.totalAmount.toLocaleString()}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      order.status === 'completed' ? 'bg-accent/20 text-accent' :
                      order.status === 'processing' ? 'bg-info/20 text-info' :
                      order.status === 'pending' ? 'bg-warning/20 text-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
