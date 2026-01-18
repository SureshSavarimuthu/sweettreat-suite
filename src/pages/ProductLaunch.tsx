import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Eye, Edit2, Trash2, Rocket, X, Calendar } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProductLaunch as LaunchType, Product, getStoredData, setStoredData, initializeMockData, mockProducts, mockProductLaunches } from '@/lib/mockData';
import { toast } from 'sonner';
import Lottie from 'lottie-react';

const emptyAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  layers: [{
    ty: 4,
    nm: "circle",
    sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [100] }, { t: 30, s: [50] }, { t: 60, s: [100] }] },
      p: { a: 0, k: [100, 100] },
      s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 30, s: [110, 110] }, { t: 60, s: [100, 100] }] }
    },
    shapes: [{
      ty: "el",
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: [60, 60] }
    }, {
      ty: "st",
      c: { a: 0, k: [0.5, 0.5, 0.5, 0.3] },
      w: { a: 0, k: 4 }
    }]
  }]
};

interface LaunchFormData {
  productId: string;
  title: string;
  description: string;
  bannerImage: string;
  launchDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'scheduled';
}

const initialFormData: LaunchFormData = {
  productId: '',
  title: '',
  description: '',
  bannerImage: '',
  launchDate: '',
  endDate: '',
  status: 'scheduled'
};

export default function ProductLaunch() {
  const [launches, setLaunches] = useState<LaunchType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLaunch, setSelectedLaunch] = useState<LaunchType | null>(null);
  const [formData, setFormData] = useState<LaunchFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    initializeMockData();
    setLaunches(getStoredData('bakery_launches', mockProductLaunches));
    setProducts(getStoredData('bakery_products', mockProducts));
  }, []);

  const handleOpenCreate = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (launch: LaunchType) => {
    setFormData({
      productId: launch.productId,
      title: launch.title,
      description: launch.description,
      bannerImage: launch.bannerImage,
      launchDate: launch.launchDate,
      endDate: launch.endDate,
      status: launch.status
    });
    setSelectedLaunch(launch);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleOpenView = (launch: LaunchType) => {
    setSelectedLaunch(launch);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (launch: LaunchType) => {
    setSelectedLaunch(launch);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.productId || !formData.launchDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product = products.find(p => p.id === formData.productId);
    
    if (isEditing && selectedLaunch) {
      const updated = launches.map(l =>
        l.id === selectedLaunch.id
          ? {
              ...l,
              ...formData,
              productName: product?.name || l.productName
            }
          : l
      );
      setLaunches(updated);
      setStoredData('bakery_launches', updated);
      toast.success('Product launch updated successfully');
    } else {
      const newLaunch: LaunchType = {
        id: `launch-${Date.now()}`,
        productId: formData.productId,
        productName: product?.name || '',
        title: formData.title,
        description: formData.description,
        bannerImage: formData.bannerImage || 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
        launchDate: formData.launchDate,
        endDate: formData.endDate,
        status: formData.status,
        views: 0,
        clicks: 0
      };
      const updated = [...launches, newLaunch];
      setLaunches(updated);
      setStoredData('bakery_launches', updated);
      toast.success('Product launch created successfully');
    }

    setIsFormOpen(false);
    setFormData(initialFormData);
  };

  const handleDelete = () => {
    if (!selectedLaunch) return;
    const updated = launches.filter(l => l.id !== selectedLaunch.id);
    setLaunches(updated);
    setStoredData('bakery_launches', updated);
    setIsDeleteOpen(false);
    toast.success('Product launch deleted');
  };

  const getStatusBadge = (status: LaunchType['status']) => {
    const styles = {
      active: 'bg-accent',
      inactive: 'bg-muted',
      scheduled: 'bg-info text-white'
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Product Launches</h1>
            <p className="text-muted-foreground">Manage promotional banners and campaigns</p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            New Launch
          </Button>
        </div>

        {launches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl">
            <Lottie animationData={emptyAnimation} className="w-48 h-48" />
            <p className="text-muted-foreground mt-4">No product launches yet</p>
            <Button onClick={handleOpenCreate} className="mt-4">
              Create Your First Launch
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {launches.map(launch => (
              <div key={launch.id} className="bg-card rounded-xl overflow-hidden shadow-card group">
                <div className="relative">
                  <img 
                    src={launch.bannerImage} 
                    alt={launch.title} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleOpenView(launch)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(launch)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleOpenDelete(launch)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{launch.title}</h3>
                    {getStatusBadge(launch.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{launch.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {launch.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Rocket className="w-3 h-3" /> {launch.clicks}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {launch.launchDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Launch' : 'Create New Launch'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product *</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData({ ...formData, productId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Campaign Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Summer Special Launch"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Campaign description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, bannerImage: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {formData.bannerImage && (
                <img src={formData.bannerImage} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Launch Date *</Label>
                <Input
                  type="date"
                  value={formData.launchDate}
                  onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as LaunchType['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={handleSubmit}>
                {isEditing ? 'Update Launch' : 'Create Launch'}
              </Button>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          {selectedLaunch && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLaunch.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img 
                  src={selectedLaunch.bannerImage} 
                  alt={selectedLaunch.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">{selectedLaunch.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedLaunch.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Launch Date</p>
                    <p className="font-medium">{selectedLaunch.launchDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{selectedLaunch.endDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Views</p>
                    <p className="font-medium">{selectedLaunch.views}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                    <p className="font-medium">{selectedLaunch.clicks}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedLaunch.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product Launch?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedLaunch?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
