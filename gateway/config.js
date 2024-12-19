const HOST_URL = "localhost:50051";
const BOOK_PROTO_PATH = "../proto/book.proto";
const AUTHOR_PROTO_PATH = "../proto/author.proto";
const REVIEW_PROTO_PATH = "../proto/review.proto";
const CUSTOMER_PROTO_PATH = "../proto/customer.proto";
const PROTO_LOADER_OPTION = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

module.exports = {
  HOST_URL,
  CUSTOMER_PROTO_PATH,
  BOOK_PROTO_PATH,
  PROTO_LOADER_OPTION,
  AUTHOR_PROTO_PATH,
  REVIEW_PROTO_PATH
};
