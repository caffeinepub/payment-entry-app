import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Payment = {
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

  module Payment {
    public func compare(p1 : Payment, p2 : Payment) : Order.Order {
      Nat.compare(p1.invoiceNumber, p2.invoiceNumber);
    };
  };

  let payments = List.empty<Payment>();

  public shared ({ caller }) func submitPayment(
    invoiceNumber : Nat,
    paymentMode : Text,
    transactionId : ?Text,
    neftAmount : ?Nat,
    neftDate : ?Text,
    bankName : ?Text,
    chequeNumber : ?Text,
    chequeAmount : ?Nat,
    chequeDate : ?Text,
  ) : async () {
    if (invoiceNumber == 0) {
      Runtime.trap("Invoice number cannot be 0");
    };

    let newPayment : Payment = {
      invoiceNumber;
      paymentMode;
      user = caller;
      transactionId;
      neftAmount;
      neftDate;
      bankName;
      chequeNumber;
      chequeAmount;
      chequeDate;
    };

    payments.add(newPayment);
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
        payment.invoiceNumber == invoiceNumber;
      }
    ).toArray().sort();
  };
};
