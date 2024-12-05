const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const path = require("path");
const {
  BOOK_PROTO_PATH,
  HOST_URL,
  PROTO_LOADER_OPTION,
  AUTHOR_PROTO_PATH,
} = require("./config");
const BookService = require("./service/BookService");
const AuthorService = require("./service/AuthorService");

const bookProtoPath = path.resolve(BOOK_PROTO_PATH);
const authorProtoPath = path.resolve(AUTHOR_PROTO_PATH);

const packageDefinations = protoloader.loadSync(
  [bookProtoPath, authorProtoPath],
  PROTO_LOADER_OPTION
);

const Proto = grpc.loadPackageDefinition(packageDefinations);
const bookService = Proto.book.BookService.service;
const authorService = Proto.author.AuthorService.service;

const server = new grpc.Server();
server.addService(bookService, new BookService());
server.addService(authorService, new AuthorService());

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
