import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 4000 }, { month: 'Feb', sales: 3000 }, { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 }, { month: 'May', sales: 6000 }, { month: 'Jun', sales: 5500 },
];

const categoryData = [
  { name: 'Cakes', value: 35 }, { name: 'Tea & Coffee', value: 25 },
  { name: 'Bakery', value: 20 }, { name: 'Drinks', value: 15 }, { name: 'Others', value: 5 },
];

const COLORS = ['#da7727', '#3fb579', '#faeb35', '#5c352d', '#9ca3af'];

export default function Analytics() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: '₹12.5L', icon: DollarSign, color: 'text-primary' },
            { label: 'Total Orders', value: '3,248', icon: Package, color: 'text-accent' },
            { label: 'Active Franchises', value: '24', icon: Users, color: 'text-warning' },
            { label: 'Growth', value: '+15%', icon: TrendingUp, color: 'text-accent' },
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#da7727" fill="#da7727" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {categoryData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
