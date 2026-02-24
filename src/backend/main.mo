import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  type PaymentMode = {
    mode : Text;
    transactionId : ?Text;
    amount : Nat;
    date : Text;
    bankName : ?Text;
    chequeNumber : ?Text;
  };

  type Payment = {
    invoiceNumbers : [Nat];
    paymentModes : [PaymentMode];
    user : Principal;
  };

  module Payment {
    public func compare(p1 : Payment, p2 : Payment) : Order.Order {
      let firstInvoice1 = if (p1.invoiceNumbers.size() > 0) { p1.invoiceNumbers[0] } else { 0 };
      let firstInvoice2 = if (p2.invoiceNumbers.size() > 0) { p2.invoiceNumbers[0] } else { 0 };
      Nat.compare(firstInvoice1, firstInvoice2);
    };
  };

  let payments = List.empty<Payment>();

  public shared ({ caller }) func submitPayment(
    invoiceNumbers : [Nat],
    paymentModes : [PaymentMode],
  ) : async () {
    if (invoiceNumbers.size() == 0) {
      Runtime.trap("At least one invoice number must be provided");
    };

    if (paymentModes.size() == 0) {
      Runtime.trap("At least one payment mode must be provided");
    };

    let newPayment : Payment = {
      invoiceNumbers;
      paymentModes;
      user = caller;
    };

    payments.add(newPayment);
  };

  public shared ({ caller }) func clearAllPayments() : async () {
    payments.clear();
  };

  public query ({ caller }) func getAllPayments() : async [Payment] {
    payments.toArray().sort();
  };

  public query ({ caller }) func getPaymentsByUser(user : Principal) : async [Payment] {
    payments.filter(
      func(payment) {
        payment.user == user;
      }
    ).toArray().sort();
  };

  public query ({ caller }) func getPaymentsByInvoiceNumber(invoiceNumber : Nat) : async [Payment] {
    payments.filter(
      func(payment) {
        payment.invoiceNumbers.any(
          func(i) {
            i == invoiceNumber;
          }
        );
      }
    ).toArray().sort();
  };

  public query ({ caller }) func getPaymentsByMode(mode : Text) : async [Payment] {
    payments.filter(
      func(payment) {
        payment.paymentModes.any(
          func(m) {
            m.mode == mode;
          }
        );
      }
    ).toArray().sort();
  };
};
