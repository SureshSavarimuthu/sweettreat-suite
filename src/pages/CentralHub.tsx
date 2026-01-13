import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Phone, User, Package, AlertTriangle, Settings, Factory, Warehouse } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  CentralHub,
  Product,
  mockCentralHubs,
  mockProducts,
  getStoredData,
  setStoredData,
  generateId,
  initializeMockData
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function CentralHubPage() {
  const [hubs, setHubs] = useState<CentralHub[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<CentralHub | null>(null);

  useEffect(() => {
    initializeMockData();
    setHubs(getStoredData('bakery_central_hubs', mockCentralHubs));
    setProducts(getStoredData('bakery_products', mockProducts));
  }, []);

  const filteredHubs = hubs.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || h.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getHubProducts = (hubId: string) => {
    return products.filter(p => p.location.id === hubId);
  };

  const handleCreateHub = (data: Partial<CentralHub>) => {
    const newHub: CentralHub = {
      id: generateId('hub'),
      name: data.name || '',
      code: data.code || `${data.type === 'kitchen' ? 'KTN' : 'WH'}-${Date.now()}`,
      type: data.type as 'kitchen' | 'warehouse',
      address: data.address || '',
      city: data.city || '',
      managerName: data.managerName || '',
      managerPhone: data.managerPhone || '',
      status: 'operational',
      totalProducts: 0,
      outOfStock: 0,
      lowStock: 0,
      dailyRevenue: 0
    };
    const updated = [...hubs, newHub];
    setHubs(updated);
    setStoredData('bakery_central_hubs', updated);
    setIsCreateOpen(false);
    toast.success('Central hub created successfully!');
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Central Hub Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage production kitchens and storage warehouses
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Hub
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Hub</DialogTitle>
              </DialogHeader>
              <HubForm onSubmit={handleCreateHub} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search hubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="kitchen">Kitchens</SelectItem>
              <SelectItem value="warehouse">Warehouses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hub Grid or Detail View */}
        {selectedHub ? (
          <HubDetail
            hub={selectedHub}
            products={getHubProducts(selectedHub.id)}
            onBack={() => setSelectedHub(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHubs.map((hub, index) => (
              <motion.div
                key={hub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedHub(hub)}
                className="bg-card rounded-xl p-5 shadow-card hover:shadow-elevated transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      hub.type === 'kitchen' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                    )}>
                      {hub.type === 'kitchen' ? <Factory className="w-5 h-5" /> : <Warehouse className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {hub.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{hub.code}</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    hub.status === 'operational' ? 'bg-accent' :
                    hub.status === 'maintenance' ? 'bg-warning text-foreground' :
                    'bg-destructive'
                  )}>
                    {hub.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{hub.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{hub.managerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{hub.managerPhone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                      <Package className="w-3 h-3" />
                    </div>
                    <p className="font-semibold text-foreground">{hub.totalProducts}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-destructive text-xs mb-1">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <p className="font-semibold text-destructive">{hub.outOfStock}</p>
                    <p className="text-xs text-muted-foreground">Out of Stock</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-warning text-xs mb-1">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <p className="font-semibold text-warning">{hub.lowStock}</p>
                    <p className="text-xs text-muted-foreground">Low Stock</p>
                  </div>
                </div>

                {hub.type === 'kitchen' && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <p className="text-xs text-muted-foreground">Today's Production</p>
                    <p className="font-semibold text-primary">{formatCurrency(hub.dailyRevenue)}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function HubDetail({ hub, products, onBack }: { hub: CentralHub; products: Product[]; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <div>
          <h2 className="font-display text-xl font-bold">{hub.name}</h2>
          <p className="text-muted-foreground">{hub.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-2xl font-bold text-foreground">{products.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">In Stock</p>
          <p className="text-2xl font-bold text-accent">{products.filter(p => p.stock > p.lowStockThreshold).length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Low Stock</p>
          <p className="text-2xl font-bold text-warning">{products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Out of Stock</p>
          <p className="text-2xl font-bold text-destructive">{products.filter(p => p.stock === 0).length}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="font-semibold mb-4">Products at this Hub</h3>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No products assigned to this hub</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map(product => (
              <div key={product.id} className="text-center">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-2">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className={cn(
                  'text-xs',
                  product.stock === 0 ? 'text-destructive' :
                  product.stock <= product.lowStockThreshold ? 'text-warning' :
                  'text-muted-foreground'
                )}>
                  {product.stock} {product.unit}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HubForm({ onSubmit }: { onSubmit: (data: Partial<CentralHub>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'kitchen' as 'kitchen' | 'warehouse',
    address: '',
    city: '',
    managerName: '',
    managerPhone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Hub Type</Label>
        <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as 'kitchen' | 'warehouse' })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hub Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Hub Code</Label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., KTN-CHE-04"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>City</Label>
        <Input
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Manager Name</Label>
          <Input
            value={formData.managerName}
            onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Manager Phone</Label>
          <Input
            value={formData.managerPhone}
            onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Create Hub</Button>
    </form>
  );
}
