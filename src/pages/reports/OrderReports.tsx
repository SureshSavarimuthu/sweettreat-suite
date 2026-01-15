import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, ShoppingCart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Order, mockOrders, getStoredData, initializeMockData } from '@/lib/mockData';
import { exportToExcel } from '@/utils/excelExport';

export default function OrderReports() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    initializeMockData();
    setOrders(getStoredData('bakery_orders', mockOrders));
  }, []);

  const filteredOrders = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredOrders.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredOrders.map(o => o.id)));
  };

  const handleExport = (all: boolean) => {
    const toExport = all ? filteredOrders : filteredOrders.filter(o => selectedIds.has(o.id));
    if (toExport.length === 0) {
      toast.error('No orders selected for export');
      return;
    }

    const exportData = toExport.map(o => ({
      'Order #': o.orderNumber,
      'Franchise': o.franchiseName,
      'Items': o.items.length,
      'Total Amount': o.totalAmount,
      'Shortage Credit': o.shortageCredit,
      'Status': o.status,
      'Payment Status': o.paymentStatus,
      'Created At': o.createdAt
    }));

    exportToExcel(exportData, `Order_Report_${new Date().toISOString().split('T')[0]}`);
    toast.success(`Exported ${toExport.length} order records`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/reports')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">Order Reports</h1>
            <p className="text-muted-foreground">Generate and export order history</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => handleExport(false)} disabled={selectedIds.size === 0}>
            <Download className="w-4 h-4 mr-2" />Export Selected ({selectedIds.size})
          </Button>
          <Button variant="outline" onClick={() => handleExport(true)}>Export All</Button>
        </div>

        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="p-4 text-left"><Checkbox checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0} onCheckedChange={toggleAll} /></th>
                <th className="p-4 text-left font-medium">Order #</th>
                <th className="p-4 text-left font-medium">Franchise</th>
                <th className="p-4 text-center font-medium">Items</th>
                <th className="p-4 text-right font-medium">Amount</th>
                <th className="p-4 text-center font-medium">Status</th>
                <th className="p-4 text-center font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.id} className="border-t hover:bg-secondary/30">
                  <td className="p-4"><Checkbox checked={selectedIds.has(o.id)} onCheckedChange={() => toggleSelect(o.id)} /></td>
                  <td className="p-4 font-medium">{o.orderNumber}</td>
                  <td className="p-4">{o.franchiseName}</td>
                  <td className="p-4 text-center">{o.items.length}</td>
                  <td className="p-4 text-right text-primary font-medium">₹{o.totalAmount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <Badge className={
                      o.status === 'completed' ? 'bg-accent' :
                      o.status === 'pending' ? 'bg-warning text-foreground' :
                      o.status === 'processing' ? 'bg-info text-white' :
                      'bg-primary'
                    }>{o.status}</Badge>
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant="outline">{o.paymentStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
