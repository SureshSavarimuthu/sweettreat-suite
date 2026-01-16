import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Upload, User } from 'lucide-react';
import {
  Employee,
  departments,
  designations,
  getStoredData,
  setStoredData,
  generateId,
  mockEmployees
} from '@/lib/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dob: '',
    bloodGroup: '',
    aadhar: '',
    pan: '',
    bankName: '',
    bankAccount: '',
    bankIfsc: '',
    designation: '',
    department: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    qualification: '',
    location: '',
    locationType: 'admin' as Employee['locationType'],
    address: '',
    salary: 0,
    profilePhoto: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[0-9\s-]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone format';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.aadhar.trim()) newErrors.aadhar = 'Aadhar number is required';
    else if (!/^\d{12}$/.test(formData.aadhar.replace(/\s/g, ''))) newErrors.aadhar = 'Invalid Aadhar (12 digits)';
    if (!formData.pan.trim()) newErrors.pan = 'PAN is required';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) newErrors.pan = 'Invalid PAN format';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.salary <= 0) newErrors.salary = 'Valid salary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({ ...formData, profilePhoto: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const employees = getStoredData<Employee[]>('bakery_employees', mockEmployees);
    const newEmployee: Employee = {
      id: generateId('emp'),
      employeeId: `EMP-${new Date().getFullYear()}-${String(employees.length + 1).padStart(3, '0')}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      department: formData.department,
      location: formData.location,
      locationType: formData.locationType,
      dateOfJoining: formData.dateOfJoining,
      salary: formData.salary,
      status: 'active',
      profilePhoto: formData.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=da7727&color=fff`
    };

    const updated = [...employees, newEmployee];
    setStoredData('bakery_employees', updated);
    toast.success('Employee created successfully!');
    navigate('/employees');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/employees')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Add New Employee</h1>
            <p className="text-muted-foreground">Fill in the details to create a new employee</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Profile Photo</h3>
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewImage} />
                <AvatarFallback>
                  <User className="w-10 h-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </div>
                </Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label>Alternate Phone</Label>
                <Input
                  value={formData.alternatePhone}
                  onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className={errors.dob ? 'border-destructive' : ''}
                />
                {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
              </div>
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(v) => setFormData({ ...formData, bloodGroup: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map(bg => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* ID & Documents */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">ID & Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Aadhar Number *</Label>
                <Input
                  value={formData.aadhar}
                  onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                  placeholder="XXXX XXXX XXXX"
                  className={errors.aadhar ? 'border-destructive' : ''}
                />
                {errors.aadhar && <p className="text-xs text-destructive">{errors.aadhar}</p>}
              </div>
              <div className="space-y-2">
                <Label>PAN Number *</Label>
                <Input
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  placeholder="ABCDE1234F"
                  className={errors.pan ? 'border-destructive' : ''}
                />
                {errors.pan && <p className="text-xs text-destructive">{errors.pan}</p>}
              </div>
              <div className="space-y-2">
                <Label>Qualification</Label>
                <Input
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g., B.Com, MBA"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>IFSC Code</Label>
                <Input
                  value={formData.bankIfsc}
                  onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Designation *</Label>
                <Select value={formData.designation} onValueChange={(v) => setFormData({ ...formData, designation: v })}>
                  <SelectTrigger className={errors.designation ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map(des => (
                      <SelectItem key={des} value={des}>{des}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                  <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
              </div>
              <div className="space-y-2">
                <Label>Date of Joining</Label>
                <Input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Salary (₹) *</Label>
                <Input
                  type="number"
                  value={formData.salary || ''}
                  onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                  className={errors.salary ? 'border-destructive' : ''}
                />
                {errors.salary && <p className="text-xs text-destructive">{errors.salary}</p>}
              </div>
              <div className="space-y-2">
                <Label>Location Type</Label>
                <Select value={formData.locationType} onValueChange={(v) => setFormData({ ...formData, locationType: v as Employee['locationType'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                    <SelectItem value="admin">Admin Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Work Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Kitchen - Anna Nagar"
                  className={errors.location ? 'border-destructive' : ''}
                />
                {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Employee
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
