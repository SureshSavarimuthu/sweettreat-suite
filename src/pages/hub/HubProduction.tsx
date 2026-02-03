import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { HubLayout } from '@/components/hub/HubLayout';
import { useHubAuth } from '@/contexts/HubAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Product,
  mockProducts,
  getStoredData,
  setStoredData,
  initializeMockData,
  generateId,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductionBatch {
  id: string;
  productId: string;
  productName: string;
  targetQuantity: number;
  actualQuantity: number;
  wastage: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  qualityCheck: 'pending' | 'passed' | 'failed';
  notes: string;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  hubId: string;
}

export default function HubProduction() {
  const { hub, hubUser } = useHubAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state for new batch
  const [newBatch, setNewBatch] = useState({
    productId: '',
    targetQuantity: 0,
    notes: '',
  });

  // Form state for update
  const [updateForm, setUpdateForm] = useState({
    actualQuantity: 0,
    wastage: 0,
    qualityCheck: 'pending' as 'pending' | 'passed' | 'failed',
    notes: '',
  });

  useEffect(() => {
    initializeMockData();
    loadData();
  }, [hub]);

  const loadData = () => {
    const storedProducts = getStoredData<Product[]>('bakery_products', mockProducts);
    const hubProducts = storedProducts.filter(p => p.location.id === hub?.id);
    setProducts(hubProducts);

    const storedBatches = getStoredData<ProductionBatch[]>('hub_production_batches', []);
    setBatches(storedBatches.filter(b => b.hubId === hub?.id));
  };

  if (!hub || !hubUser) return null;

  // Only show production for kitchens
  if (hub.type !== 'kitchen') {
    return (
      <HubLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <ClipboardList className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Production Not Available</h2>
          <p className="text-muted-foreground mt-2">
            Production tracking is only available for Kitchen hubs.
          </p>
        </div>
      </HubLayout>
    );
  }

  const handleCreateBatch = () => {
    const product = products.find(p => p.id === newBatch.productId);
    if (!product) return;

    const batch: ProductionBatch = {
      id: generateId('batch'),
      productId: newBatch.productId,
      productName: product.name,
      targetQuantity: newBatch.targetQuantity,
      actualQuantity: 0,
      wastage: 0,
      status: 'planned',
      qualityCheck: 'pending',
      notes: newBatch.notes,
      startTime: null,
      endTime: null,
      createdAt: new Date().toISOString(),
      hubId: hub.id,
    };

    const allBatches = getStoredData<ProductionBatch[]>('hub_production_batches', []);
    setStoredData('hub_production_batches', [...allBatches, batch]);
    setBatches([...batches, batch]);

    toast({
      title: 'Batch Created',
      description: `Production batch for ${product.name} has been created.`,
    });

    setCreateDialogOpen(false);
    setNewBatch({ productId: '', targetQuantity: 0, notes: '' });
  };

  const handleStartBatch = (batch: ProductionBatch) => {
    const updatedBatch = {
      ...batch,
      status: 'in-progress' as const,
      startTime: new Date().toISOString(),
    };
    updateBatchInStorage(updatedBatch);
    toast({
      title: 'Production Started',
      description: `${batch.productName} production has started.`,
    });
  };

  const handleCompleteBatch = () => {
    if (!selectedBatch) return;

    const updatedBatch = {
      ...selectedBatch,
      status: 'completed' as const,
      actualQuantity: updateForm.actualQuantity,
      wastage: updateForm.wastage,
      qualityCheck: updateForm.qualityCheck,
      notes: updateForm.notes || selectedBatch.notes,
      endTime: new Date().toISOString(),
    };

    updateBatchInStorage(updatedBatch);

    // Update product stock if quality passed
    if (updateForm.qualityCheck === 'passed') {
      const allProducts = getStoredData<Product[]>('bakery_products', mockProducts);
      const updatedProducts = allProducts.map(p => 
        p.id === selectedBatch.productId 
          ? { ...p, stock: p.stock + updateForm.actualQuantity }
          : p
      );
      setStoredData('bakery_products', updatedProducts);
    }

    toast({
      title: 'Batch Completed',
      description: updateForm.qualityCheck === 'passed' 
        ? `${updateForm.actualQuantity} units added to stock.`
        : 'Batch marked as completed.',
    });

    setUpdateDialogOpen(false);
    setSelectedBatch(null);
  };

  const handleCancelBatch = (batch: ProductionBatch) => {
    const updatedBatch = { ...batch, status: 'cancelled' as const };
    updateBatchInStorage(updatedBatch);
    toast({
      title: 'Batch Cancelled',
      description: `${batch.productName} production has been cancelled.`,
    });
  };

  const updateBatchInStorage = (updatedBatch: ProductionBatch) => {
    const allBatches = getStoredData<ProductionBatch[]>('hub_production_batches', []);
    const updated = allBatches.map(b => b.id === updatedBatch.id ? updatedBatch : b);
    setStoredData('hub_production_batches', updated);
    setBatches(batches.map(b => b.id === updatedBatch.id ? updatedBatch : b));
  };

  const filteredBatches = batches.filter(b => 
    filterStatus === 'all' ? true : b.status === filterStatus
  );

  const todayBatches = batches.filter(b => 
    new Date(b.createdAt).toDateString() === new Date().toDateString()
  );

  const stats = {
    planned: batches.filter(b => b.status === 'planned').length,
    inProgress: batches.filter(b => b.status === 'in-progress').length,
    completed: todayBatches.filter(b => b.status === 'completed').length,
    totalProduced: todayBatches
      .filter(b => b.status === 'completed' && b.qualityCheck === 'passed')
      .reduce((sum, b) => sum + b.actualQuantity, 0),
    totalWastage: todayBatches
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.wastage, 0),
  };

  return (
    <HubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Production Tracking</h1>
            <p className="text-muted-foreground">Manage daily production batches</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Batch
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.planned}</p>
                  <p className="text-xs text-muted-foreground">Planned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <ClipboardList className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-info">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProduced}</p>
                  <p className="text-xs text-muted-foreground">Units Produced</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.totalWastage}</p>
                  <p className="text-xs text-muted-foreground">Wastage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList>
            <TabsTrigger value="all">All Batches</TabsTrigger>
            <TabsTrigger value="planned">Planned</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={filterStatus} className="mt-4">
            {filteredBatches.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No batches found</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    Create First Batch
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBatches.map((batch, index) => (
                  <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      'transition-all hover:shadow-md',
                      batch.status === 'in-progress' && 'border-info/50 bg-info/5'
                    )}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{batch.productName}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              Target: {batch.targetQuantity} units
                            </p>
                          </div>
                          <Badge className={cn(
                            batch.status === 'planned' ? 'bg-muted text-muted-foreground' :
                            batch.status === 'in-progress' ? 'bg-info' :
                            batch.status === 'completed' ? 'bg-accent' :
                            'bg-destructive'
                          )}>
                            {batch.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {batch.status === 'completed' && (
                          <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-secondary/50">
                            <div>
                              <p className="text-xs text-muted-foreground">Produced</p>
                              <p className="font-semibold">{batch.actualQuantity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Wastage</p>
                              <p className="font-semibold text-destructive">{batch.wastage}</p>
                            </div>
                          </div>
                        )}

                        {batch.qualityCheck !== 'pending' && (
                          <div className="flex items-center gap-2">
                            {batch.qualityCheck === 'passed' ? (
                              <CheckCircle className="w-4 h-4 text-accent" />
                            ) : (
                              <XCircle className="w-4 h-4 text-destructive" />
                            )}
                            <span className="text-sm">
                              Quality: {batch.qualityCheck}
                            </span>
                          </div>
                        )}

                        {batch.startTime && (
                          <p className="text-xs text-muted-foreground">
                            Started: {new Date(batch.startTime).toLocaleTimeString()}
                          </p>
                        )}

                        <div className="flex gap-2">
                          {batch.status === 'planned' && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleStartBatch(batch)}
                              >
                                Start
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelBatch(batch)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {batch.status === 'in-progress' && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedBatch(batch);
                                setUpdateForm({
                                  actualQuantity: batch.targetQuantity,
                                  wastage: 0,
                                  qualityCheck: 'pending',
                                  notes: '',
                                });
                                setUpdateDialogOpen(true);
                              }}
                            >
                              Complete Batch
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Batch Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Production Batch</DialogTitle>
            <DialogDescription>
              Plan a new production batch for today
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Product</Label>
              <Select
                value={newBatch.productId}
                onValueChange={(v) => setNewBatch({ ...newBatch, productId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Quantity</Label>
              <Input
                type="number"
                min={1}
                value={newBatch.targetQuantity}
                onChange={(e) => setNewBatch({ ...newBatch, targetQuantity: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Any special instructions..."
                value={newBatch.notes}
                onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateBatch}
              disabled={!newBatch.productId || newBatch.targetQuantity <= 0}
            >
              Create Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Batch Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Production Batch</DialogTitle>
            <DialogDescription>
              Record the final production details for {selectedBatch?.productName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm">
                Target Quantity: <span className="font-bold">{selectedBatch?.targetQuantity}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Actual Quantity Produced</Label>
                <Input
                  type="number"
                  min={0}
                  value={updateForm.actualQuantity}
                  onChange={(e) => setUpdateForm({ ...updateForm, actualQuantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Wastage</Label>
                <Input
                  type="number"
                  min={0}
                  value={updateForm.wastage}
                  onChange={(e) => setUpdateForm({ ...updateForm, wastage: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label>Quality Check Result</Label>
              <Select
                value={updateForm.qualityCheck}
                onValueChange={(v) => setUpdateForm({ ...updateForm, qualityCheck: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Passed
                    </span>
                  </SelectItem>
                  <SelectItem value="failed">
                    <span className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-destructive" />
                      Failed
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {updateForm.qualityCheck === 'failed' && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Quality check failed</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Stock will not be updated for failed batches.
                </p>
              </div>
            )}

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Any observations or issues..."
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteBatch}>
              Complete Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
