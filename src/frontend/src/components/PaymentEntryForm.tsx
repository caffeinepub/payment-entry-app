import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubmitPayment } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import type { PaymentMode } from '../backend';

export default function PaymentEntryForm() {
  const [invoiceNumbers, setInvoiceNumbers] = useState('');
  const [selectedModes, setSelectedModes] = useState<{ neft: boolean; cheque: boolean }>({
    neft: false,
    cheque: false,
  });
  
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

    if (!invoiceNumbers.trim()) {
      alert('Please enter at least one invoice number');
      return;
    }

    if (!selectedModes.neft && !selectedModes.cheque) {
      alert('Please select at least one payment mode');
      return;
    }

    // Parse invoice numbers (comma-separated, can be alphanumeric)
    const invoiceNumbersArray = invoiceNumbers
      .split(',')
      .map(num => num.trim())
      .filter(num => num !== '');

    if (invoiceNumbersArray.length === 0) {
      alert('Please enter valid invoice numbers');
      return;
    }

    // Convert invoice numbers to bigint (extract numeric part or use hash)
    const invoiceNumbersBigInt = invoiceNumbersArray.map(num => {
      // Try to parse as number, if fails use a simple hash
      const parsed = parseInt(num.replace(/\D/g, ''), 10);
      if (isNaN(parsed) || parsed === 0) {
        // Create a simple hash from the string
        let hash = 0;
        for (let i = 0; i < num.length; i++) {
          hash = ((hash << 5) - hash) + num.charCodeAt(i);
          hash = hash & hash; // Convert to 32bit integer
        }
        return BigInt(Math.abs(hash));
      }
      return BigInt(parsed);
    });

    const paymentModes: PaymentMode[] = [];

    // Add NEFT payment mode if selected
    if (selectedModes.neft) {
      if (!transactionId || !neftAmount || !neftDate) {
        alert('Please fill in all NEFT fields');
        return;
      }
      paymentModes.push({
        mode: 'NEFT',
        transactionId,
        amount: BigInt(neftAmount),
        date: neftDate,
        bankName: undefined,
        chequeNumber: undefined,
      });
    }

    // Add Cheque payment mode if selected
    if (selectedModes.cheque) {
      if (!bankName || !chequeNumber || !chequeAmount || !chequeDate) {
        alert('Please fill in all Cheque fields');
        return;
      }
      paymentModes.push({
        mode: 'Cheque',
        transactionId: undefined,
        amount: BigInt(chequeAmount),
        date: chequeDate,
        bankName,
        chequeNumber,
      });
    }
    
    submitPayment({
      invoiceNumbers: invoiceNumbersBigInt,
      paymentModes,
    }, {
      onSuccess: () => {
        // Clear form
        setInvoiceNumbers('');
        setSelectedModes({ neft: false, cheque: false });
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
        <Label htmlFor="invoiceNumbers" className="text-base">
          Invoice Number(s) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="invoiceNumbers"
          type="text"
          value={invoiceNumbers}
          onChange={(e) => setInvoiceNumbers(e.target.value)}
          placeholder="e.g., INV-001, BILL123, 12345 (comma-separated for multiple)"
          required
          className="h-12 text-base"
        />
        <p className="text-sm text-muted-foreground">
          Enter one or more invoice numbers separated by commas. Accepts text and numbers.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">
          Payment Mode(s) <span className="text-destructive">*</span>
        </Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="neft"
              checked={selectedModes.neft}
              onCheckedChange={(checked) => 
                setSelectedModes(prev => ({ ...prev, neft: checked === true }))
              }
            />
            <Label htmlFor="neft" className="text-base font-normal cursor-pointer">
              NEFT
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cheque"
              checked={selectedModes.cheque}
              onCheckedChange={(checked) => 
                setSelectedModes(prev => ({ ...prev, cheque: checked === true }))
              }
            />
            <Label htmlFor="cheque" className="text-base font-normal cursor-pointer">
              Cheque
            </Label>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Select one or both payment modes. Each mode will be recorded separately.
        </p>
      </div>

      {selectedModes.neft && (
        <div className="space-y-6 pt-4 border-t border-border">
          <h3 className="font-medium text-base">NEFT Payment Details</h3>
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
              required={selectedModes.neft}
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
              required={selectedModes.neft}
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
              required={selectedModes.neft}
              className="h-12 text-base"
            />
          </div>
        </div>
      )}

      {selectedModes.cheque && (
        <div className="space-y-6 pt-4 border-t border-border">
          <h3 className="font-medium text-base">Cheque Payment Details</h3>
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
              required={selectedModes.cheque}
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
              required={selectedModes.cheque}
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
              required={selectedModes.cheque}
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
              required={selectedModes.cheque}
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
