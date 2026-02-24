import type { Payment } from '../backend';
import { formatDate } from './dateFormat';

export function exportToExcel(payments: Payment[]) {
  // Flatten payments for export (one row per payment mode per invoice)
  const flattenedRecords = payments.flatMap(payment => 
    payment.invoiceNumbers.flatMap(invoiceNum =>
      payment.paymentModes.map(mode => ({
        invoiceNumber: invoiceNum,
        mode: mode.mode,
        transactionId: mode.transactionId,
        amount: mode.amount,
        date: mode.date,
        bankName: mode.bankName,
        chequeNumber: mode.chequeNumber,
      }))
    )
  );

  // Create CSV content
  const headers = [
    'Invoice Number',
    'Payment Mode',
    'Transaction ID / UTR',
    'Amount',
    'Date',
    'Bank Name',
    'Cheque Number'
  ];

  const rows = flattenedRecords.map(record => [
    record.invoiceNumber.toString(),
    record.mode,
    record.transactionId || '',
    record.amount.toString(),
    formatDate(record.date),
    record.bankName || '',
    record.chequeNumber || ''
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
