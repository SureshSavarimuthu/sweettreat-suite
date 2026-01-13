import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/lib/mockData';

interface ProductFiltersProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onStockChange: (stock: string) => void;
  onSortChange: (sort: string) => void;
}

export function ProductFilters({
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onStockChange,
  onSortChange,
}: ProductFiltersProps) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, onSearchChange]);

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
    if (value !== 'all' && !activeFilters.includes(`Category: ${value}`)) {
      setActiveFilters([...activeFilters.filter(f => !f.startsWith('Category:')), `Category: ${value}`]);
    } else if (value === 'all') {
      setActiveFilters(activeFilters.filter(f => !f.startsWith('Category:')));
    }
  };

  const handleStatusChange = (value: string) => {
    onStatusChange(value);
    if (value !== 'all' && !activeFilters.includes(`Status: ${value}`)) {
      setActiveFilters([...activeFilters.filter(f => !f.startsWith('Status:')), `Status: ${value}`]);
    } else if (value === 'all') {
      setActiveFilters(activeFilters.filter(f => !f.startsWith('Status:')));
    }
  };

  const handleStockChange = (value: string) => {
    onStockChange(value);
    if (value !== 'all' && !activeFilters.includes(`Stock: ${value}`)) {
      setActiveFilters([...activeFilters.filter(f => !f.startsWith('Stock:')), `Stock: ${value}`]);
    } else if (value === 'all') {
      setActiveFilters(activeFilters.filter(f => !f.startsWith('Stock:')));
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onCategoryChange('all');
    onStatusChange('all');
    onStockChange('all');
    onSortChange('name');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={handleStockChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onSortChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="stock">Stock Level</SelectItem>
              <SelectItem value="date">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setActiveFilters(activeFilters.filter(f => f !== filter));
                  if (filter.startsWith('Category:')) onCategoryChange('all');
                  if (filter.startsWith('Status:')) onStatusChange('all');
                  if (filter.startsWith('Stock:')) onStockChange('all');
                }}
              />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
