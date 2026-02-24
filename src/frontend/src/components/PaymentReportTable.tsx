import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useGetAllPayments } from '../hooks/useQueries';
import { Download, Loader2 } from 'lucide-react';
import { exportToExcel } from '../utils/excelExport';
import type { Payment } from '../backend';

export default function PaymentReportTable() {
  const { data: payments, isLoading, error } = useGetAllPayments();

  const handleExport = () => {
    if (payments && payments.length > 0) {
      exportToExcel(payments);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExport} className="h-12 text-base">
          <Download className="mr-2 h-4 w-4" />
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
              <TableHead className="whitespace-nowrap">NEFT Amount</TableHead>
              <TableHead className="whitespace-nowrap">NEFT Date</TableHead>
              <TableHead className="whitespace-nowrap">Bank Name</TableHead>
              <TableHead className="whitespace-nowrap">Cheque Number</TableHead>
              <TableHead className="whitespace-nowrap">Cheque Amount</TableHead>
              <TableHead className="whitespace-nowrap">Cheque Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment: Payment, index: number) => (
              <TableRow key={index}>
                <TableCell>{payment.invoiceNumber.toString()}</TableCell>
                <TableCell>{payment.paymentMode}</TableCell>
                <TableCell>{payment.transactionId || '-'}</TableCell>
                <TableCell>{payment.neftAmount ? payment.neftAmount.toString() : '-'}</TableCell>
                <TableCell>{payment.neftDate || '-'}</TableCell>
                <TableCell>{payment.bankName || '-'}</TableCell>
                <TableCell>{payment.chequeNumber || '-'}</TableCell>
                <TableCell>{payment.chequeAmount ? payment.chequeAmount.toString() : '-'}</TableCell>
                <TableCell>{payment.chequeDate || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
