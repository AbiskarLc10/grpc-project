const GetPaymentDetailsById = require("./get-payment-details");
const InitiateOrderPayment = require("./initiate-order-payment");
const PaymentCancel = require("./payment-cancel");
const PaymentSuccess = require("./payment-success");

class PaymentService {}

PaymentService.prototype.InitiateOrderPayment = InitiateOrderPayment;
PaymentService.prototype.PaymentSuccess = PaymentSuccess;
PaymentService.prototype.PaymentCancel = PaymentCancel;
PaymentService.prototype.GetPaymentDetailsById = GetPaymentDetailsById;
module.exports = PaymentService;
