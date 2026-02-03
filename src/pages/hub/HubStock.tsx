import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Search,
  Plus,
  Minus,
  ArrowUpDown,
  Filter,
  AlertTriangle,
  ArrowRight,
  Download,
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
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Product,
  CentralHub,
  mockProducts,
  mockCentralHubs,
  getStoredData,
  setStoredData,
  initializeMockData,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'receive' | 'adjust' | 'transfer';
  quantity: number;
  previousStock: number;
  newStock: number;
  notes: string;
  timestamp: string;
  userId: string;
}

export default function HubStock() {
  const { hub, hubUser } = useHubAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [transferHub, setTransferHub] = useState('');
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [otherHubs, setOtherHubs] = useState<CentralHub[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  useEffect(() => {
    initializeMockData();
    loadData();
  }, [hub]);

  const loadData = () => {
    const storedProducts = getStoredData<Product[]>('bakery_products', mockProducts);
    setAllProducts(storedProducts);
    
    const hubProducts = storedProducts.filter(p => p.location.id === hub?.id);
    setProducts(hubProducts);

    const hubs = getStoredData<CentralHub[]>('bakery_central_hubs', mockCentralHubs);
    setOtherHubs(hubs.filter(h => h.id !== hub?.id));

    // Load transactions
    const storedTransactions = getStoredData<StockTransaction[]>('hub_transactions', []);
    setTransactions(storedTransactions.filter(t => 
      hubProducts.some(p => p.id === t.productId)
    ));
  };

  if (!hub || !hubUser) return null;

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' ? true :
        filterStatus === 'in-stock' ? product.stock > product.lowStockThreshold :
        filterStatus === 'low-stock' ? product.stock > 0 && product.stock <= product.lowStockThreshold :
        product.stock === 0;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      if (sortBy === 'stock-desc') return b.stock - a.stock;
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

  const handleAdjustStock = () => {
    if (!selectedProduct) return;

    const newStock = adjustType === 'add' 
      ? selectedProduct.stock + adjustQuantity 
      : Math.max(0, selectedProduct.stock - adjustQuantity);

    // Update product
    const updatedProducts = allProducts.map(p => 
      p.id === selectedProduct.id ? { ...p, stock: newStock } : p
    );
    setStoredData('bakery_products', updatedProducts);
    setAllProducts(updatedProducts);
    setProducts(updatedProducts.filter(p => p.location.id === hub?.id));

    // Save transaction
    const transaction: StockTransaction = {
      id: `txn-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: 'adjust',
      quantity: adjustType === 'add' ? adjustQuantity : -adjustQuantity,
      previousStock: selectedProduct.stock,
      newStock,
      notes: adjustNotes,
      timestamp: new Date().toISOString(),
      userId: hubUser.id,
    };
    const allTransactions = getStoredData<StockTransaction[]>('hub_transactions', []);
    setStoredData('hub_transactions', [...allTransactions, transaction]);
    setTransactions([...transactions, transaction]);

    toast({
      title: 'Stock Updated',
      description: `${selectedProduct.name} stock ${adjustType === 'add' ? 'increased' : 'decreased'} to ${newStock}`,
    });

    setAdjustDialogOpen(false);
    resetDialogState();
  };

  const handleTransferStock = () => {
    if (!selectedProduct || !transferHub) return;

    const targetHub = otherHubs.find(h => h.id === transferHub);
    if (!targetHub) return;

    // Update source product
    const newSourceStock = Math.max(0, selectedProduct.stock - transferQuantity);
    
    // Find or create product in target hub
    const targetProductIndex = allProducts.findIndex(p => 
      p.name === selectedProduct.name && p.location.id === transferHub
    );

    let updatedProducts = [...allProducts];
    
    // Update source
    updatedProducts = updatedProducts.map(p => 
      p.id === selectedProduct.id ? { ...p, stock: newSourceStock } : p
    );

    // Update or create target
    if (targetProductIndex >= 0) {
      updatedProducts[targetProductIndex] = {
        ...updatedProducts[targetProductIndex],
        stock: updatedProducts[targetProductIndex].stock + transferQuantity,
      };
    }

    setStoredData('bakery_products', updatedProducts);
    setAllProducts(updatedProducts);
    setProducts(updatedProducts.filter(p => p.location.id === hub?.id));

    // Save transaction
    const transaction: StockTransaction = {
      id: `txn-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: 'transfer',
      quantity: -transferQuantity,
      previousStock: selectedProduct.stock,
      newStock: newSourceStock,
      notes: `Transferred to ${targetHub.name}`,
      timestamp: new Date().toISOString(),
      userId: hubUser.id,
    };
    const allTransactions = getStoredData<StockTransaction[]>('hub_transactions', []);
    setStoredData('hub_transactions', [...allTransactions, transaction]);
    setTransactions([...transactions, transaction]);

    toast({
      title: 'Stock Transferred',
      description: `${transferQuantity} units of ${selectedProduct.name} transferred to ${targetHub.name}`,
    });

    setTransferDialogOpen(false);
    resetDialogState();
  };

  const resetDialogState = () => {
    setSelectedProduct(null);
    setAdjustQuantity(0);
    setAdjustType('add');
    setAdjustNotes('');
    setTransferHub('');
    setTransferQuantity(0);
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > p.lowStockThreshold).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  return (
    <HubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
            <p className="text-muted-foreground">Manage inventory for {hub.name}</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{stats.inStock}</p>
                  <p className="text-xs text-muted-foreground">In Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.lowStock}</p>
                  <p className="text-xs text-muted-foreground">Low Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.outOfStock}</p>
                  <p className="text-xs text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
              <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.weight}g per {product.unit}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        'font-semibold',
                        product.stock === 0 ? 'text-destructive' :
                        product.stock <= product.lowStockThreshold ? 'text-warning' :
                        'text-foreground'
                      )}>
                        {product.stock}
                      </span>
                      <span className="text-muted-foreground text-sm"> {product.unit}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        product.stock === 0 ? 'bg-destructive' :
                        product.stock <= product.lowStockThreshold ? 'bg-warning text-foreground' :
                        'bg-accent'
                      )}>
                        {product.stock === 0 ? 'Out of Stock' :
                         product.stock <= product.lowStockThreshold ? 'Low Stock' :
                         'In Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(product);
                            setAdjustDialogOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adjust
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(product);
                            setTransferDialogOpen(true);
                          }}
                          disabled={product.stock === 0}
                        >
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Transfer
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(-5).reverse().map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium text-sm">{txn.productName}</p>
                      <p className="text-xs text-muted-foreground">{txn.notes || txn.type}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'font-semibold',
                        txn.quantity > 0 ? 'text-accent' : 'text-destructive'
                      )}>
                        {txn.quantity > 0 ? '+' : ''}{txn.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(txn.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Update stock for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
              <img
                src={selectedProduct?.image}
                alt={selectedProduct?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">{selectedProduct?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Current Stock: <span className="font-semibold">{selectedProduct?.stock}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Action Type</Label>
                <Select value={adjustType} onValueChange={(v) => setAdjustType(v as 'add' | 'remove')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={0}
                  max={adjustType === 'remove' ? selectedProduct?.stock : undefined}
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Input
                placeholder="Reason for adjustment..."
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
              />
            </div>

            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm">
                New Stock: <span className="font-bold">
                  {adjustType === 'add' 
                    ? (selectedProduct?.stock || 0) + adjustQuantity
                    : Math.max(0, (selectedProduct?.stock || 0) - adjustQuantity)}
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjustStock} disabled={adjustQuantity <= 0}>
              Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Stock Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
            <DialogDescription>
              Transfer {selectedProduct?.name} to another hub
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
              <img
                src={selectedProduct?.image}
                alt={selectedProduct?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">{selectedProduct?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Available: <span className="font-semibold">{selectedProduct?.stock}</span>
                </p>
              </div>
            </div>

            <div>
              <Label>Transfer To</Label>
              <Select value={transferHub} onValueChange={setTransferHub}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination hub" />
                </SelectTrigger>
                <SelectContent>
                  {otherHubs.map(h => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name} ({h.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantity to Transfer</Label>
              <Input
                type="number"
                min={1}
                max={selectedProduct?.stock}
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm">
                Remaining after transfer: <span className="font-bold">
                  {Math.max(0, (selectedProduct?.stock || 0) - transferQuantity)}
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransferStock} 
              disabled={!transferHub || transferQuantity <= 0 || transferQuantity > (selectedProduct?.stock || 0)}
            >
              Transfer Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
