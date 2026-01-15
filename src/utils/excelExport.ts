// Excel Export Utility
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1') {
  // Create CSV content (simpler than full Excel, works for download)
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Format date for export
export function formatDateForExport(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Generate PDF-like invoice content (as text for now)
export function generateInvoicePDF(invoice: any) {
  const content = `
INVOICE
=====================================
Invoice No: ${invoice.invoiceNumber}
Date: ${invoice.createdAt}
Due Date: ${invoice.dueDate}

From:
Tea & Bakery Central
Chennai, Tamil Nadu

To:
${invoice.franchiseName}

=====================================
Amount Details:
-------------------------------------
Subtotal: ₹${invoice.amount.toLocaleString()}
GST: ₹${invoice.gst.toLocaleString()}
-------------------------------------
Total: ₹${invoice.totalAmount.toLocaleString()}
=====================================

Status: ${invoice.status.toUpperCase()}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${invoice.invoiceNumber}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}
