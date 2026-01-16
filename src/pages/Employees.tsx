import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Phone, Mail, MapPin, Calendar, Grid, List, Eye, Edit, Power, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Employee,
  mockEmployees,
  departments,
  getStoredData,
  setStoredData,
  initializeMockData
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; employee: Employee | null; action: 'activate' | 'deactivate' }>({
    open: false,
    employee: null,
    action: 'activate'
  });

  useEffect(() => {
    initializeMockData();
    setEmployees(getStoredData('bakery_employees', mockEmployees));
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      e.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesDept = departmentFilter === 'all' || e.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const paginatedEmployees = filteredEmployees.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginatedEmployees.length < filteredEmployees.length;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setPage(prev => prev + 1);
        setIsLoading(false);
      }, 500);
    }
  }, [hasMore, isLoading]);

  const handleToggleStatus = () => {
    if (!confirmDialog.employee) return;
    
    const newStatus = confirmDialog.action === 'activate' ? 'active' : 'inactive';
    const updated = employees.map(e =>
      e.id === confirmDialog.employee!.id ? { ...e, status: newStatus as Employee['status'] } : e
    );
    setEmployees(updated);
    setStoredData('bakery_employees', updated);
    toast.success(`Employee ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    setConfirmDialog({ open: false, employee: null, action: 'activate' });
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Employee Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team ({employees.length} employees)
            </p>
          </div>
          <Button className="gap-2" onClick={() => navigate('/employees/create')}>
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Employee List */}
        {viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  className="bg-card rounded-xl p-5 shadow-card hover:shadow-elevated transition-all"
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="w-16 h-16 mb-3">
                      <AvatarImage src={employee.profilePhoto} />
                      <AvatarFallback>{employee.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-foreground">{employee.fullName}</h3>
                    <p className="text-sm text-primary">{employee.designation}</p>
                    <Badge className={cn(
                      'mt-2',
                      employee.status === 'active' ? 'bg-accent' :
                      employee.status === 'on-leave' ? 'bg-warning text-foreground' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {employee.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{employee.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Joined {employee.dateOfJoining}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/employees/${employee.id}`)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/employees/${employee.id}/edit`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={employee.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => setConfirmDialog({
                        open: true,
                        employee,
                        action: employee.status === 'active' ? 'deactivate' : 'activate'
                      })}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={handleLoadMore} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More (${filteredEmployees.length - paginatedEmployees.length} remaining)`
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Designation</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map(employee => (
                  <tr key={employee.id} className="border-t hover:bg-secondary/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={employee.profilePhoto} />
                          <AvatarFallback>{employee.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.fullName}</p>
                          <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{employee.designation}</td>
                    <td className="p-4">{employee.department}</td>
                    <td className="p-4">{employee.location}</td>
                    <td className="p-4">
                      <Badge className={cn(
                        employee.status === 'active' ? 'bg-accent' :
                        employee.status === 'on-leave' ? 'bg-warning text-foreground' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/employees/${employee.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/employees/${employee.id}/edit`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDialog({
                            open: true,
                            employee,
                            action: employee.status === 'active' ? 'deactivate' : 'activate'
                          })}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'} Employee?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {confirmDialog.action} {confirmDialog.employee?.fullName}?
                {confirmDialog.action === 'deactivate' && ' This employee will no longer have access to the system.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleStatus}
                className={confirmDialog.action === 'deactivate' ? 'bg-destructive hover:bg-destructive/90' : ''}
              >
                {confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
