import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, X, ImagePlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Product,
  categories,
  mockCentralHubs,
  getStoredData,
  setStoredData,
  generateId,
  initializeMockData
} from '@/lib/mockData';

export default function ProductCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    gst: '5',
    stock: '',
    lowStockThreshold: '10',
    unit: 'piece',
    weight: '',
    locationType: 'kitchen' as 'kitchen' | 'warehouse',
    locationId: '',
    status: 'active' as 'active' | 'inactive',
    dietary: [] as string[],
    description: '',
    image: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hubs = getStoredData('bakery_central_hubs', mockCentralHubs);
  const filteredHubs = hubs.filter(h => h.type === formData.locationType);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.weight || parseFloat(formData.weight) <= 0) newErrors.weight = 'Valid weight is required';
    if (!formData.locationId) newErrors.locationId = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    const selectedHub = hubs.find(h => h.id === formData.locationId);
    
    const newProduct: Product = {
      id: generateId('prod'),
      name: formData.name,
      slug: generateSlug(formData.name),
      category: formData.category,
      price: parseFloat(formData.price),
      gst: parseInt(formData.gst),
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      unit: formData.unit,
      weight: parseFloat(formData.weight),
      location: {
        type: formData.locationType,
        id: formData.locationId,
        name: selectedHub?.name || ''
      },
      status: formData.status,
      dietary: formData.dietary,
      image: imagePreview || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      createdAt: new Date().toISOString().split('T')[0]
    };

    initializeMockData();
    const products = getStoredData<Product[]>('bakery_products', []);
    const updated = [...products, newProduct];
    setStoredData('bakery_products', updated);

    setTimeout(() => {
      setLoading(false);
      toast.success('Product created successfully!');
      navigate('/products');
    }, 500);
  };

  const handleDietaryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(value)
        ? prev.dietary.filter(d => d !== value)
        : [...prev.dietary, value]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/products')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold">Create New Product</h1>
            <p className="text-muted-foreground">Add a new product to your inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
            <h2 className="font-semibold text-lg border-b pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chocolate Truffle Cake"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Dietary Tags</Label>
              <div className="flex flex-wrap gap-2">
                {['vegan', 'eggless', 'gluten-free', 'sugar-free'].map(tag => (
                  <Button
                    key={tag}
                    type="button"
                    variant={formData.dietary.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleDietaryChange(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6"
                    onClick={removeImage}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Upload Image</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Max 5MB, JPG/PNG/WEBP</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
            <h2 className="font-semibold text-lg border-b pb-2">Pricing & Stock</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.price ? 'border-destructive' : ''}
                />
                {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label>GST (%)</Label>
                <Select 
                  value={formData.gst} 
                  onValueChange={(v) => setFormData({ ...formData, gst: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stock Quantity *</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  min="0"
                  className={errors.stock ? 'border-destructive' : ''}
                />
                {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Low Stock Threshold</Label>
                <Input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  placeholder="10"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Weight *</Label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0"
                  min="0"
                  className={errors.weight ? 'border-destructive' : ''}
                />
                {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(v) => setFormData({ ...formData, unit: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="grams">Grams</SelectItem>
                    <SelectItem value="kg">Kilogram</SelectItem>
                    <SelectItem value="ml">Milliliter</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
            <h2 className="font-semibold text-lg border-b pb-2">Location & Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Location Type</Label>
                <Select 
                  value={formData.locationType} 
                  onValueChange={(v) => setFormData({ ...formData, locationType: v as 'kitchen' | 'warehouse', locationId: '' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Location *</Label>
                <Select 
                  value={formData.locationId} 
                  onValueChange={(v) => setFormData({ ...formData, locationId: v })}
                >
                  <SelectTrigger className={errors.locationId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredHubs.map(hub => (
                      <SelectItem key={hub.id} value={hub.id}>{hub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.locationId && <p className="text-xs text-destructive">{errors.locationId}</p>}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(v) => setFormData({ ...formData, status: v as 'active' | 'inactive' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/products')}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
