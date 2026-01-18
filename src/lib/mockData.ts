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
  location: { type: 'kitchen' | 'warehouse'; name: string; id: string };
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

export interface Franchise {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  location: string;
  city: string;
  state: string;
  status: 'active' | 'inactive' | 'suspended';
  totalSales: number;
  creditPoints: number;
  joinedDate: string;
  agreementEndDate: string;
}

export interface FranchiseRequest {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  proposedLocation: string;
  city: string;
  investmentCapacity: number;
  experience: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  appliedDate: string;
  documents: string[];
}

export interface CentralHub {
  id: string;
  name: string;
  code: string;
  type: 'kitchen' | 'warehouse';
  address: string;
  city: string;
  managerName: string;
  managerPhone: string;
  status: 'operational' | 'maintenance' | 'closed';
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
  dailyRevenue: number;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  location: string;
  locationType: 'kitchen' | 'warehouse' | 'franchise' | 'admin';
  dateOfJoining: string;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  profilePhoto: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  franchiseId: string;
  franchiseName: string;
  items: { productId: string; productName: string; quantity: number; price: number; available: number }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'ready' | 'dispatched' | 'completed';
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  shortageCredit: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  franchiseId: string;
  franchiseName: string;
  orderId: string;
  amount: number;
  gst: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'franchise_request' | 'order' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionUrl: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'half-day' | 'leave';
}

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract';
  salaryMin: number;
  salaryMax: number;
  experience: string;
  description: string;
  requirements: string[];
  status: 'active' | 'inactive' | 'filled';
  applications: number;
  postedDate: string;
  deadline: string;
}

export interface ProductLaunch {
  id: string;
  productId: string;
  productName: string;
  title: string;
  description: string;
  bannerImage: string;
  launchDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'scheduled';
  views: number;
  clicks: number;
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

export const departments = [
  'Kitchen Operations',
  'Sales & Marketing',
  'Delivery',
  'Administration',
  'Finance',
  'HR',
  'IT'
];

export const designations = [
  'Chef',
  'Senior Chef',
  'Kitchen Manager',
  'Sales Executive',
  'Delivery Executive',
  'Store Manager',
  'Admin',
  'Accountant'
];

export const mockProducts: Product[] = [
  // Regular Products
  { id: 'prod-001', name: 'Vanilla Bumbo Bun', slug: 'vanilla-bumbo-bun', category: 'Bakery Items', price: 50, gst: 5, stock: 45, lowStockThreshold: 10, unit: 'piece', weight: 100, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-002', name: 'Chocolate Bumbo Bun', slug: 'chocolate-bumbo-bun', category: 'Bakery Items', price: 50, gst: 5, stock: 38, lowStockThreshold: 10, unit: 'piece', weight: 100, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-003', name: 'Cheese Bun', slug: 'cheese-bun', category: 'Bakery Items', price: 55, gst: 5, stock: 52, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-004', name: 'Bun Butter Jam', slug: 'bun-butter-jam', category: 'Bakery Items', price: 40, gst: 5, stock: 60, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1486427944544-d2c6703c2e9f?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-005', name: 'Plain Bun', slug: 'plain-bun', category: 'Bakery Items', price: 8, gst: 5, stock: 120, lowStockThreshold: 30, unit: 'piece', weight: 50, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-006', name: 'Almond Cookies', slug: 'almond-cookies', category: 'Bakery Items', price: 8, gst: 5, stock: 200, lowStockThreshold: 50, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-007', name: 'Strawberry Cookies', slug: 'strawberry-cookies', category: 'Bakery Items', price: 8, gst: 5, stock: 180, lowStockThreshold: 50, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-008', name: 'Coconut Cookies', slug: 'coconut-cookies', category: 'Bakery Items', price: 8, gst: 5, stock: 190, lowStockThreshold: 50, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-009', name: 'Choco-chip Cookies', slug: 'choco-chip-cookies', category: 'Bakery Items', price: 8, gst: 5, stock: 175, lowStockThreshold: 50, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-010', name: 'Blueberry Cookies', slug: 'blueberry-cookies', category: 'Bakery Items', price: 8, gst: 5, stock: 160, lowStockThreshold: 50, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-011', name: 'Choco-chip Muffin', slug: 'choco-chip-muffin', category: 'Bakery Items', price: 10, gst: 5, stock: 80, lowStockThreshold: 20, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-012', name: 'Blueberry Oats Muffin', slug: 'blueberry-oats-muffin', category: 'Bakery Items', price: 10, gst: 5, stock: 75, lowStockThreshold: 20, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-013', name: 'Black Current Muffin', slug: 'black-current-muffin', category: 'Bakery Items', price: 10, gst: 5, stock: 70, lowStockThreshold: 20, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-014', name: 'Choco Strawberry Muffin', slug: 'choco-strawberry-muffin', category: 'Bakery Items', price: 10, gst: 5, stock: 65, lowStockThreshold: 20, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-015', name: 'Red Velvet Cream Muffin', slug: 'red-velvet-cream-muffin', category: 'Bakery Items', price: 15, gst: 5, stock: 55, lowStockThreshold: 15, unit: 'piece', weight: 90, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-016', name: 'Chocolate Cream Muffin', slug: 'chocolate-cream-muffin', category: 'Bakery Items', price: 15, gst: 5, stock: 50, lowStockThreshold: 15, unit: 'piece', weight: 90, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-017', name: 'Orange Cream Muffin', slug: 'orange-cream-muffin', category: 'Bakery Items', price: 15, gst: 5, stock: 48, lowStockThreshold: 15, unit: 'piece', weight: 90, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-018', name: 'Blue Berry Cream Muffin', slug: 'blue-berry-cream-muffin', category: 'Bakery Items', price: 15, gst: 5, stock: 45, lowStockThreshold: 15, unit: 'piece', weight: 90, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-019', name: 'Dry Nut Cake', slug: 'dry-nut-cake', category: 'Cakes', price: 25, gst: 5, stock: 30, lowStockThreshold: 10, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-020', name: 'Ghee Cake', slug: 'ghee-cake', category: 'Cakes', price: 35, gst: 5, stock: 25, lowStockThreshold: 8, unit: 'piece', weight: 250, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-021', name: 'Cashew Cake', slug: 'cashew-cake', category: 'Cakes', price: 40, gst: 5, stock: 22, lowStockThreshold: 8, unit: 'piece', weight: 250, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-022', name: 'Strawberry Cake', slug: 'strawberry-cake', category: 'Cakes', price: 35, gst: 5, stock: 28, lowStockThreshold: 10, unit: 'piece', weight: 500, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-023', name: 'Pineapple Cake', slug: 'pineapple-cake', category: 'Cakes', price: 35, gst: 5, stock: 26, lowStockThreshold: 10, unit: 'piece', weight: 500, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-024', name: 'Butterscotch Cake', slug: 'butterscotch-cake', category: 'Cakes', price: 35, gst: 5, stock: 24, lowStockThreshold: 10, unit: 'piece', weight: 500, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-025', name: 'Blueberry Cake', slug: 'blueberry-cake', category: 'Cakes', price: 25, gst: 5, stock: 20, lowStockThreshold: 8, unit: 'piece', weight: 500, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-026', name: 'Pista Cake', slug: 'pista-cake', category: 'Cakes', price: 26, gst: 5, stock: 18, lowStockThreshold: 8, unit: 'piece', weight: 500, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-027', name: 'Lemon Cake', slug: 'lemon-cake', category: 'Cakes', price: 30, gst: 5, stock: 22, lowStockThreshold: 8, unit: 'piece', weight: 500, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-028', name: 'Orange Cake', slug: 'orange-cake', category: 'Cakes', price: 35, gst: 5, stock: 20, lowStockThreshold: 8, unit: 'piece', weight: 500, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-029', name: 'Dark Chocolate Cake', slug: 'dark-chocolate-cake', category: 'Cakes', price: 25, gst: 5, stock: 32, lowStockThreshold: 10, unit: 'piece', weight: 500, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-030', name: 'Chocolate Truffle Cake', slug: 'chocolate-truffle-cake', category: 'Cakes', price: 45, gst: 5, stock: 45, lowStockThreshold: 10, unit: 'piece', weight: 1000, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-031', name: 'Choco Lava', slug: 'choco-lava', category: 'Cakes', price: 25, gst: 5, stock: 40, lowStockThreshold: 10, unit: 'piece', weight: 150, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-032', name: 'Brownie', slug: 'brownie', category: 'Cakes', price: 60, gst: 5, stock: 55, lowStockThreshold: 15, unit: 'piece', weight: 100, location: { type: 'kitchen', name: 'Kitchen - T Nagar', id: 'hub-003' }, status: 'active', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-033', name: 'Caramel Cheese Cake', slug: 'caramel-cheese-cake', category: 'Cakes', price: 65, gst: 5, stock: 18, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-034', name: 'Biscoff Cheese Cake', slug: 'biscoff-cheese-cake', category: 'Cakes', price: 65, gst: 5, stock: 16, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-035', name: 'Oreo Cheese Cake', slug: 'oreo-cheese-cake', category: 'Cakes', price: 65, gst: 5, stock: 20, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-036', name: 'Blueberry Cheese Cake', slug: 'blueberry-cheese-cake', category: 'Cakes', price: 65, gst: 5, stock: 14, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-037', name: 'Mango Cheese Cake', slug: 'mango-cheese-cake', category: 'Cakes', price: 65, gst: 5, stock: 12, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-038', name: 'Spicy Twister Sticks', slug: 'spicy-twister-sticks', category: 'Bakery Items', price: 250, gst: 5, stock: 30, lowStockThreshold: 10, unit: 'pack', weight: 500, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-039', name: 'Sugar Sticks', slug: 'sugar-sticks', category: 'Bakery Items', price: 180, gst: 5, stock: 40, lowStockThreshold: 10, unit: 'pack', weight: 500, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-040', name: 'Salt Cookies', slug: 'salt-cookies', category: 'Bakery Items', price: 8, gst: 5, stock: 200, lowStockThreshold: 50, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-041', name: 'Masala Cookies', slug: 'masala-cookies', category: 'Bakery Items', price: 8, gst: 5, stock: 190, lowStockThreshold: 50, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-042', name: 'Cinnamon Roll', slug: 'cinnamon-roll', category: 'Bakery Items', price: 25, gst: 5, stock: 45, lowStockThreshold: 15, unit: 'piece', weight: 120, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-043', name: 'Plum Cake', slug: 'plum-cake', category: 'Cakes', price: 650, gst: 5, stock: 15, lowStockThreshold: 5, unit: 'piece', weight: 1000, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-044', name: 'Maska Bun', slug: 'maska-bun', category: 'Bakery Items', price: 20, gst: 5, stock: 80, lowStockThreshold: 20, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Anna Nagar', id: 'hub-001' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: [], createdAt: '2024-01-10' },
  
  // Eggless Products
  { id: 'prod-045', name: 'Cheese Bun (EL)', slug: 'cheese-bun-el', category: 'Eggless Items', price: 55, gst: 5, stock: 48, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-046', name: 'Bun Butter Jam (EL)', slug: 'bun-butter-jam-el', category: 'Eggless Items', price: 40, gst: 5, stock: 55, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1486427944544-d2c6703c2e9f?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-047', name: 'Almond Cookies (EL)', slug: 'almond-cookies-el', category: 'Eggless Items', price: 8, gst: 5, stock: 150, lowStockThreshold: 40, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Cold Storage', id: 'hub-004' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-048', name: 'Strawberry Cookies (EL)', slug: 'strawberry-cookies-el', category: 'Eggless Items', price: 8, gst: 5, stock: 145, lowStockThreshold: 40, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Cold Storage', id: 'hub-004' }, status: 'active', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-049', name: 'Blueberry Cookies (EL)', slug: 'blueberry-cookies-el', category: 'Eggless Items', price: 8, gst: 5, stock: 140, lowStockThreshold: 40, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Cold Storage', id: 'hub-004' }, status: 'active', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-050', name: 'Coconut Cookies (EL)', slug: 'coconut-cookies-el', category: 'Eggless Items', price: 8, gst: 5, stock: 155, lowStockThreshold: 40, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Cold Storage', id: 'hub-004' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-051', name: 'Chocolate Cookies (EL)', slug: 'chocolate-cookies-el', category: 'Eggless Items', price: 8, gst: 5, stock: 160, lowStockThreshold: 40, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Cold Storage', id: 'hub-004' }, status: 'active', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-052', name: 'Blueberry Oats Muffin (EL)', slug: 'blueberry-oats-muffin-el', category: 'Eggless Items', price: 10, gst: 5, stock: 60, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-053', name: 'Black Currant Muffin (EL)', slug: 'black-currant-muffin-el', category: 'Eggless Items', price: 10, gst: 5, stock: 58, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-054', name: 'Chocochip Muffin (EL)', slug: 'chocochip-muffin-el', category: 'Eggless Items', price: 10, gst: 5, stock: 62, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-055', name: 'Choco Strawberry Muffin (EL)', slug: 'choco-strawberry-muffin-el', category: 'Eggless Items', price: 10, gst: 5, stock: 56, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-056', name: 'Brownie (EL)', slug: 'brownie-el', category: 'Eggless Items', price: 60, gst: 5, stock: 45, lowStockThreshold: 12, unit: 'piece', weight: 100, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-057', name: 'Lava (EL)', slug: 'lava-el', category: 'Eggless Items', price: 25, gst: 5, stock: 38, lowStockThreshold: 10, unit: 'piece', weight: 150, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-058', name: 'Chocolate Cheese Cake (EL)', slug: 'chocolate-cheese-cake-el', category: 'Eggless Items', price: 65, gst: 5, stock: 15, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-059', name: 'Caramel Cheese Cake (EL)', slug: 'caramel-cheese-cake-el', category: 'Eggless Items', price: 65, gst: 5, stock: 14, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-060', name: 'Blue Berry Cheese Cake (EL)', slug: 'blue-berry-cheese-cake-el', category: 'Eggless Items', price: 65, gst: 5, stock: 12, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-061', name: 'Strawberry Cheese Cake (EL)', slug: 'strawberry-cheese-cake-el', category: 'Eggless Items', price: 65, gst: 5, stock: 13, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-062', name: 'Mango Cheese Cake (EL)', slug: 'mango-cheese-cake-el', category: 'Eggless Items', price: 65, gst: 5, stock: 11, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-063', name: 'Oreo Cheese Cake (EL)', slug: 'oreo-cheese-cake-el', category: 'Eggless Items', price: 65, gst: 5, stock: 16, lowStockThreshold: 5, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-064', name: 'Chocolate Truffle Cake - Pastry (EL)', slug: 'chocolate-truffle-cake-pastry-el', category: 'Eggless Items', price: 45, gst: 5, stock: 25, lowStockThreshold: 8, unit: 'piece', weight: 150, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-065', name: 'Dark Chocolate Cake - Pastry (EL)', slug: 'dark-chocolate-cake-pastry-el', category: 'Eggless Items', price: 25, gst: 5, stock: 28, lowStockThreshold: 8, unit: 'piece', weight: 150, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-066', name: 'Salt Cookies (EL)', slug: 'salt-cookies-el', category: 'Eggless Items', price: 8, gst: 5, stock: 170, lowStockThreshold: 40, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Cold Storage', id: 'hub-004' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-067', name: 'Masala Cookies (EL)', slug: 'masala-cookies-el', category: 'Eggless Items', price: 8, gst: 5, stock: 165, lowStockThreshold: 40, unit: 'piece', weight: 25, location: { type: 'warehouse', name: 'Warehouse - Cold Storage', id: 'hub-004' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-068', name: 'Donut (EL)', slug: 'donut-el', category: 'Eggless Items', price: 25, gst: 5, stock: 50, lowStockThreshold: 15, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-069', name: 'Jar Cake', slug: 'jar-cake', category: 'Cakes', price: 120, gst: 5, stock: 35, lowStockThreshold: 10, unit: 'piece', weight: 200, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', dietary: [], createdAt: '2024-01-10' },
  { id: 'prod-070', name: 'Maska Bun (EL)', slug: 'maska-bun-el', category: 'Eggless Items', price: 20, gst: 5, stock: 70, lowStockThreshold: 20, unit: 'piece', weight: 80, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', dietary: ['eggless'], createdAt: '2024-01-10' },
  { id: 'prod-071', name: 'Tiramisu', slug: 'tiramisu', category: 'Cakes', price: 90, gst: 5, stock: 22, lowStockThreshold: 8, unit: 'piece', weight: 180, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', dietary: [], createdAt: '2024-01-10' },
  
  // Tea & Coffee
  { id: 'prod-072', name: 'Masala Chai Blend', slug: 'masala-chai-blend', category: 'Tea & Coffee', price: 299, gst: 5, stock: 120, lowStockThreshold: 20, unit: 'grams', weight: 250, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', dietary: ['vegan'], createdAt: '2024-01-08' },
  { id: 'prod-073', name: 'Premium Coffee Beans', slug: 'premium-coffee-beans', category: 'Tea & Coffee', price: 599, gst: 5, stock: 65, lowStockThreshold: 15, unit: 'grams', weight: 500, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', dietary: ['vegan'], createdAt: '2024-01-06' },
  
  // Milk Products
  { id: 'prod-074', name: 'Fresh Paneer', slug: 'fresh-paneer', category: 'Milk Products', price: 180, gst: 0, stock: 5, lowStockThreshold: 10, unit: 'grams', weight: 500, location: { type: 'warehouse', name: 'Warehouse - Cold Storage', id: 'hub-004' }, status: 'active', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', dietary: [], createdAt: '2024-01-09' },
  
  // Drinks
  { id: 'prod-075', name: 'Mango Lassi', slug: 'mango-lassi', category: 'Drinks', price: 120, gst: 5, stock: 78, lowStockThreshold: 20, unit: 'ml', weight: 350, location: { type: 'kitchen', name: 'Kitchen - Velachery', id: 'hub-005' }, status: 'active', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400', dietary: [], createdAt: '2024-01-07' },
  
  // Essentials
  { id: 'prod-076', name: 'Sugar (Refined)', slug: 'sugar-refined', category: 'Essentials', price: 55, gst: 0, stock: 200, lowStockThreshold: 50, unit: 'kg', weight: 1000, location: { type: 'warehouse', name: 'Warehouse - Central', id: 'hub-002' }, status: 'active', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400', dietary: ['vegan'], createdAt: '2024-01-05' }
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

export const mockFranchises: Franchise[] = [
  {
    id: 'fr-001',
    name: 'Anna Nagar Outlet',
    ownerName: 'Rajesh Kumar',
    ownerEmail: 'rajesh@example.com',
    ownerPhone: '+91 98765 43210',
    location: '123, Anna Nagar Main Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'active',
    totalSales: 545000,
    creditPoints: 1250,
    joinedDate: '2023-01-15',
    agreementEndDate: '2026-01-15'
  },
  {
    id: 'fr-002',
    name: 'T Nagar Branch',
    ownerName: 'Priya Sharma',
    ownerEmail: 'priya@example.com',
    ownerPhone: '+91 98765 43211',
    location: '45, Pondy Bazaar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'active',
    totalSales: 432000,
    creditPoints: 980,
    joinedDate: '2023-03-20',
    agreementEndDate: '2026-03-20'
  },
  {
    id: 'fr-003',
    name: 'Velachery Store',
    ownerName: 'Kumar Vel',
    ownerEmail: 'kumar@example.com',
    ownerPhone: '+91 98765 43212',
    location: '78, Velachery Main Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'active',
    totalSales: 389000,
    creditPoints: 750,
    joinedDate: '2023-05-10',
    agreementEndDate: '2026-05-10'
  },
  {
    id: 'fr-004',
    name: 'Bangalore Central',
    ownerName: 'Arun Prakash',
    ownerEmail: 'arun@example.com',
    ownerPhone: '+91 98765 43213',
    location: '234, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    status: 'active',
    totalSales: 612000,
    creditPoints: 1500,
    joinedDate: '2022-11-01',
    agreementEndDate: '2025-11-01'
  }
];

export const mockFranchiseRequests: FranchiseRequest[] = [
  {
    id: 'req-001',
    applicantName: 'Suresh Menon',
    email: 'suresh@example.com',
    phone: '+91 98765 43220',
    proposedLocation: 'Madurai Main Road',
    city: 'Madurai',
    investmentCapacity: 1500000,
    experience: '5 years in F&B industry',
    status: 'pending',
    appliedDate: '2024-01-10',
    documents: ['ID Proof', 'Address Proof', 'Bank Statement']
  },
  {
    id: 'req-002',
    applicantName: 'Lakshmi Narayan',
    email: 'lakshmi@example.com',
    phone: '+91 98765 43221',
    proposedLocation: 'Coimbatore RS Puram',
    city: 'Coimbatore',
    investmentCapacity: 2000000,
    experience: '8 years retail experience',
    status: 'under_review',
    appliedDate: '2024-01-08',
    documents: ['ID Proof', 'Address Proof', 'Bank Statement', 'Business Plan']
  }
];

export const mockCentralHubs: CentralHub[] = [
  {
    id: 'hub-001',
    name: 'Kitchen - Anna Nagar',
    code: 'KTN-CHE-01',
    type: 'kitchen',
    address: '45, Industrial Area, Anna Nagar',
    city: 'Chennai',
    managerName: 'Venkat Raman',
    managerPhone: '+91 98765 43230',
    status: 'operational',
    totalProducts: 85,
    outOfStock: 3,
    lowStock: 8,
    dailyRevenue: 45000
  },
  {
    id: 'hub-002',
    name: 'Warehouse - Central',
    code: 'WH-CHE-01',
    type: 'warehouse',
    address: '123, Guindy Industrial Estate',
    city: 'Chennai',
    managerName: 'Ravi Kumar',
    managerPhone: '+91 98765 43231',
    status: 'operational',
    totalProducts: 150,
    outOfStock: 5,
    lowStock: 12,
    dailyRevenue: 0
  },
  {
    id: 'hub-003',
    name: 'Kitchen - T Nagar',
    code: 'KTN-CHE-02',
    type: 'kitchen',
    address: '78, T Nagar Industrial',
    city: 'Chennai',
    managerName: 'Suman Das',
    managerPhone: '+91 98765 43232',
    status: 'operational',
    totalProducts: 72,
    outOfStock: 1,
    lowStock: 5,
    dailyRevenue: 38000
  },
  {
    id: 'hub-004',
    name: 'Warehouse - Cold Storage',
    code: 'WH-CHE-02',
    type: 'warehouse',
    address: '56, Ambattur Industrial',
    city: 'Chennai',
    managerName: 'Muthu Krishnan',
    managerPhone: '+91 98765 43233',
    status: 'operational',
    totalProducts: 45,
    outOfStock: 2,
    lowStock: 6,
    dailyRevenue: 0
  },
  {
    id: 'hub-005',
    name: 'Kitchen - Velachery',
    code: 'KTN-CHE-03',
    type: 'kitchen',
    address: '90, Velachery Industrial',
    city: 'Chennai',
    managerName: 'Karthik Raja',
    managerPhone: '+91 98765 43234',
    status: 'maintenance',
    totalProducts: 65,
    outOfStock: 8,
    lowStock: 15,
    dailyRevenue: 0
  }
];

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    employeeId: 'EMP-2024-001',
    fullName: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    phone: '+91 98765 43240',
    designation: 'Senior Chef',
    department: 'Kitchen Operations',
    location: 'Kitchen - Anna Nagar',
    locationType: 'kitchen',
    dateOfJoining: '2022-03-15',
    salary: 45000,
    status: 'active',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
  },
  {
    id: 'emp-002',
    employeeId: 'EMP-2024-002',
    fullName: 'Priya Lakshmi',
    email: 'priya.l@example.com',
    phone: '+91 98765 43241',
    designation: 'Sales Executive',
    department: 'Sales & Marketing',
    location: 'Anna Nagar Outlet',
    locationType: 'franchise',
    dateOfJoining: '2023-01-10',
    salary: 28000,
    status: 'active',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  },
  {
    id: 'emp-003',
    employeeId: 'EMP-2024-003',
    fullName: 'Vijay Anand',
    email: 'vijay@example.com',
    phone: '+91 98765 43242',
    designation: 'Delivery Executive',
    department: 'Delivery',
    location: 'Warehouse - Central',
    locationType: 'warehouse',
    dateOfJoining: '2023-06-20',
    salary: 22000,
    status: 'active',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
  },
  {
    id: 'emp-004',
    employeeId: 'EMP-2024-004',
    fullName: 'Meena Kumari',
    email: 'meena@example.com',
    phone: '+91 98765 43243',
    designation: 'Store Manager',
    department: 'Administration',
    location: 'T Nagar Branch',
    locationType: 'franchise',
    dateOfJoining: '2022-08-01',
    salary: 38000,
    status: 'active',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
  },
  {
    id: 'emp-005',
    employeeId: 'EMP-2024-005',
    fullName: 'Arun Sharma',
    email: 'arun.s@example.com',
    phone: '+91 98765 43244',
    designation: 'Chef',
    department: 'Kitchen Operations',
    location: 'Kitchen - T Nagar',
    locationType: 'kitchen',
    dateOfJoining: '2023-09-15',
    salary: 32000,
    status: 'on-leave',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2024-0145',
    franchiseId: 'fr-001',
    franchiseName: 'Anna Nagar Outlet',
    items: [
      { productId: 'prod-001', productName: 'Chocolate Truffle Cake', quantity: 50, price: 899, available: 45 },
      { productId: 'prod-002', productName: 'Masala Chai Blend', quantity: 20, price: 299, available: 20 },
      { productId: 'prod-008', productName: 'Sugar (Refined)', quantity: 100, price: 55, available: 100 }
    ],
    totalAmount: 56430,
    status: 'processing',
    paymentStatus: 'paid',
    shortageCredit: 4495,
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T11:00:00'
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2024-0146',
    franchiseId: 'fr-002',
    franchiseName: 'T Nagar Branch',
    items: [
      { productId: 'prod-004', productName: 'Eggless Red Velvet', quantity: 30, price: 749, available: 22 },
      { productId: 'prod-006', productName: 'Mango Lassi', quantity: 50, price: 120, available: 50 }
    ],
    totalAmount: 28470,
    status: 'pending',
    paymentStatus: 'unpaid',
    shortageCredit: 5992,
    createdAt: '2024-01-15T09:15:00',
    updatedAt: '2024-01-15T09:15:00'
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2024-0147',
    franchiseId: 'fr-003',
    franchiseName: 'Velachery Store',
    items: [
      { productId: 'prod-007', productName: 'Premium Coffee Beans', quantity: 25, price: 599, available: 25 }
    ],
    totalAmount: 14975,
    status: 'ready',
    paymentStatus: 'paid',
    shortageCredit: 0,
    createdAt: '2024-01-14T16:45:00',
    updatedAt: '2024-01-15T08:00:00'
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-2024-0148',
    franchiseId: 'fr-004',
    franchiseName: 'Bangalore Central',
    items: [
      { productId: 'prod-001', productName: 'Chocolate Truffle Cake', quantity: 100, price: 899, available: 45 },
      { productId: 'prod-003', productName: 'Butter Croissant', quantity: 200, price: 85, available: 0 }
    ],
    totalAmount: 106900,
    status: 'pending',
    paymentStatus: 'partial',
    shortageCredit: 66455,
    createdAt: '2024-01-15T08:00:00',
    updatedAt: '2024-01-15T08:00:00'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2024-0001',
    franchiseId: 'fr-001',
    franchiseName: 'Anna Nagar Outlet',
    orderId: 'ord-001',
    amount: 53743,
    gst: 2687,
    totalAmount: 56430,
    status: 'paid',
    dueDate: '2024-01-30',
    createdAt: '2024-01-15'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2024-0002',
    franchiseId: 'fr-002',
    franchiseName: 'T Nagar Branch',
    orderId: 'ord-002',
    amount: 27114,
    gst: 1356,
    totalAmount: 28470,
    status: 'unpaid',
    dueDate: '2024-01-30',
    createdAt: '2024-01-15'
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2024-0003',
    franchiseId: 'fr-003',
    franchiseName: 'Velachery Store',
    orderId: 'ord-003',
    amount: 14262,
    gst: 713,
    totalAmount: 14975,
    status: 'paid',
    dueDate: '2024-01-29',
    createdAt: '2024-01-14'
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2024-0004',
    franchiseId: 'fr-004',
    franchiseName: 'Bangalore Central',
    orderId: 'ord-004',
    amount: 101810,
    gst: 5090,
    totalAmount: 106900,
    status: 'overdue',
    dueDate: '2024-01-10',
    createdAt: '2024-01-05'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Fresh Paneer stock below threshold (5 units) in Warehouse - Cold Storage',
    priority: 'high',
    read: false,
    actionUrl: '/products/fresh-paneer',
    createdAt: '2024-01-15T10:28:00'
  },
  {
    id: 'notif-002',
    type: 'franchise_request',
    title: 'New Franchise Request',
    message: 'Suresh Menon applied for Madurai franchise location',
    priority: 'medium',
    read: false,
    actionUrl: '/franchises/requests',
    createdAt: '2024-01-15T10:15:00'
  },
  {
    id: 'notif-003',
    type: 'out_of_stock',
    title: 'Out of Stock',
    message: 'Butter Croissant is completely out of stock in Kitchen - T Nagar',
    priority: 'urgent',
    read: false,
    actionUrl: '/products/butter-croissant',
    createdAt: '2024-01-15T09:30:00'
  },
  {
    id: 'notif-004',
    type: 'order',
    title: 'Large Order Received',
    message: 'Order #ORD-2024-0148 worth ₹1,06,900 from Bangalore Central',
    priority: 'medium',
    read: true,
    actionUrl: '/orders/ord-004',
    createdAt: '2024-01-15T08:00:00'
  },
  {
    id: 'notif-005',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Jan 20, 2024 from 2:00 AM to 4:00 AM',
    priority: 'low',
    read: true,
    actionUrl: '/notifications',
    createdAt: '2024-01-14T15:00:00'
  }
];

export const mockAttendance: Attendance[] = [
  { id: 'att-001', employeeId: 'emp-001', employeeName: 'Ramesh Kumar', date: '2024-01-15', checkIn: '09:00', checkOut: '18:00', status: 'present' },
  { id: 'att-002', employeeId: 'emp-002', employeeName: 'Priya Lakshmi', date: '2024-01-15', checkIn: '09:15', checkOut: '17:45', status: 'present' },
  { id: 'att-003', employeeId: 'emp-003', employeeName: 'Vijay Anand', date: '2024-01-15', checkIn: null, checkOut: null, status: 'absent' },
  { id: 'att-004', employeeId: 'emp-004', employeeName: 'Meena Kumari', date: '2024-01-15', checkIn: '09:00', checkOut: '14:00', status: 'half-day' },
  { id: 'att-005', employeeId: 'emp-005', employeeName: 'Arun Sharma', date: '2024-01-15', checkIn: null, checkOut: null, status: 'leave' },
];

export const mockJobVacancies: JobVacancy[] = [
  {
    id: 'job-001',
    title: 'Senior Chef',
    department: 'Kitchen Operations',
    location: 'Chennai',
    jobType: 'full-time',
    salaryMin: 40000,
    salaryMax: 60000,
    experience: '3-5 years',
    description: 'We are looking for an experienced Senior Chef to lead our kitchen operations.',
    requirements: ['Culinary degree', '3+ years experience', 'Team leadership skills'],
    status: 'active',
    applications: 45,
    postedDate: '2024-01-10',
    deadline: '2024-02-10'
  },
  {
    id: 'job-002',
    title: 'Sales Executive',
    department: 'Sales & Marketing',
    location: 'Bangalore',
    jobType: 'full-time',
    salaryMin: 25000,
    salaryMax: 35000,
    experience: '1-3 years',
    description: 'Join our sales team to drive growth at our Bangalore outlets.',
    requirements: ['Graduate degree', 'Sales experience', 'Good communication'],
    status: 'active',
    applications: 78,
    postedDate: '2024-01-08',
    deadline: '2024-02-08'
  },
  {
    id: 'job-003',
    title: 'Delivery Executive',
    department: 'Delivery',
    location: 'Chennai',
    jobType: 'full-time',
    salaryMin: 18000,
    salaryMax: 25000,
    experience: '0-2 years',
    description: 'Deliver freshly baked goods to our franchise partners.',
    requirements: ['Valid driving license', 'Knowledge of local area', 'Physical fitness'],
    status: 'active',
    applications: 120,
    postedDate: '2024-01-05',
    deadline: '2024-01-31'
  }
];

export const mockProductLaunches: ProductLaunch[] = [
  {
    id: 'launch-001',
    productId: 'prod-001',
    productName: 'Chocolate Truffle Cake',
    title: 'New Premium Chocolate Truffle',
    description: 'Indulge in our new premium chocolate truffle cake with Belgian chocolate.',
    bannerImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    launchDate: '2024-01-20',
    endDate: '2024-02-20',
    status: 'active',
    views: 1245,
    clicks: 342
  },
  {
    id: 'launch-002',
    productId: 'prod-004',
    productName: 'Eggless Red Velvet',
    title: 'Eggless Red Velvet Special',
    description: 'Perfect for vegetarians - our signature eggless red velvet cake.',
    bannerImage: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800',
    launchDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'active',
    views: 890,
    clicks: 215
  }
];

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
  if (!localStorage.getItem('bakery_franchises')) {
    setStoredData('bakery_franchises', mockFranchises);
  }
  if (!localStorage.getItem('bakery_franchise_requests')) {
    setStoredData('bakery_franchise_requests', mockFranchiseRequests);
  }
  if (!localStorage.getItem('bakery_central_hubs')) {
    setStoredData('bakery_central_hubs', mockCentralHubs);
  }
  if (!localStorage.getItem('bakery_employees')) {
    setStoredData('bakery_employees', mockEmployees);
  }
  if (!localStorage.getItem('bakery_orders')) {
    setStoredData('bakery_orders', mockOrders);
  }
  if (!localStorage.getItem('bakery_invoices')) {
    setStoredData('bakery_invoices', mockInvoices);
  }
  if (!localStorage.getItem('bakery_notifications')) {
    setStoredData('bakery_notifications', mockNotifications);
  }
  if (!localStorage.getItem('bakery_attendance')) {
    setStoredData('bakery_attendance', mockAttendance);
  }
  if (!localStorage.getItem('bakery_jobs')) {
    setStoredData('bakery_jobs', mockJobVacancies);
  }
  if (!localStorage.getItem('bakery_launches')) {
    setStoredData('bakery_launches', mockProductLaunches);
  }
}

// Generate unique ID
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
