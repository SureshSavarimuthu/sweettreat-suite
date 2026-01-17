import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Search, Calendar, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Attendance as AttendanceType, Employee, getStoredData, setStoredData, initializeMockData } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { exportToExcel } from '@/utils/excelExport';

export default function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    initializeMockData();
    const storedEmployees = getStoredData('bakery_employees', []);
    setEmployees(storedEmployees);
    
    // Generate attendance from employees
    const storedAttendance = getStoredData('bakery_attendance', []);
    if (storedAttendance.length === 0 && storedEmployees.length > 0) {
      const generatedAttendance: AttendanceType[] = storedEmployees.map((emp: Employee, index: number) => ({
        id: `att-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        date: selectedDate,
        checkIn: index % 4 === 1 ? null : `0${8 + (index % 2)}:${index % 60 < 10 ? '0' : ''}${index % 60}`,
        checkOut: index % 4 === 1 ? null : `${17 + (index % 2)}:${30 + (index % 30)}`,
        status: index % 4 === 0 ? 'present' : index % 4 === 1 ? 'absent' : index % 4 === 2 ? 'half-day' : 'leave'
      }));
      setStoredData('bakery_attendance', generatedAttendance);
      setAttendance(generatedAttendance);
    } else {
      setAttendance(storedAttendance);
    }
  }, [selectedDate]);

  const filteredAttendance = attendance.filter(att => {
    const matchesSearch = att.employeeName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || att.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    halfDay: attendance.filter(a => a.status === 'half-day').length,
    leave: attendance.filter(a => a.status === 'leave').length,
  };

  const getStatusBadge = (status: AttendanceType['status']) => {
    const styles = {
      present: 'bg-accent',
      absent: 'bg-destructive',
      'half-day': 'bg-warning text-foreground',
      leave: 'bg-info text-white'
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const handleStatusChange = (attId: string, newStatus: AttendanceType['status']) => {
    const updated = attendance.map(att =>
      att.id === attId ? { ...att, status: newStatus } : att
    );
    setAttendance(updated);
    setStoredData('bakery_attendance', updated);
    toast.success('Attendance status updated');
  };

  const handleExport = () => {
    const exportData = filteredAttendance.map(att => ({
      'Employee Name': att.employeeName,
      'Date': att.date,
      'Check In': att.checkIn || '-',
      'Check Out': att.checkOut || '-',
      'Status': att.status.charAt(0).toUpperCase() + att.status.slice(1)
    }));
    
    exportToExcel(exportData, `Attendance_${selectedDate}`);
    toast.success('Attendance exported to Excel successfully!');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground">Track and manage employee attendance</p>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <UserCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.present}</p>
                <p className="text-sm text-muted-foreground">Present</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-xl p-4 border border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <UserX className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.absent}</p>
                <p className="text-sm text-muted-foreground">Absent</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-warning/20 to-warning/5 rounded-xl p-4 border border-warning/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.halfDay}</p>
                <p className="text-sm text-muted-foreground">Half-Day</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-info/20 to-info/5 rounded-xl p-4 border border-info/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/20 rounded-lg">
                <Calendar className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.leave}</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="half-day">Half-Day</SelectItem>
              <SelectItem value="leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attendance Table */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-4 text-left font-medium">Employee</th>
                  <th className="p-4 text-center font-medium">Check In</th>
                  <th className="p-4 text-center font-medium">Check Out</th>
                  <th className="p-4 text-center font-medium">Status</th>
                  <th className="p-4 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No attendance records found. Add employees first.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map(att => (
                    <tr key={att.id} className="border-t hover:bg-secondary/50">
                      <td className="p-4 font-medium">{att.employeeName}</td>
                      <td className="p-4 text-center">{att.checkIn || '-'}</td>
                      <td className="p-4 text-center">{att.checkOut || '-'}</td>
                      <td className="p-4 text-center">{getStatusBadge(att.status)}</td>
                      <td className="p-4 text-center">
                        <Select
                          value={att.status}
                          onValueChange={(value) => handleStatusChange(att.id, value as AttendanceType['status'])}
                        >
                          <SelectTrigger className="w-32 mx-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="half-day">Half-Day</SelectItem>
                            <SelectItem value="leave">Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
