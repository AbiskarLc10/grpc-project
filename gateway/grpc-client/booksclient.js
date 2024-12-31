const grpc = require("@grpc/grpc-js");
const protoloader = require("@grpc/proto-loader");
const path = require("path");
const { BOOK_PROTO_PATH, AUTHOR_HOST_URL, PROTO_LOADER_OPTION } = require("../config");
const bookProtoPath = path.resolve(BOOK_PROTO_PATH);

const bookPackageDefination = protoloader.loadSync(
  bookProtoPath,
  PROTO_LOADER_OPTION
);
const bookProto = grpc.loadPackageDefinition(bookPackageDefination);

const BookService = bookProto.book.BookService;

const bookClient = new BookService(AUTHOR_HOST_URL, grpc.credentials.createInsecure());



module.exports = bookClient;
