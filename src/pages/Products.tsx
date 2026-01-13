import { useState, useEffect, useMemo } from 'react';
import { Plus, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  mockProducts,
  initializeMockData,
  getStoredData,
  Product
} from '@/lib/mockData';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [perPage, setPerPage] = useState('20');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    initializeMockData();
    // Simulate loading
    setTimeout(() => {
      setProducts(getStoredData('bakery_products', mockProducts));
      setLoading(false);
    }, 500);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // Status filter
    if (status !== 'all') {
      result = result.filter(p => p.status === status);
    }

    // Stock filter
    if (stockFilter === 'in-stock') {
      result = result.filter(p => p.stock > p.lowStockThreshold);
    } else if (stockFilter === 'low-stock') {
      result = result.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
    } else if (stockFilter === 'out-of-stock') {
      result = result.filter(p => p.stock === 0);
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'stock':
        result.sort((a, b) => a.stock - b.stock);
        break;
      case 'date':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, category, status, stockFilter, sort]);

  const paginatedProducts = useMemo(() => {
    const limit = parseInt(perPage);
    const start = (currentPage - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, currentPage, perPage]);

  const totalPages = Math.ceil(filteredProducts.length / parseInt(perPage));

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product);
  };

  const handleView = (product: Product) => {
    console.log('View product:', product);
  };

  const handleDelete = (product: Product) => {
    console.log('Delete product:', product);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your bakery and tea products ({filteredProducts.length} items)
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <ProductFilters
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          onStockChange={setStockFilter}
          onSortChange={setSort}
        />

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground">No products found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or add a new product.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {paginatedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Show</span>
              <Select value={perPage} onValueChange={setPerPage}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>per page</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
