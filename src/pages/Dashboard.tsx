import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Package, Store } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ShopSlider } from '@/components/dashboard/ShopSlider';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { BestSellers } from '@/components/dashboard/BestSellers';
import {
  mockDashboardStats,
  mockShops,
  mockActivities,
  mockProducts,
  initializeMockData,
  getStoredData,
  DashboardStats,
  Shop,
  Activity,
  Product
} from '@/lib/mockData';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [activities] = useState<Activity[]>(mockActivities);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    initializeMockData();
    setStats(getStoredData('bakery_stats', mockDashboardStats));
    setShops(getStoredData('bakery_shops', mockShops));
    setProducts(getStoredData('bakery_products', mockProducts));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            icon={DollarSign}
            trend={8}
            variant="accent"
            delay={100}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend={15}
            variant="default"
            delay={200}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            variant="default"
            delay={300}
          />
        </div>

        {/* Top Performing Shops */}
        <ShopSlider shops={shops} title="Top Performing Shops" />

        {/* Activities & Best Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
          <div className="lg:col-span-2">
            <BestSellers products={products} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
