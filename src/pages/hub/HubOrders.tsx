import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
  Search,
  Eye,
  MapPin,
  Phone,
  Calendar,
} from 'lucide-react';
import { HubLayout } from '@/components/hub/HubLayout';
import { useHubAuth } from '@/contexts/HubAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Order,
  Franchise,
  mockOrders,
  mockFranchises,
  getStoredData,
  setStoredData,
  initializeMockData,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function HubOrders() {
  const { hub, hubUser } = useHubAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    initializeMockData();
    loadData();
  }, [hub]);

  const loadData = () => {
    const storedOrders = getStoredData<Order[]>('bakery_orders', mockOrders);
    // In real app, filter orders assigned to this hub
    setOrders(storedOrders);

    const storedFranchises = getStoredData<Franchise[]>('bakery_franchises', mockFranchises);
    setFranchises(storedFranchises);
  };

  if (!hub || !hubUser) return null;

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const allOrders = getStoredData<Order[]>('bakery_orders', mockOrders);
    const updatedOrders = allOrders.map(o => 
      o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    setStoredData('bakery_orders', updatedOrders);
    setOrders(updatedOrders);

    const statusMessages = {
      processing: 'Order is now being processed',
      ready: 'Order is ready for dispatch',
      dispatched: 'Order has been dispatched',
      completed: 'Order has been completed',
    };

    toast({
      title: 'Order Updated',
      description: statusMessages[newStatus as keyof typeof statusMessages] || 'Order status updated',
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.franchiseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getFranchise = (franchiseId: string) => 
    franchises.find(f => f.id === franchiseId);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    dispatched: orders.filter(o => o.status === 'dispatched').length,
  };

  const getNextAction = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return { label: 'Start Processing', nextStatus: 'processing' as const };
      case 'processing':
        return { label: 'Mark Ready', nextStatus: 'ready' as const };
      case 'ready':
        return { label: 'Dispatch', nextStatus: 'dispatched' as const };
      case 'dispatched':
        return { label: 'Complete', nextStatus: 'completed' as const };
      default:
        return null;
    }
  };

  return (
    <HubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Fulfillment</h1>
            <p className="text-muted-foreground">Process and dispatch franchise orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-info/30 bg-info/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Package className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-info">{stats.processing}</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{stats.ready}</p>
                  <p className="text-xs text-muted-foreground">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.dispatched}</p>
                  <p className="text-xs text-muted-foreground">Dispatched</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Franchise</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, index) => {
                      const nextAction = getNextAction(order);
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="border-b"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.orderNumber}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{order.franchiseName}</p>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{order.items.length} items</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{order.totalAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              order.status === 'pending' ? 'bg-warning/20 text-warning' :
                              order.status === 'processing' ? 'bg-info/20 text-info' :
                              order.status === 'ready' ? 'bg-accent/20 text-accent' :
                              order.status === 'dispatched' ? 'bg-primary/20 text-primary' :
                              'bg-muted'
                            )}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setDetailsDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {nextAction && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, nextAction.nextStatus)}
                                >
                                  {nextAction.label}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kanban" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pending Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="font-medium text-warning">Pending</span>
                  <Badge variant="outline" className="ml-auto">{stats.pending}</Badge>
                </div>
                {orders.filter(o => o.status === 'pending').map(order => (
                  <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.items.length} items
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.franchiseName}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                        >
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Processing Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-info/10">
                  <Package className="w-4 h-4 text-info" />
                  <span className="font-medium text-info">Processing</span>
                  <Badge variant="outline" className="ml-auto">{stats.processing}</Badge>
                </div>
                {orders.filter(o => o.status === 'processing').map(order => (
                  <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow border-info/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.items.length} items
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.franchiseName}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                        >
                          Ready
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Ready Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/10">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="font-medium text-accent">Ready</span>
                  <Badge variant="outline" className="ml-auto">{stats.ready}</Badge>
                </div>
                {orders.filter(o => o.status === 'ready').map(order => (
                  <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow border-accent/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.items.length} items
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.franchiseName}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'dispatched')}
                        >
                          Dispatch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Dispatched Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">Dispatched</span>
                  <Badge variant="outline" className="ml-auto">{stats.dispatched}</Badge>
                </div>
                {orders.filter(o => o.status === 'dispatched').map(order => (
                  <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.items.length} items
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.franchiseName}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                        >
                          Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Franchise Info */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedOrder.franchiseName}</p>
                    {(() => {
                      const franchise = getFranchise(selectedOrder.franchiseId);
                      return franchise ? (
                        <>
                          <p className="text-sm text-muted-foreground">{franchise.location}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {franchise.ownerPhone}
                            </span>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-xl font-bold">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge className={cn(
                    selectedOrder.paymentStatus === 'paid' ? 'bg-accent' :
                    selectedOrder.paymentStatus === 'partial' ? 'bg-warning text-foreground' :
                    'bg-destructive'
                  )}>
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedOrder && getNextAction(selectedOrder) && (
              <Button onClick={() => {
                const nextAction = getNextAction(selectedOrder);
                if (nextAction) {
                  updateOrderStatus(selectedOrder.id, nextAction.nextStatus);
                  setDetailsDialogOpen(false);
                }
              }}>
                {getNextAction(selectedOrder)?.label}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
