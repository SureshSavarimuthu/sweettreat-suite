import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Phone, User, Package, AlertTriangle, Factory, Warehouse, TrendingUp, DollarSign } from 'lucide-react';
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
  const navigate = useNavigate();
  const [hubs, setHubs] = useState<CentralHub[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    initializeMockData();
    const storedHubs = getStoredData('bakery_central_hubs', mockCentralHubs);
    const storedProducts = getStoredData<Product[]>('bakery_products', mockProducts);
    
    console.log('Products loaded:', storedProducts.length);
    
    // Update hub product counts based on actual products
    const updatedHubs = storedHubs.map(hub => {
      const hubProducts = storedProducts.filter(p => p.location?.id === hub.id);
      console.log(`Hub ${hub.name} (${hub.id}): ${hubProducts.length} products`);
      return {
        ...hub,
        totalProducts: hubProducts.length,
        outOfStock: hubProducts.filter(p => p.stock === 0).length,
        lowStock: hubProducts.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length
      };
    });
    setHubs(updatedHubs);
  }, []);

  const filteredHubs = hubs.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || h.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate totals
  const totals = {
    hubs: hubs.length,
    kitchens: hubs.filter(h => h.type === 'kitchen').length,
    warehouses: hubs.filter(h => h.type === 'warehouse').length,
    totalProducts: hubs.reduce((sum, h) => sum + h.totalProducts, 0),
    outOfStock: hubs.reduce((sum, h) => sum + h.outOfStock, 0),
    dailyRevenue: hubs.filter(h => h.type === 'kitchen').reduce((sum, h) => sum + h.dailyRevenue, 0)
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Package className="w-4 h-4" />
              <span className="text-sm">Total Hubs</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totals.hubs}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Factory className="w-4 h-4" />
              <span className="text-sm">Kitchens</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totals.kitchens}</p>
          </div>
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Warehouse className="w-4 h-4" />
              <span className="text-sm">Warehouses</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totals.warehouses}</p>
          </div>
          <div className="bg-gradient-to-br from-info/20 to-info/5 rounded-xl p-4 border border-info/20">
            <div className="flex items-center gap-2 text-info mb-2">
              <Package className="w-4 h-4" />
              <span className="text-sm">Total Products</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totals.totalProducts}</p>
          </div>
          <div className="bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-xl p-4 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Out of Stock</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{totals.outOfStock}</p>
          </div>
          <div className="bg-gradient-to-br from-secondary to-secondary/50 rounded-xl p-4 border">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Daily Revenue</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totals.dailyRevenue)}</p>
          </div>
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

        {/* Hub Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHubs.map((hub, index) => (
            <motion.div
              key={hub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/central-hub/${hub.id}`)}
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
      </div>
    </MainLayout>
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Hub name is required';
    if (!formData.code.trim()) newErrors.code = 'Hub code is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.managerName.trim()) newErrors.managerName = 'Manager name is required';
    if (!formData.managerPhone.trim()) newErrors.managerPhone = 'Manager phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
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
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label>Hub Code</Label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., KTN-CHE-04"
            className={errors.code ? 'border-destructive' : ''}
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className={errors.address ? 'border-destructive' : ''}
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
      </div>
      <div className="space-y-2">
        <Label>City</Label>
        <Input
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className={errors.city ? 'border-destructive' : ''}
        />
        {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Manager Name</Label>
          <Input
            value={formData.managerName}
            onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
            className={errors.managerName ? 'border-destructive' : ''}
          />
          {errors.managerName && <p className="text-xs text-destructive">{errors.managerName}</p>}
        </div>
        <div className="space-y-2">
          <Label>Manager Phone</Label>
          <Input
            value={formData.managerPhone}
            onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
            className={errors.managerPhone ? 'border-destructive' : ''}
          />
          {errors.managerPhone && <p className="text-xs text-destructive">{errors.managerPhone}</p>}
        </div>
      </div>
      <Button type="submit" className="w-full">Create Hub</Button>
    </form>
  );
}
