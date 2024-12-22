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
  console.log(options);
  const requester = new grpc.RequesterBuilder().withStart(
    (metadata, listener, next) => {
      next(metadata, listener);
    }
  );

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

module.exports = CustomerClient;

// const test = async () => {
//   try {
//     const response = await new Promise((resolve, reject) => {
//       CustomerClient.SignUpCustomer(
//         {
//           fullName: "Abiskar",
//           email: "abdjab",
//           password: "dmakndad",
//           address: "addresss",
//           dateOfBirth: "dnaknd",
//         },
//         (error, response) => {
//           if (error) {
//             reject(error);
//           } else {
//             resolve(response);
//           }
//         }
//       );
//     });

//     console.log(response);
//   } catch (error) {
//     console.error("Error during sign-up:", error);
//   }
// };

// test()
