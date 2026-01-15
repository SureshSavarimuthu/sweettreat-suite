import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Product, mockProducts, categories, getStoredData, initializeMockData } from '@/lib/mockData';
import { exportToExcel } from '@/utils/excelExport';

export default function ProductReports() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  useEffect(() => {
    initializeMockData();
    setProducts(getStoredData('bakery_products', mockProducts));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'in' && p.stock > p.lowStockThreshold) ||
      (stockFilter === 'low' && p.stock > 0 && p.stock <= p.lowStockThreshold) ||
      (stockFilter === 'out' && p.stock === 0);
    return matchesCat && matchesStock;
  });

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredProducts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredProducts.map(p => p.id)));
  };

  const handleExport = (all: boolean) => {
    const toExport = all ? filteredProducts : filteredProducts.filter(p => selectedIds.has(p.id));
    if (toExport.length === 0) {
      toast.error('No products selected for export');
      return;
    }

    const exportData = toExport.map(p => ({
      'Name': p.name,
      'Category': p.category,
      'Price': p.price,
      'GST %': p.gst,
      'Stock': p.stock,
      'Low Stock Threshold': p.lowStockThreshold,
      'Unit': p.unit,
      'Weight': p.weight,
      'Location': p.location.name,
      'Status': p.status
    }));

    exportToExcel(exportData, `Product_Report_${new Date().toISOString().split('T')[0]}`);
    toast.success(`Exported ${toExport.length} product records`);
  };

  const getStockStatus = (p: Product) => {
    if (p.stock === 0) return 'out';
    if (p.stock <= p.lowStockThreshold) return 'low';
    return 'in';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/reports')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">Product Reports</h1>
            <p className="text-muted-foreground">Generate and export inventory data</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Stock Status</label>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
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
                <th className="p-4 text-left"><Checkbox checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0} onCheckedChange={toggleAll} /></th>
                <th className="p-4 text-left font-medium">Product</th>
                <th className="p-4 text-left font-medium">Category</th>
                <th className="p-4 text-right font-medium">Price</th>
                <th className="p-4 text-right font-medium">Stock</th>
                <th className="p-4 text-left font-medium">Location</th>
                <th className="p-4 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className="border-t hover:bg-secondary/30">
                  <td className="p-4"><Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} /></td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 text-right text-primary font-medium">₹{p.price}</td>
                  <td className="p-4 text-right">{p.stock} {p.unit}</td>
                  <td className="p-4">{p.location.name}</td>
                  <td className="p-4 text-center">
                    <Badge className={
                      getStockStatus(p) === 'in' ? 'bg-accent' :
                      getStockStatus(p) === 'low' ? 'bg-warning text-foreground' :
                      'bg-destructive'
                    }>
                      {getStockStatus(p) === 'in' ? 'In Stock' : getStockStatus(p) === 'low' ? 'Low Stock' : 'Out of Stock'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
