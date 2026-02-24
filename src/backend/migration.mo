import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldPayment = {
    invoiceNumber : Nat;
    paymentMode : Text;
    user : Principal;
    transactionId : ?Text;
    neftAmount : ?Nat;
    neftDate : ?Text;
    bankName : ?Text;
    chequeNumber : ?Text;
    chequeAmount : ?Nat;
    chequeDate : ?Text;
  };

  type NewPaymentMode = {
    mode : Text;
    transactionId : ?Text;
    amount : Nat;
    date : Text;
    bankName : ?Text;
    chequeNumber : ?Text;
  };

  type NewPayment = {
    invoiceNumbers : [Nat];
    paymentModes : [NewPaymentMode];
    user : Principal;
  };

  public func run(old : { payments : List.List<OldPayment> }) : { payments : List.List<NewPayment> } {
    let newPayments = old.payments.map<OldPayment, NewPayment>(
      func(oldPayment) {
        let newAmount = switch (oldPayment.paymentMode) {
          case ("NEFT") { oldPayment.neftAmount };
          case ("CHEQUE") { oldPayment.chequeAmount };
          case (_) { null };
        };
        let newDate = switch (oldPayment.paymentMode) {
          case ("NEFT") { oldPayment.neftDate };
          case ("CHEQUE") { oldPayment.chequeDate };
          case (_) { null };
        };

        let newPaymentModes = switch (newAmount, newDate) {
          case (?amount, ?date) {
            [{
              mode = oldPayment.paymentMode;
              transactionId = oldPayment.transactionId;
              amount;
              date;
              bankName = oldPayment.bankName;
              chequeNumber = oldPayment.chequeNumber;
            }];
          };
          case (_) { [] };
        };

        {
          invoiceNumbers = [oldPayment.invoiceNumber];
          paymentModes = newPaymentModes;
          user = oldPayment.user;
        };
      }
    );
    { payments = newPayments };
  };
};
