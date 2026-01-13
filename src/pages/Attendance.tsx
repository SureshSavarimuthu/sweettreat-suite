import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { Attendance as AttendanceType, mockAttendance, mockEmployees, getStoredData, initializeMockData } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    initializeMockData();
    setAttendance(getStoredData('bakery_attendance', mockAttendance));
  }, []);

  const getStatusBadge = (status: AttendanceType['status']) => {
    const styles = {
      present: 'bg-accent', absent: 'bg-destructive',
      'half-day': 'bg-warning text-foreground', leave: 'bg-info text-white'
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const handleExport = () => toast.success('Attendance exported to Excel');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">Date: {selectedDate}</p>
          </div>
          <Button onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>

        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4 text-center">Check In</th>
                <th className="p-4 text-center">Check Out</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(att => (
                <tr key={att.id} className="border-t">
                  <td className="p-4 font-medium">{att.employeeName}</td>
                  <td className="p-4 text-center">{att.checkIn || '-'}</td>
                  <td className="p-4 text-center">{att.checkOut || '-'}</td>
                  <td className="p-4 text-center">{getStatusBadge(att.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
