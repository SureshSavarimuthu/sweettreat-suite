import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Phone, Mail, TrendingUp, Award, Eye, Edit, Power, Store, Pause, Building2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Franchise,
  FranchiseRequest,
  mockFranchises,
  mockFranchiseRequests,
  getStoredData,
  setStoredData,
  generateId,
  initializeMockData
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import Lottie from 'lottie-react';

// Empty state animation data
const emptyAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Empty",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 50, ix: 11 },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 60, s: [360] }], ix: 10 },
        p: { a: 0, k: [100, 100, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [80, 80], ix: 2 },
          p: { a: 0, k: [0, 0], ix: 3 },
          nm: "Ellipse Path 1"
        },
        {
          ty: "st",
          c: { a: 0, k: [0.855, 0.467, 0.153, 1], ix: 3 },
          o: { a: 0, k: 100, ix: 4 },
          w: { a: 0, k: 4, ix: 5 },
          lc: 2,
          lj: 1,
          ml: 4,
          d: [{ n: "d", v: { a: 0, k: 10, ix: 1 } }, { n: "o", v: { a: 0, k: 0, ix: 7 } }],
          nm: "Stroke"
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    }
  ]
};

export default function Franchises() {
  const navigate = useNavigate();
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [requests, setRequests] = useState<FranchiseRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewFranchise, setViewFranchise] = useState<Franchise | null>(null);
  const [editFranchise, setEditFranchise] = useState<Franchise | null>(null);

  useEffect(() => {
    initializeMockData();
    setFranchises(getStoredData('bakery_franchises', mockFranchises));
    setRequests(getStoredData('bakery_franchise_requests', mockFranchiseRequests));
  }, []);

  const filteredFranchises = franchises.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      f.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group franchises by status
  const activeFranchises = filteredFranchises.filter(f => f.status === 'active');
  const inactiveFranchises = filteredFranchises.filter(f => f.status === 'inactive');
  const suspendedFranchises = filteredFranchises.filter(f => f.status === 'suspended');

  // Counts
  const counts = {
    active: franchises.filter(f => f.status === 'active').length,
    inactive: franchises.filter(f => f.status === 'inactive').length,
    suspended: franchises.filter(f => f.status === 'suspended').length,
    total: franchises.length
  };

  const handleApproveRequest = (request: FranchiseRequest) => {
    const newFranchise: Franchise = {
      id: generateId('fr'),
      name: `${request.city} Outlet`,
      ownerName: request.applicantName,
      ownerEmail: request.email,
      ownerPhone: request.phone,
      location: request.proposedLocation,
      city: request.city,
      state: 'Tamil Nadu',
      status: 'active',
      totalSales: 0,
      creditPoints: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      agreementEndDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const updatedFranchises = [...franchises, newFranchise];
    const updatedRequests = requests.map(r =>
      r.id === request.id ? { ...r, status: 'approved' as const } : r
    );

    setFranchises(updatedFranchises);
    setRequests(updatedRequests);
    setStoredData('bakery_franchises', updatedFranchises);
    setStoredData('bakery_franchise_requests', updatedRequests);
    toast.success('Franchise request approved!');
  };

  const handleRejectRequest = (request: FranchiseRequest) => {
    const updatedRequests = requests.map(r =>
      r.id === request.id ? { ...r, status: 'rejected' as const } : r
    );
    setRequests(updatedRequests);
    setStoredData('bakery_franchise_requests', updatedRequests);
    toast.success('Franchise request rejected');
  };

  const handleStatusChange = (franchise: Franchise, newStatus: 'active' | 'inactive' | 'suspended') => {
    const updatedFranchises = franchises.map(f =>
      f.id === franchise.id ? { ...f, status: newStatus } : f
    );
    setFranchises(updatedFranchises);
    setStoredData('bakery_franchises', updatedFranchises);
    toast.success(`Franchise ${newStatus === 'active' ? 'activated' : newStatus === 'inactive' ? 'deactivated' : 'suspended'}`);
  };

  const handleUpdateFranchise = (data: Partial<Franchise>) => {
    if (!editFranchise) return;
    const updatedFranchises = franchises.map(f =>
      f.id === editFranchise.id ? { ...f, ...data } : f
    );
    setFranchises(updatedFranchises);
    setStoredData('bakery_franchises', updatedFranchises);
    setEditFranchise(null);
    toast.success('Franchise updated successfully!');
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString()}`;
  };

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'under_review');

  const FranchiseCard = ({ franchise, index }: { franchise: Franchise; index: number }) => (
    <motion.div
      key={franchise.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-xl p-5 shadow-card hover:shadow-elevated transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{franchise.name}</h3>
          <p className="text-sm text-muted-foreground">{franchise.ownerName}</p>
        </div>
        <Badge className={cn(
          franchise.status === 'active' ? 'bg-accent' :
          franchise.status === 'inactive' ? 'bg-muted text-muted-foreground' :
          'bg-destructive'
        )}>
          {franchise.status}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{franchise.city}, {franchise.state}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{franchise.ownerPhone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span className="truncate">{franchise.ownerEmail}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t">
        <div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <TrendingUp className="w-3 h-3" />
            Total Sales
          </div>
          <p className="font-semibold text-foreground">{formatCurrency(franchise.totalSales)}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Award className="w-3 h-3" />
            Credit Points
          </div>
          <p className="font-semibold text-primary">{franchise.creditPoints} pts</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setViewFranchise(franchise)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setEditFranchise(franchise)}
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Select
          value={franchise.status}
          onValueChange={(v) => handleStatusChange(franchise, v as 'active' | 'inactive' | 'suspended')}
        >
          <SelectTrigger className="w-24">
            <Power className="w-4 h-4" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspend</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-40 h-40">
        <Lottie animationData={emptyAnimation} loop={true} />
      </div>
      <p className="text-muted-foreground text-lg mt-4">{message}</p>
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Franchise Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage franchise partners and process applications
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Franchise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Franchise</DialogTitle>
              </DialogHeader>
              <FranchiseForm
                onSubmit={(data) => {
                  const newFranchise: Franchise = {
                    id: generateId('fr'),
                    ...data,
                    status: 'active',
                    totalSales: 0,
                    creditPoints: 0,
                    joinedDate: new Date().toISOString().split('T')[0],
                    agreementEndDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  };
                  const updated = [...franchises, newFranchise];
                  setFranchises(updated);
                  setStoredData('bakery_franchises', updated);
                  setIsCreateOpen(false);
                  toast.success('Franchise created successfully!');
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Count Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{counts.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Store className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-accent">{counts.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-muted to-muted/50 rounded-xl p-4 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted-foreground/20 rounded-lg">
                <Power className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-muted-foreground">{counts.inactive}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-xl p-4 border border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <Pause className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-destructive">{counts.suspended}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="franchises">
          <TabsList>
            <TabsTrigger value="franchises">All Franchises ({franchises.length})</TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              Requests
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-primary">{pendingRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="franchises" className="space-y-4 mt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search franchises..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredFranchises.length === 0 ? (
              <EmptyState message="No franchises found" />
            ) : (
              <div className="space-y-8">
                {/* Active Franchises */}
                {(statusFilter === 'all' || statusFilter === 'active') && activeFranchises.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-4 flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      Active Franchises ({activeFranchises.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeFranchises.map((franchise, index) => (
                        <FranchiseCard key={franchise.id} franchise={franchise} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Inactive Franchises */}
                {(statusFilter === 'all' || statusFilter === 'inactive') && inactiveFranchises.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                      <Power className="w-5 h-5" />
                      Inactive Franchises ({inactiveFranchises.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {inactiveFranchises.map((franchise, index) => (
                        <FranchiseCard key={franchise.id} franchise={franchise} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Suspended Franchises */}
                {(statusFilter === 'all' || statusFilter === 'suspended') && suspendedFranchises.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
                      <Pause className="w-5 h-5" />
                      Suspended Franchises ({suspendedFranchises.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {suspendedFranchises.map((franchise, index) => (
                        <FranchiseCard key={franchise.id} franchise={franchise} index={index} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4 mt-4">
            {requests.length === 0 ? (
              <EmptyState message="No pending requests" />
            ) : (
              <div className="space-y-4">
                {requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-xl p-5 shadow-card"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{request.applicantName}</h3>
                          <Badge className={cn(
                            request.status === 'pending' ? 'bg-warning text-foreground' :
                            request.status === 'under_review' ? 'bg-info text-white' :
                            request.status === 'approved' ? 'bg-accent' :
                            'bg-destructive'
                          )}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{request.city}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Investment</p>
                            <p className="font-medium">{formatCurrency(request.investmentCapacity)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Experience</p>
                            <p className="font-medium">{request.experience}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Applied</p>
                            <p className="font-medium">{request.appliedDate}</p>
                          </div>
                        </div>
                      </div>

                      {request.status === 'pending' || request.status === 'under_review' ? (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            onClick={() => handleApproveRequest(request)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRejectRequest(request)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-sm">
                          {request.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* View Dialog */}
        <Dialog open={!!viewFranchise} onOpenChange={() => setViewFranchise(null)}>
          <DialogContent className="max-w-2xl">
            {viewFranchise && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewFranchise.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Owner</p>
                      <p className="font-semibold">{viewFranchise.ownerName}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={cn(
                        viewFranchise.status === 'active' ? 'bg-accent' :
                        viewFranchise.status === 'inactive' ? 'bg-muted' :
                        'bg-destructive'
                      )}>
                        {viewFranchise.status}
                      </Badge>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{viewFranchise.ownerEmail}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{viewFranchise.ownerPhone}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg col-span-2">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{viewFranchise.location}, {viewFranchise.city}, {viewFranchise.state}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="font-semibold text-primary text-xl">{formatCurrency(viewFranchise.totalSales)}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Credit Points</p>
                      <p className="font-semibold text-accent text-xl">{viewFranchise.creditPoints} pts</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Joined Date</p>
                      <p className="font-medium">{viewFranchise.joinedDate}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Agreement End</p>
                      <p className="font-medium">{viewFranchise.agreementEndDate}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editFranchise} onOpenChange={() => setEditFranchise(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Franchise</DialogTitle>
            </DialogHeader>
            {editFranchise && (
              <FranchiseForm
                initialData={editFranchise}
                onSubmit={handleUpdateFranchise}
                isEdit
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

function FranchiseForm({ 
  onSubmit, 
  initialData,
  isEdit = false 
}: { 
  onSubmit: (data: Omit<Franchise, 'id' | 'status' | 'totalSales' | 'creditPoints' | 'joinedDate' | 'agreementEndDate'>) => void;
  initialData?: Franchise;
  isEdit?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    ownerName: initialData?.ownerName || '',
    ownerEmail: initialData?.ownerEmail || '',
    ownerPhone: initialData?.ownerPhone || '',
    location: initialData?.location || '',
    city: initialData?.city || '',
    state: initialData?.state || 'Tamil Nadu'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Franchise name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) newErrors.ownerEmail = 'Invalid email format';
    if (!formData.ownerPhone.trim()) newErrors.ownerPhone = 'Phone is required';
    if (!formData.location.trim()) newErrors.location = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Franchise Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label>Owner Name</Label>
          <Input
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            className={errors.ownerName ? 'border-destructive' : ''}
          />
          {errors.ownerName && <p className="text-xs text-destructive">{errors.ownerName}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
            className={errors.ownerEmail ? 'border-destructive' : ''}
          />
          {errors.ownerEmail && <p className="text-xs text-destructive">{errors.ownerEmail}</p>}
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={formData.ownerPhone}
            onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
            className={errors.ownerPhone ? 'border-destructive' : ''}
          />
          {errors.ownerPhone && <p className="text-xs text-destructive">{errors.ownerPhone}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className={errors.location ? 'border-destructive' : ''}
        />
        {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        {isEdit ? 'Update Franchise' : 'Create Franchise'}
      </Button>
    </form>
  );
}
