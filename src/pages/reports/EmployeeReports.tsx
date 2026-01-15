import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Download, Calendar, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Employee, mockEmployees, getStoredData, initializeMockData } from '@/lib/mockData';
import { exportToExcel } from '@/utils/excelExport';

export default function EmployeeReports() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    initializeMockData();
    setEmployees(getStoredData('bakery_employees', mockEmployees));
  }, []);

  const filteredEmployees = employees.filter(e => {
    const matchesDept = departmentFilter === 'all' || e.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesDept && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredEmployees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map(e => e.id)));
    }
  };

  const handleExport = (all: boolean) => {
    const toExport = all 
      ? filteredEmployees 
      : filteredEmployees.filter(e => selectedIds.has(e.id));
    
    if (toExport.length === 0) {
      toast.error('No employees selected for export');
      return;
    }

    const exportData = toExport.map(e => ({
      'Employee ID': e.employeeId,
      'Name': e.fullName,
      'Email': e.email,
      'Phone': e.phone,
      'Department': e.department,
      'Designation': e.designation,
      'Location': e.location,
      'Join Date': e.dateOfJoining,
      'Salary': e.salary,
      'Status': e.status
    }));

    exportToExcel(exportData, `Employee_Report_${new Date().toISOString().split('T')[0]}`);
    toast.success(`Exported ${toExport.length} employee records`);
  };

  const departments = [...new Set(employees.map(e => e.department))];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/reports')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">Employee Reports</h1>
            <p className="text-muted-foreground">Generate and export employee data</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => handleExport(false)} disabled={selectedIds.size === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Selected ({selectedIds.size})
              </Button>
              <Button variant="outline" onClick={() => handleExport(true)}>
                Export All
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox 
                    checked={selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="p-4 text-left font-medium">Employee</th>
                <th className="p-4 text-left font-medium">Department</th>
                <th className="p-4 text-left font-medium">Designation</th>
                <th className="p-4 text-left font-medium">Join Date</th>
                <th className="p-4 text-right font-medium">Salary</th>
                <th className="p-4 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="border-t hover:bg-secondary/30">
                  <td className="p-4">
                    <Checkbox 
                      checked={selectedIds.has(emp.id)}
                      onCheckedChange={() => toggleSelect(emp.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{emp.fullName}</p>
                      <p className="text-sm text-muted-foreground">{emp.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-4">{emp.department}</td>
                  <td className="p-4">{emp.designation}</td>
                  <td className="p-4">{emp.dateOfJoining}</td>
                  <td className="p-4 text-right font-medium">₹{emp.salary.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <Badge className={
                      emp.status === 'active' ? 'bg-accent' :
                      emp.status === 'on-leave' ? 'bg-warning text-foreground' :
                      'bg-muted text-muted-foreground'
                    }>
                      {emp.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No employees found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
