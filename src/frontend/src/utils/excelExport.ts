import type { Payment } from '../backend';

export function exportToExcel(payments: Payment[]) {
  // Create CSV content
  const headers = [
    'Invoice Number',
    'Payment Mode',
    'Transaction ID / UTR',
    'NEFT Amount',
    'NEFT Date',
    'Bank Name',
    'Cheque Number',
    'Cheque Amount',
    'Cheque Date'
  ];

  const rows = payments.map(payment => [
    payment.invoiceNumber.toString(),
    payment.paymentMode,
    payment.transactionId || '',
    payment.neftAmount ? payment.neftAmount.toString() : '',
    payment.neftDate || '',
    payment.bankName || '',
    payment.chequeNumber || '',
    payment.chequeAmount ? payment.chequeAmount.toString() : '',
    payment.chequeDate || ''
  ]);

  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `payment_records_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
