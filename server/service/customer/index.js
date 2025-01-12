const CancelBookOrder = require("./cancel-book-order");
const GetOrderDetails = require("./get-order-details");
const CustomerGoogleAuthentication = require("./google-auth-customer");
const OrderBook = require("./order-book");
const SignInCustomer = require("./signin-customer");
const SignUpCustomer = require("./signup-customer");

class CustomerService {}

CustomerService.prototype.SignUpCustomer = SignUpCustomer;
CustomerService.prototype.SignInCustomer = SignInCustomer;
CustomerService.prototype.OrderBook = OrderBook;
CustomerService.prototype.CancelBookOrder = CancelBookOrder;
CustomerService.prototype.GetOrderDetails = GetOrderDetails;
CustomerService.prototype.CustomerGoogleAuthentication = CustomerGoogleAuthentication;
module.exports = CustomerService;
