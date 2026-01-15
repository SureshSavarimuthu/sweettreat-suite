import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Order, Franchise, mockOrders, mockFranchises, getStoredData, initializeMockData } from '@/lib/mockData';
import { exportToExcel } from '@/utils/excelExport';

export default function SalesReports() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    initializeMockData();
    setOrders(getStoredData('bakery_orders', mockOrders));
    setFranchises(getStoredData('bakery_franchises', mockFranchises));
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
  const pendingPayments = orders.filter(o => o.paymentStatus !== 'paid').reduce((sum, o) => sum + o.totalAmount, 0);

  const salesByFranchise = franchises.map(f => ({
    name: f.name.split(' ')[0],
    sales: orders.filter(o => o.franchiseId === f.id).reduce((sum, o) => sum + o.totalAmount, 0)
  }));

  const monthlyData = [
    { month: 'Jan', sales: 450000 },
    { month: 'Feb', sales: 380000 },
    { month: 'Mar', sales: 520000 },
    { month: 'Apr', sales: 490000 },
    { month: 'May', sales: 610000 },
    { month: 'Jun', sales: 550000 },
  ];

  const handleExport = () => {
    const exportData = orders.map(o => ({
      'Order #': o.orderNumber,
      'Franchise': o.franchiseName,
      'Amount': o.totalAmount,
      'Status': o.status,
      'Payment': o.paymentStatus,
      'Date': o.createdAt
    }));
    exportToExcel(exportData, `Sales_Report_${new Date().toISOString().split('T')[0]}`);
    toast.success('Sales report exported');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/reports')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold">Sales Reports</h1>
              <p className="text-muted-foreground">Revenue, transactions, and trends</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary to-orange-400 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Sales</p>
                <p className="text-2xl font-bold">₹{totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent to-teal-400 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Paid Orders</p>
                <p className="text-2xl font-bold">{paidOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Pending Payments</p>
                <p className="text-2xl font-bold">₹{pendingPayments.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h3 className="font-semibold mb-4">Sales Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(28, 73%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(28, 73%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="hsl(28, 73%, 50%)" fill="url(#salesGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-card">
            <h3 className="font-semibold mb-4">Sales by Franchise</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByFranchise}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(152, 55%, 48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
