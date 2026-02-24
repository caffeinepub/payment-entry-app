import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useGetAllPayments, useClearAllPayments } from '../hooks/useQueries';
import { Download, Loader2, Trash2 } from 'lucide-react';
import { exportToExcel } from '../utils/excelExport';
import { formatDate } from '../utils/dateFormat';
import type { Payment } from '../backend';

export default function PaymentReportTable() {
  const { data: payments, isLoading, error } = useGetAllPayments();
  const clearAllPayments = useClearAllPayments();

  const handleExport = () => {
    if (payments && payments.length > 0) {
      exportToExcel(payments);
    }
  };

  const handleClearRecords = () => {
    if (window.confirm('Are you sure you want to clear all payment records? This action cannot be undone.')) {
      clearAllPayments.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading payments: {error.message}
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payment records found. Submit your first payment above.
      </div>
    );
  }

  // Flatten payments for display (one row per payment mode per invoice)
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button 
          onClick={handleClearRecords} 
          variant="destructive"
          size="sm"
          className="h-9 px-3 text-sm"
          disabled={clearAllPayments.isPending}
        >
          {clearAllPayments.isPending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Clearing...
            </>
          ) : (
            <>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Clear Records
            </>
          )}
        </Button>
        <Button 
          onClick={handleExport} 
          size="sm"
          className="h-9 px-3 text-sm"
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download Excel
        </Button>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Invoice Number</TableHead>
              <TableHead className="whitespace-nowrap">Payment Mode</TableHead>
              <TableHead className="whitespace-nowrap">Transaction ID/UTR</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Bank Name</TableHead>
              <TableHead className="whitespace-nowrap">Cheque Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flattenedRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.invoiceNumber.toString()}</TableCell>
                <TableCell>{record.mode}</TableCell>
                <TableCell>{record.transactionId || '-'}</TableCell>
                <TableCell>{record.amount.toString()}</TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>{record.bankName || '-'}</TableCell>
                <TableCell>{record.chequeNumber || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
