import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Mail, Eye, Check, Receipt } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Invoice,
  mockInvoices,
  getStoredData,
  setStoredData,
  initializeMockData
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    initializeMockData();
    setInvoices(getStoredData('bakery_invoices', mockInvoices));
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.franchiseName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkPaid = (invoiceId: string) => {
    const updated = invoices.map(inv =>
      inv.id === invoiceId ? { ...inv, status: 'paid' as const } : inv
    );
    setInvoices(updated);
    setStoredData('bakery_invoices', updated);
    setSelectedInvoice(null);
    toast.success('Invoice marked as paid');
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(139, 92, 42); // Brown color
    doc.text('Thatha Tea', 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Central Office, Chennai', 20, 32);
    doc.text('Phone: +91 98765 43210', 20, 37);
    
    // Invoice Details
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text('INVOICE', 150, 25);
    
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 35);
    doc.text(`Date: ${invoice.createdAt}`, 150, 42);
    doc.text(`Due Date: ${invoice.dueDate}`, 150, 49);
    
    // Bill To Section
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Bill To:', 20, 60);
    doc.setFontSize(11);
    doc.text(invoice.franchiseName, 20, 67);
    
    // Status
    const statusColors: { [key: string]: [number, number, number] } = {
      paid: [34, 197, 94],
      unpaid: [234, 179, 8],
      partial: [59, 130, 246],
      overdue: [239, 68, 68]
    };
    const color = statusColors[invoice.status] || [100, 100, 100];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(150, 55, 40, 10, 2, 2, 'F');
    doc.setTextColor(255);
    doc.setFontSize(10);
    doc.text(invoice.status.toUpperCase(), 170, 62, { align: 'center' });
    
    // Table
    autoTable(doc, {
      startY: 80,
      head: [['Description', 'Amount']],
      body: [
        ['Products & Services', `₹${invoice.amount.toLocaleString()}`],
        ['GST (18%)', `₹${invoice.gst.toLocaleString()}`],
      ],
      foot: [['Total Amount', `₹${invoice.totalAmount.toLocaleString()}`]],
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 42] },
      footStyles: { fillColor: [139, 92, 42], textColor: [255, 255, 255], fontStyle: 'bold' }
    });
    
    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for your business!', 105, finalY, { align: 'center' });
    doc.text('Payment Terms: Net 30 Days', 105, finalY + 7, { align: 'center' });
    
    // Save
    doc.save(`${invoice.invoiceNumber}.pdf`);
    toast.success(`Downloaded ${invoice.invoiceNumber}.pdf`);
  };

  const handleSendEmail = (invoice: Invoice) => {
    // Simulate email sending
    toast.success(`Invoice ${invoice.invoiceNumber} sent to ${invoice.franchiseName}`);
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-accent';
      case 'unpaid': return 'bg-warning text-foreground';
      case 'partial': return 'bg-info text-white';
      case 'overdue': return 'bg-destructive';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Invoice Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track invoices ({invoices.length} total)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoice List */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Franchise</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t hover:bg-secondary/50"
                  >
                    <td className="p-4 font-medium">{invoice.invoiceNumber}</td>
                    <td className="p-4">{invoice.franchiseName}</td>
                    <td className="p-4">{invoice.createdAt}</td>
                    <td className="p-4 text-right font-semibold text-primary">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice)}
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(invoice)}
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendEmail(invoice)}
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        {invoice.status !== 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkPaid(invoice.id)}
                            title="Mark as Paid"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          )}
        </div>

        {/* Invoice Detail Dialog */}
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-2xl">
            {selectedInvoice && (
              <>
                <DialogHeader>
                  <DialogTitle>Invoice {selectedInvoice.invoiceNumber}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start p-4 bg-secondary/50 rounded-lg">
                    <div>
                      <h3 className="font-display text-xl font-bold text-primary">Thatha Tea</h3>
                      <p className="text-sm text-muted-foreground">Central Office, Chennai</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{selectedInvoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">Date: {selectedInvoice.createdAt}</p>
                      <p className="text-sm text-muted-foreground">Due: {selectedInvoice.dueDate}</p>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Bill To:</p>
                    <p className="font-semibold">{selectedInvoice.franchiseName}</p>
                  </div>

                  {/* Amount Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">GST</span>
                      <span>{formatCurrency(selectedInvoice.gst)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(selectedInvoice.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <span className="font-medium">Status</span>
                    <Badge className={getStatusColor(selectedInvoice.status)}>
                      {selectedInvoice.status}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => handleDownloadPDF(selectedInvoice)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleSendEmail(selectedInvoice)}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    {selectedInvoice.status !== 'paid' && (
                      <Button variant="default" onClick={() => handleMarkPaid(selectedInvoice.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
