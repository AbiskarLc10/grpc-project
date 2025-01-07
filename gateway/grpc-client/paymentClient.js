const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const path = require("path");
const {
  PAYMENT_PROTO_PATH,
  PROTO_LOADER_OPTION,
  CUSTOMER_HOST_URL,
} = require("../config");

const paymentProtoPath = path.resolve(PAYMENT_PROTO_PATH);

const paymentPackageDefinations = protoloader.loadSync(
  paymentProtoPath,
  PROTO_LOADER_OPTION
);
const jwtInterceptor = (options, nextCall) => {
  console.log(options);
  const requester = new grpc.RequesterBuilder().withStart(
    (metadata, listener, next) => {
      next(metadata, listener);
    }
  );

  return new grpc.InterceptingCall(nextCall(options), requester);
};

const paymentProto = grpc.loadPackageDefinition(paymentPackageDefinations);

const PaymentService = paymentProto.payment.PaymentService;

const PaymentClient = new PaymentService(
  CUSTOMER_HOST_URL,
  grpc.credentials.createInsecure(),
  {
    interceptors: [jwtInterceptor],
  }
);

module.exports = PaymentClient;
