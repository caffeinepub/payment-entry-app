import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitPayment } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

export default function PaymentEntryForm() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState<string>('');
  
  // NEFT fields
  const [transactionId, setTransactionId] = useState('');
  const [neftAmount, setNeftAmount] = useState('');
  const [neftDate, setNeftDate] = useState('');
  
  // Cheque fields
  const [bankName, setBankName] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeAmount, setChequeAmount] = useState('');
  const [chequeDate, setChequeDate] = useState('');

  const { mutate: submitPayment, isPending } = useSubmitPayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceNumber || !paymentMode) {
      alert('Please fill in all required fields');
      return;
    }

    if (paymentMode === 'NEFT') {
      if (!transactionId || !neftAmount || !neftDate) {
        alert('Please fill in all NEFT fields');
        return;
      }
    }

    if (paymentMode === 'Cheque') {
      if (!bankName || !chequeNumber || !chequeAmount || !chequeDate) {
        alert('Please fill in all Cheque fields');
        return;
      }
    }

    const invoiceNum = BigInt(invoiceNumber);
    
    submitPayment({
      invoiceNumber: invoiceNum,
      paymentMode,
      transactionId: paymentMode === 'NEFT' ? transactionId : null,
      neftAmount: paymentMode === 'NEFT' ? BigInt(neftAmount) : null,
      neftDate: paymentMode === 'NEFT' ? neftDate : null,
      bankName: paymentMode === 'Cheque' ? bankName : null,
      chequeNumber: paymentMode === 'Cheque' ? chequeNumber : null,
      chequeAmount: paymentMode === 'Cheque' ? BigInt(chequeAmount) : null,
      chequeDate: paymentMode === 'Cheque' ? chequeDate : null,
    }, {
      onSuccess: () => {
        // Clear form
        setInvoiceNumber('');
        setPaymentMode('');
        setTransactionId('');
        setNeftAmount('');
        setNeftDate('');
        setBankName('');
        setChequeNumber('');
        setChequeAmount('');
        setChequeDate('');
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="invoiceNumber" className="text-base">
          Customer Invoice Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="invoiceNumber"
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="Enter invoice number"
          required
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMode" className="text-base">
          Payment Mode <span className="text-destructive">*</span>
        </Label>
        <Select value={paymentMode} onValueChange={setPaymentMode} required>
          <SelectTrigger id="paymentMode" className="h-12 text-base">
            <SelectValue placeholder="Select payment mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEFT">NEFT</SelectItem>
            <SelectItem value="Cheque">Cheque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paymentMode === 'NEFT' && (
        <div className="space-y-6 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="transactionId" className="text-base">
              Transaction ID / UTR Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="transactionId"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neftAmount" className="text-base">
              Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              id="neftAmount"
              type="number"
              value={neftAmount}
              onChange={(e) => setNeftAmount(e.target.value)}
              placeholder="Enter amount"
              required
              min="1"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neftDate" className="text-base">
              Date of Payment <span className="text-destructive">*</span>
            </Label>
            <Input
              id="neftDate"
              type="date"
              value={neftDate}
              onChange={(e) => setNeftDate(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>
        </div>
      )}

      {paymentMode === 'Cheque' && (
        <div className="space-y-6 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="bankName" className="text-base">
              Bank Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bankName"
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chequeNumber" className="text-base">
              Cheque Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="chequeNumber"
              type="text"
              value={chequeNumber}
              onChange={(e) => setChequeNumber(e.target.value)}
              placeholder="Enter cheque number"
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chequeAmount" className="text-base">
              Cheque Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              id="chequeAmount"
              type="number"
              value={chequeAmount}
              onChange={(e) => setChequeAmount(e.target.value)}
              placeholder="Enter amount"
              required
              min="1"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chequeDate" className="text-base">
              Cheque Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="chequeDate"
              type="date"
              value={chequeDate}
              onChange={(e) => setChequeDate(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full h-12 text-base"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Payment'
        )}
      </Button>
    </form>
  );
}
