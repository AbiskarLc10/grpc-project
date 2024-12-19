const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const { CUSTOMER_PROTO_PATH, PROTO_LOADER_OPTION } = require("../config");
const path = require("path");
const CustomerService = require("../service/CustomerService");
const sequelize = require("../db/connection");
const customerProtoPath = path.resolve(CUSTOMER_PROTO_PATH);

const customerPackageDefinations = protoloader.loadSync(
  customerProtoPath,
  PROTO_LOADER_OPTION
);
const customerProto = grpc.loadPackageDefinition(customerPackageDefinations);

const customerService = customerProto.customer.CustomerService.service;

const jwtInterceptor = (methodDescriptor, call) => {
  const listener = new grpc.ServerListenerBuilder()
    .withOnReceiveMetadata((metadata, next) => {
      console.log(metadata);

      next(metadata);
    })
    .build();
  const responder = new grpc.ResponderBuilder()
    .withStart((next) => {
      next(listener);
    })
    .build();
  return new grpc.ServerInterceptingCall(call, responder);
};

const customerserver = new grpc.Server({ interceptors: [jwtInterceptor] });

customerserver.addService(customerService, new CustomerService());
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
