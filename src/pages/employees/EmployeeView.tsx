import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign } from 'lucide-react';
import {
  Employee,
  getStoredData,
  mockEmployees
} from '@/lib/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function EmployeeView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const employees = getStoredData<Employee[]>('bakery_employees', mockEmployees);
    const found = employees.find(e => e.id === id);
    setEmployee(found || null);
  }, [id]);

  if (!employee) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Employee not found</p>
        </div>
      </MainLayout>
    );
  }

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/employees')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Employee Details</h1>
              <p className="text-muted-foreground">{employee.employeeId}</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/employees/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Employee
          </Button>
        </div>

        {/* Profile Header */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={employee.profilePhoto} />
              <AvatarFallback className="text-3xl">
                {employee.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground">{employee.fullName}</h2>
              <p className="text-lg text-primary">{employee.designation}</p>
              <p className="text-muted-foreground">{employee.department}</p>
              <Badge className={cn(
                'mt-2',
                employee.status === 'active' ? 'bg-accent' :
                employee.status === 'on-leave' ? 'bg-warning text-foreground' :
                'bg-muted text-muted-foreground'
              )}>
                {employee.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Work Location</p>
                  <p className="font-medium">{employee.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Employment Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Briefcase className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{employee.employeeId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Calendar className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Joining</p>
                  <p className="font-medium">{employee.dateOfJoining}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <DollarSign className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-medium">{formatCurrency(employee.salary)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
