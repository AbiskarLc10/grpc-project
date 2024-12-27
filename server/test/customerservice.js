const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const {
  CUSTOMER_PROTO_PATH,
  PROTO_LOADER_OPTION,
  PAYMENT_PROTO_PATH,
} = require("../config");
const path = require("path");
const CustomerService = require("../service/CustomerService");
const sequelize = require("../db/connection");
const AuthInteceptor = require("../interceptors/authInterceptor");
const PaymentService = require("../service/PaymentService");
const customerProtoPath = path.resolve(CUSTOMER_PROTO_PATH);
const paymentProtoPath = path.resolve(PAYMENT_PROTO_PATH);

const customerPackageDefinations = protoloader.loadSync(
  customerProtoPath,
  PROTO_LOADER_OPTION
);
const paymentPackageDefinations = protoloader.loadSync(
  paymentProtoPath,
  PROTO_LOADER_OPTION
);

const customerProto = grpc.loadPackageDefinition(customerPackageDefinations);
const paymentProto = grpc.loadPackageDefinition(paymentPackageDefinations);

const customerService = customerProto.customer.CustomerService.service;
const paymentService = paymentProto.payment.PaymentService.service;

const customerserver = new grpc.Server({ interceptors: [AuthInteceptor] });

customerserver.addService(customerService, new CustomerService());
customerserver.addService(paymentService, new PaymentService());


sequelize.authenticate().then(() => {
  console.log("Connected to database Successfully");

  customerserver.bindAsync(
    "localhost:50052",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        return console.log(
          "Failed to connect to grpc server due to ",
          error.cause
        );
      }
      console.log("Grpc server listening at port: ", port);
    }
  );
});
