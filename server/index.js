const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const path = require("path");

//Config data for grpc server and package setup
const {
  BOOK_PROTO_PATH,
  HOST_URL,
  PROTO_LOADER_OPTION,
  AUTHOR_PROTO_PATH,
  REVIEW_PROTO_PATH
} = require("./config");


//Classes for rpc method implementation of BookService, AuthorService and ReviewService
const BookService = require("./service/BookService");
const AuthorService = require("./service/AuthorService");
const ReviewService = require("./service/ReviewService");

//Conection variable
const sequelize = require("./db/connection");

//Protofile paths
const bookProtoPath = path.resolve(BOOK_PROTO_PATH);
const authorProtoPath = path.resolve(AUTHOR_PROTO_PATH);
const reviewProtoPath = path.resolve(REVIEW_PROTO_PATH);


//Package Defination of Proto Files
const packageDefinations = protoloader.loadSync(
  [bookProtoPath, authorProtoPath,reviewProtoPath],
  PROTO_LOADER_OPTION
);

//object instance of packaged definations
const Proto = grpc.loadPackageDefinition(packageDefinations);


const bookService = Proto.book.BookService.service;
const authorService = Proto.author.AuthorService.service;
const reviewService = Proto.review.ReviewService.service;

//Initialized Server
const server = new grpc.Server();

//Adding services to the server
server.addService(bookService, new BookService());
server.addService(authorService, new AuthorService());
server.addService(reviewService, new ReviewService());


sequelize
  .authenticate()
  .then(async() => {
    // await sequelize.sync({alter:true});
    console.log("Connected to database Successfully");
    server.bindAsync(
      HOST_URL,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          console.log(error);
          console.log(`Failed to create grpc server =>  `, error.message);
        } else {
          console.log(`Grpc Server Listening at port ${port}`);
        }
      }
    );
  })
  .catch((error) => {
    console.log("Failed to connect to database", error);
  });
