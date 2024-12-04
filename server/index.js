const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const path = require("path");
const { BOOK_PROTO_PATH, HOST_URL, PROTO_LOADER_OPTION } = require("./config");
const BookService = require("./service/BookService");

const bookProtoPath = path.resolve(BOOK_PROTO_PATH);

const packageDefinations = protoloader.loadSync(
  bookProtoPath,
  PROTO_LOADER_OPTION
);
const bookProto = grpc.loadPackageDefinition(packageDefinations);
const bookService = bookProto.book.BookService.service;

console.log(bookService)
const server = new grpc.Server();
server.addService(bookService, new BookService());

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
