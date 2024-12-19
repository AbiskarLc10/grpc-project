const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const path = require("path");
const { CUSTOMER_PROTO_PATH, PROTO_LOADER_OPTION } = require("../config");

const customerProtoPath = path.resolve(CUSTOMER_PROTO_PATH);

const customerPackageDefinations = protoloader.loadSync(
  customerProtoPath,
  PROTO_LOADER_OPTION
);
const customerProto = grpc.loadPackageDefinition(customerPackageDefinations);

const jwtInterceptor = (options, nextCall) => {
  const requester = new grpc.RequesterBuilder()
    .withStart((metadata, listener, next) => {
      metadata.set("data", "Hello I am abiskar Lamichhane");
      next(metadata, listener);
    })
    .build();
  return new grpc.InterceptingCall(nextCall(options), requester);
};

const CustomerService = customerProto.customer.CustomerService;

const CustomerClient = new CustomerService(
  "localhost:50052",
  grpc.credentials.createInsecure(),
  {
    interceptors: [jwtInterceptor],
  }
);

const test = async () => {
  const response = await new Promise((resolve, reject) => {
    CustomerClient.SignUpCustomer(
      {
        fullName: "Abiskar",
        email: "abdjab",
        password: "dmakndad",
        address: "addresss",
        dateOfBirth: "dnaknd",
      },
      (error, response) => {
        console.log(error);
        if (error) {
          reject(error);
        }
        resolve(response);
      }
    );
  });

  console.log(response);
};

test();
