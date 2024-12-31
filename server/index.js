const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const path = require("path");

//Config data for grpc server and package setup
const {
  BOOK_PROTO_PATH,
  AUTHOR_HOST_URL,
  PROTO_LOADER_OPTION,
  AUTHOR_PROTO_PATH,
  REVIEW_PROTO_PATH,
  CUSTOMER_PROTO_PATH,
  CUSTOMER_HOST_URL,
  PAYMENT_PROTO_PATH,
} = require("./config");

console.log(AUTHOR_HOST_URL);
console.log(CUSTOMER_HOST_URL);

//Classes for rpc method implementation of BookService, AuthorService and ReviewService
const BookService = require("./service/BookService");
const AuthorService = require("./service/AuthorService");
const ReviewService = require("./service/ReviewService");
const CustomerService = require("./service/CustomerService");
const PaymentService = require("./service/PaymentService");

//Conection variable
const sequelize = require("./db/connection");
const AuthInteceptor = require("./interceptors/authInterceptor");

//Protofile paths
const bookProtoPath = path.resolve(BOOK_PROTO_PATH);
const authorProtoPath = path.resolve(AUTHOR_PROTO_PATH);
const reviewProtoPath = path.resolve(REVIEW_PROTO_PATH);
const customerProtoPath = path.resolve(CUSTOMER_PROTO_PATH);
const paymentProtoPath = path.resolve(PAYMENT_PROTO_PATH);

//Package Defination of Proto Files
const packageDefinations = protoloader.loadSync(
  [
    bookProtoPath,
    authorProtoPath,
    reviewProtoPath,
    customerProtoPath,
    paymentProtoPath,
  ],
  PROTO_LOADER_OPTION
);

console.log(typeof packageDefinations);

//object instance of packaged definations
const Proto = grpc.loadPackageDefinition(packageDefinations);

const bookService = Proto.book.BookService.service;
const authorService = Proto.author.AuthorService.service;
const reviewService = Proto.review.ReviewService.service;
const customerService = Proto.customer.CustomerService.service;
const paymentService = Proto.payment.PaymentService.service;

//Initialized Server
const server = new grpc.Server();

const customerServer = new grpc.Server({
  interceptors: [AuthInteceptor],
});

//Adding services to the server
server.addService(bookService, new BookService());
server.addService(authorService, new AuthorService());
server.addService(reviewService, new ReviewService());

//adding service to customer server
customerServer.addService(customerService, new CustomerService());
customerServer.addService(paymentService, new PaymentService());

sequelize
  .authenticate()
  .then(async () => {
    // await sequelize.sync({alter:true});
    console.log("Connected to database Successfully");
    server.bindAsync(
      AUTHOR_HOST_URL,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          console.log(error);
          console.log(`Failed to create grpc server =>  `, error.message);
        } else {
          console.log(`Author Server Listening at port ${port}`);
        }
      }
    );
    customerServer.bindAsync(
      CUSTOMER_HOST_URL,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          console.log(error);
          console.log("Failed to connect to customer server ", error.cause);
        } else {
          console.log(`Customer server listening at port ${port}`);
        }
      }
    );
  })
  .catch((error) => {
    console.log("Failed to connect to database", error);
  });
