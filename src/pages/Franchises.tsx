import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Phone, Mail, TrendingUp, Award, Eye, Edit, Power } from 'lucide-react';
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

export default function Franchises() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [requests, setRequests] = useState<FranchiseRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);

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

  const handleToggleStatus = (franchise: Franchise) => {
    const newStatus = franchise.status === 'active' ? 'inactive' : 'active';
    const updatedFranchises = franchises.map(f =>
      f.id === franchise.id ? { ...f, status: newStatus as 'active' | 'inactive' } : f
    );
    setFranchises(updatedFranchises);
    setStoredData('bakery_franchises', updatedFranchises);
    toast.success(`Franchise ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString()}`;
  };

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'under_review');

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFranchises.map((franchise, index) => (
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
                      onClick={() => setSelectedFranchise(franchise)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={franchise.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleStatus(franchise)}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4 mt-4">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending requests</p>
              </div>
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
      </div>
    </MainLayout>
  );
}

function FranchiseForm({ onSubmit }: { onSubmit: (data: Omit<Franchise, 'id' | 'status' | 'totalSales' | 'creditPoints' | 'joinedDate' | 'agreementEndDate'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    location: '',
    city: '',
    state: 'Tamil Nadu'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Franchise Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Owner Name</Label>
          <Input
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={formData.ownerPhone}
            onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Create Franchise</Button>
    </form>
  );
}
