import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, AlertTriangle, Check, Truck, Clock, Eye, ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Order,
  mockOrders,
  getStoredData,
  setStoredData,
  initializeMockData
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    initializeMockData();
    setOrders(getStoredData('bakery_orders', mockOrders));
  }, []);

  const getFilteredOrders = (status?: string) => {
    let filtered = orders;
    if (status && status !== 'all') {
      filtered = orders.filter(o => o.status === status);
    }
    if (search) {
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.franchiseName.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    setOrders(updated);
    setStoredData('bakery_orders', updated);
    setSelectedOrder(null);
    toast.success(`Order status updated to ${newStatus}`);
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'ready': return <Check className="w-4 h-4" />;
      case 'dispatched': return <Truck className="w-4 h-4" />;
      case 'completed': return <Check className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning text-foreground';
      case 'processing': return 'bg-info text-white';
      case 'ready': return 'bg-accent';
      case 'dispatched': return 'bg-primary';
      case 'completed': return 'bg-accent';
    }
  };

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    dispatched: orders.filter(o => o.status === 'dispatched').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage orders from franchises ({orders.length} total)
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All ({orderCounts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({orderCounts.pending})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({orderCounts.processing})</TabsTrigger>
            <TabsTrigger value="ready">Ready ({orderCounts.ready})</TabsTrigger>
            <TabsTrigger value="dispatched">Dispatched ({orderCounts.dispatched})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({orderCounts.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {getFilteredOrders(activeTab).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-5 shadow-card hover:shadow-elevated transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{order.orderNumber}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                        <div>
                          <p className="text-muted-foreground">Franchise</p>
                          <p className="font-medium">{order.franchiseName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Items</p>
                          <p className="font-medium">{order.items.length} products</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-medium text-primary">{formatCurrency(order.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ordered</p>
                          <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {order.shortageCredit > 0 && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-warning">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Shortage credit: +{order.shortageCredit} pts</span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}

              {getFilteredOrders(activeTab).length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    {selectedOrder.orderNumber}
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Franchise</p>
                      <p className="font-medium">{selectedOrder.franchiseName}</p>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium text-primary">{formatCurrency(selectedOrder.totalAmount)}</p>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <p className="font-medium">{selectedOrder.paymentStatus}</p>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Shortage Credit</p>
                      <p className="font-medium text-accent">+{selectedOrder.shortageCredit} pts</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-secondary">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium">Product</th>
                            <th className="text-center p-3 text-sm font-medium">Qty Ordered</th>
                            <th className="text-center p-3 text-sm font-medium">Qty Available</th>
                            <th className="text-right p-3 text-sm font-medium">Price</th>
                            <th className="text-center p-3 text-sm font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, idx) => {
                            const isShortage = item.available < item.quantity;
                            const isOutOfStock = item.available === 0;
                            return (
                              <tr key={idx} className="border-t">
                                <td className="p-3">{item.productName}</td>
                                <td className="p-3 text-center">{item.quantity}</td>
                                <td className="p-3 text-center">
                                  <span className={cn(
                                    isOutOfStock ? 'text-destructive' :
                                    isShortage ? 'text-warning' :
                                    'text-foreground'
                                  )}>
                                    {item.available}
                                  </span>
                                </td>
                                <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                                <td className="p-3 text-center">
                                  {isOutOfStock ? (
                                    <Badge variant="destructive">Out of Stock</Badge>
                                  ) : isShortage ? (
                                    <Badge className="bg-warning text-foreground">Shortage</Badge>
                                  ) : (
                                    <Badge className="bg-accent">Ready</Badge>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Update Status:</span>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(v) => handleUpdateStatus(selectedOrder.id, v as Order['status'])}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
