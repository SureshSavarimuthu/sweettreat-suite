import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Store } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Franchise, mockFranchises, getStoredData, initializeMockData } from '@/lib/mockData';
import { exportToExcel } from '@/utils/excelExport';

export default function FranchiseReports() {
  const navigate = useNavigate();
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    initializeMockData();
    setFranchises(getStoredData('bakery_franchises', mockFranchises));
  }, []);

  const filteredFranchises = franchises.filter(f => 
    statusFilter === 'all' || f.status === statusFilter
  );

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredFranchises.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredFranchises.map(f => f.id)));
  };

  const handleExport = (all: boolean) => {
    const toExport = all ? filteredFranchises : filteredFranchises.filter(f => selectedIds.has(f.id));
    if (toExport.length === 0) {
      toast.error('No franchises selected for export');
      return;
    }

    const exportData = toExport.map(f => ({
      'Name': f.name,
      'Owner': f.ownerName,
      'Email': f.ownerEmail,
      'Phone': f.ownerPhone,
      'City': f.city,
      'State': f.state,
      'Total Sales': f.totalSales,
      'Credit Points': f.creditPoints,
      'Join Date': f.joinedDate,
      'Status': f.status
    }));

    exportToExcel(exportData, `Franchise_Report_${new Date().toISOString().split('T')[0]}`);
    toast.success(`Exported ${toExport.length} franchise records`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/reports')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">Franchise Reports</h1>
            <p className="text-muted-foreground">Generate and export franchise performance data</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => handleExport(false)} disabled={selectedIds.size === 0}>
            <Download className="w-4 h-4 mr-2" />Export Selected ({selectedIds.size})
          </Button>
          <Button variant="outline" onClick={() => handleExport(true)}>Export All</Button>
        </div>

        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="p-4 text-left"><Checkbox checked={selectedIds.size === filteredFranchises.length && filteredFranchises.length > 0} onCheckedChange={toggleAll} /></th>
                <th className="p-4 text-left font-medium">Franchise</th>
                <th className="p-4 text-left font-medium">Owner</th>
                <th className="p-4 text-left font-medium">Location</th>
                <th className="p-4 text-right font-medium">Total Sales</th>
                <th className="p-4 text-right font-medium">Credit Points</th>
                <th className="p-4 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFranchises.map(f => (
                <tr key={f.id} className="border-t hover:bg-secondary/30">
                  <td className="p-4"><Checkbox checked={selectedIds.has(f.id)} onCheckedChange={() => toggleSelect(f.id)} /></td>
                  <td className="p-4 font-medium">{f.name}</td>
                  <td className="p-4">{f.ownerName}</td>
                  <td className="p-4">{f.city}, {f.state}</td>
                  <td className="p-4 text-right font-medium text-primary">₹{f.totalSales.toLocaleString()}</td>
                  <td className="p-4 text-right">{f.creditPoints} pts</td>
                  <td className="p-4 text-center">
                    <Badge className={f.status === 'active' ? 'bg-accent' : f.status === 'suspended' ? 'bg-destructive' : 'bg-muted text-muted-foreground'}>
                      {f.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFranchises.length === 0 && (
            <div className="text-center py-12">
              <Store className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No franchises found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
