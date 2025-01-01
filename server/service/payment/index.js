const InitiateOrderPayment = require("./initiate-order-payment");
const PaymentCancel = require("./payment-cancel");
const PaymentSuccess = require("./payment-success");

class PaymentService {}

PaymentService.prototype.InitiateOrderPayment = InitiateOrderPayment;
PaymentService.prototype.PaymentSuccess = PaymentSuccess;
PaymentService.prototype.PaymentCancel = PaymentCancel;

module.exports = PaymentService;
