import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Users, Store, Package, ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const reportTypes = [
  { id: 'employees', name: 'Employee Reports', icon: Users, desc: 'Staff details, salaries, attendance', color: 'from-blue-500 to-indigo-600' },
  { id: 'franchises', name: 'Franchise Reports', icon: Store, desc: 'Performance, sales, credit points', color: 'from-emerald-500 to-teal-600' },
  { id: 'products', name: 'Product Reports', icon: Package, desc: 'Inventory, sales, stock levels', color: 'from-amber-500 to-orange-600' },
  { id: 'orders', name: 'Order Reports', icon: ShoppingCart, desc: 'Order history, pending, completed', color: 'from-purple-500 to-pink-600' },
  { id: 'sales', name: 'Sales Reports', icon: DollarSign, desc: 'Revenue, transactions, trends', color: 'from-primary to-orange-400' },
];

export default function Reports() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export business reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-6 hover:shadow-elevated transition-all cursor-pointer group overflow-hidden relative"
                onClick={() => navigate(`/reports/${report.id}`)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${report.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-4`}>
                    <report.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{report.desc}</p>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                    View Reports
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
