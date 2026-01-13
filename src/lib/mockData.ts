// Mock data for the Tea & Bakery Admin Dashboard

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  gst: number;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  weight: number;
  location: { type: 'kitchen' | 'warehouse'; name: string };
  status: 'active' | 'inactive';
  image: string;
  dietary: string[];
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
  sales: number;
  trend: number;
}

export interface Activity {
  id: string;
  type: 'low_stock' | 'franchise_request' | 'order' | 'urgent';
  title: string;
  description: string;
  timestamp: string;
  link: string;
}

export interface DashboardStats {
  totalSales: number;
  monthlySales: number;
  weeklySales: number;
  totalOrders: number;
  totalProducts: number;
  activeShops: number;
}

export const categories = [
  'Tea & Coffee',
  'Cakes',
  'Eggless Items',
  'Essentials',
  'Milk Products',
  'Drinks',
  'Bakery Items'
];

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Chocolate Truffle Cake',
    slug: 'chocolate-truffle-cake',
    category: 'Cakes',
    price: 899,
    gst: 5,
    stock: 45,
    lowStockThreshold: 10,
    unit: 'piece',
    weight: 1000,
    location: { type: 'kitchen', name: 'Kitchen - Anna Nagar' },
    status: 'active',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    dietary: [],
    createdAt: '2024-01-10'
  },
  {
    id: 'prod-002',
    name: 'Masala Chai Blend',
    slug: 'masala-chai-blend',
    category: 'Tea & Coffee',
    price: 299,
    gst: 5,
    stock: 120,
    lowStockThreshold: 20,
    unit: 'grams',
    weight: 250,
    location: { type: 'warehouse', name: 'Warehouse - Central' },
    status: 'active',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
    dietary: ['vegan'],
    createdAt: '2024-01-08'
  },
  {
    id: 'prod-003',
    name: 'Butter Croissant',
    slug: 'butter-croissant',
    category: 'Bakery Items',
    price: 85,
    gst: 5,
    stock: 0,
    lowStockThreshold: 15,
    unit: 'piece',
    weight: 80,
    location: { type: 'kitchen', name: 'Kitchen - T Nagar' },
    status: 'active',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    dietary: [],
    createdAt: '2024-01-12'
  },
  {
    id: 'prod-004',
    name: 'Eggless Red Velvet',
    slug: 'eggless-red-velvet',
    category: 'Eggless Items',
    price: 749,
    gst: 5,
    stock: 22,
    lowStockThreshold: 8,
    unit: 'piece',
    weight: 800,
    location: { type: 'kitchen', name: 'Kitchen - Anna Nagar' },
    status: 'active',
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=400',
    dietary: ['eggless'],
    createdAt: '2024-01-11'
  },
  {
    id: 'prod-005',
    name: 'Fresh Paneer',
    slug: 'fresh-paneer',
    category: 'Milk Products',
    price: 180,
    gst: 0,
    stock: 5,
    lowStockThreshold: 10,
    unit: 'grams',
    weight: 500,
    location: { type: 'warehouse', name: 'Warehouse - Cold Storage' },
    status: 'active',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    dietary: [],
    createdAt: '2024-01-09'
  },
  {
    id: 'prod-006',
    name: 'Mango Lassi',
    slug: 'mango-lassi',
    category: 'Drinks',
    price: 120,
    gst: 5,
    stock: 78,
    lowStockThreshold: 20,
    unit: 'ml',
    weight: 350,
    location: { type: 'kitchen', name: 'Kitchen - Velachery' },
    status: 'active',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400',
    dietary: [],
    createdAt: '2024-01-07'
  },
  {
    id: 'prod-007',
    name: 'Premium Coffee Beans',
    slug: 'premium-coffee-beans',
    category: 'Tea & Coffee',
    price: 599,
    gst: 5,
    stock: 65,
    lowStockThreshold: 15,
    unit: 'grams',
    weight: 500,
    location: { type: 'warehouse', name: 'Warehouse - Central' },
    status: 'active',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    dietary: ['vegan'],
    createdAt: '2024-01-06'
  },
  {
    id: 'prod-008',
    name: 'Sugar (Refined)',
    slug: 'sugar-refined',
    category: 'Essentials',
    price: 55,
    gst: 0,
    stock: 200,
    lowStockThreshold: 50,
    unit: 'kg',
    weight: 1000,
    location: { type: 'warehouse', name: 'Warehouse - Central' },
    status: 'active',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400',
    dietary: ['vegan'],
    createdAt: '2024-01-05'
  }
];

export const mockShops: Shop[] = [
  { id: 'shop-001', name: 'Anna Nagar Outlet', location: 'Chennai', sales: 545000, trend: 12 },
  { id: 'shop-002', name: 'T Nagar Branch', location: 'Chennai', sales: 432000, trend: 8 },
  { id: 'shop-003', name: 'Velachery Store', location: 'Chennai', sales: 389000, trend: -3 },
  { id: 'shop-004', name: 'Adyar Café', location: 'Chennai', sales: 521000, trend: 15 },
  { id: 'shop-005', name: 'Bangalore Central', location: 'Bangalore', sales: 612000, trend: 22 },
  { id: 'shop-006', name: 'Koramangala', location: 'Bangalore', sales: 478000, trend: 5 },
];

export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    type: 'low_stock',
    title: 'Low Stock Alert',
    description: 'Fresh Paneer stock below threshold (5 units)',
    timestamp: '2 mins ago',
    link: '/products/fresh-paneer'
  },
  {
    id: 'act-002',
    type: 'franchise_request',
    title: 'New Franchise Request',
    description: 'Rajesh Kumar applied for Madurai franchise',
    timestamp: '15 mins ago',
    link: '/franchises/requests'
  },
  {
    id: 'act-003',
    type: 'urgent',
    title: 'Out of Stock',
    description: 'Butter Croissant is completely out of stock',
    timestamp: '1 hour ago',
    link: '/products/butter-croissant'
  },
  {
    id: 'act-004',
    type: 'order',
    title: 'Large Order Received',
    description: 'Order #ORD-2024-0892 - ₹45,000 from Anna Nagar',
    timestamp: '2 hours ago',
    link: '/orders/ORD-2024-0892'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalSales: 12545000,
  monthlySales: 1850000,
  weeklySales: 425000,
  totalOrders: 3248,
  totalProducts: 456,
  activeShops: 24
};

// Helper function to get/set data from localStorage
export function getStoredData<T>(key: string, defaultData: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize localStorage with mock data
export function initializeMockData(): void {
  if (!localStorage.getItem('bakery_products')) {
    setStoredData('bakery_products', mockProducts);
  }
  if (!localStorage.getItem('bakery_shops')) {
    setStoredData('bakery_shops', mockShops);
  }
  if (!localStorage.getItem('bakery_stats')) {
    setStoredData('bakery_stats', mockDashboardStats);
  }
}
