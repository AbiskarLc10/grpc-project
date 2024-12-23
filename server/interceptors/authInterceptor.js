const grpc = require("@grpc/grpc-js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateMetaData = (tokenData, call) => {
  const token = tokenData.split(" ")[1];

  if (!token) {
    return call.sendStatus({
      details: "Failed to get token",
      code: grpc.status.NOT_FOUND,
    });
  }

  console.log(process.env.PRIVATE_KEY);

  return jwt.verify(token, process.env.PRIVATE_KEY, (error, data) => {
    if (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return call.sendStatus({
          details: error.message,
          code: grpc.status.UNAUTHENTICATED,
        });
      }
      return call.sendStatus({ code: 401, details: "Failed to decode token" });
    }
    return data;
  });
};

const AuthInteceptor = (methodDescriptor, call) => {
  const listener = new grpc.ServerListenerBuilder()
    .withOnReceiveMetadata((metadata, next) => {
      if (
        call.handler.path === "/customer.CustomerService/SignUpCustomer" ||
        call.handler.path === "/customer.CustomerService/SignInCustomer"
      ) {
        return next(metadata);
      } else {
        const authorization = metadata.get("token");
        if (authorization.length === 0) {
          call.sendStatus({
            details: "Token not found",
            code: grpc.status.UNAUTHENTICATED,
          });
        }
        const data = validateMetaData(authorization[0], call);
        if (data) {
          metadata.set("decodedToken", data);
          next(metadata);
        }
      }
    })
    .build();

  const responder = new grpc.ResponderBuilder()
    .withStart((next) => {
      next(listener);
    })
    .build();
  return new grpc.ServerInterceptingCall(call, responder);
};

module.exports = AuthInteceptor;
