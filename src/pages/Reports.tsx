import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Users, Store, Package, ShoppingCart, DollarSign, Download } from 'lucide-react';
import { toast } from 'sonner';

const reportTypes = [
  { id: 'employees', name: 'Employee Reports', icon: Users, desc: 'Staff details, salaries, attendance' },
  { id: 'franchises', name: 'Franchise Reports', icon: Store, desc: 'Performance, sales, credit points' },
  { id: 'products', name: 'Product Reports', icon: Package, desc: 'Inventory, sales, stock levels' },
  { id: 'orders', name: 'Order Reports', icon: ShoppingCart, desc: 'Order history, pending, completed' },
  { id: 'sales', name: 'Sales Reports', icon: DollarSign, desc: 'Revenue, transactions, trends' },
  { id: 'financial', name: 'Financial Reports', icon: FileText, desc: 'P&L, expenses, revenue' },
];

export default function Reports() {
  const handleGenerate = (type: string) => {
    toast.success(`Generating ${type} report...`);
    setTimeout(() => toast.success('Report downloaded successfully!'), 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and export business reports</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map(report => (
            <Card key={report.id} className="p-5 hover:shadow-elevated transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <report.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.desc}</p>
                  <Button size="sm" className="mt-3" onClick={() => handleGenerate(report.name)}>
                    <Download className="w-4 h-4 mr-2" />Generate
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
