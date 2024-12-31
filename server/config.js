require("dotenv").config();
const AUTHOR_HOST_URL = process.env.AUTHOR_HOST_URL;
const CUSTOMER_HOST_URL = process.env.CUSTOMER_HOST_URL;
const BOOK_PROTO_PATH = "../proto/book.proto";
const AUTHOR_PROTO_PATH = "../proto/author.proto";
const REVIEW_PROTO_PATH = "../proto/review.proto";
const CUSTOMER_PROTO_PATH = "../proto/customer.proto";
const PAYMENT_PROTO_PATH = "../proto/payment.proto";
console.log(AUTHOR_HOST_URL);
console.log(CUSTOMER_HOST_URL);


const PROTO_LOADER_OPTION = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

module.exports = {
  AUTHOR_HOST_URL,
  CUSTOMER_HOST_URL,
  BOOK_PROTO_PATH,
  PROTO_LOADER_OPTION,
  AUTHOR_PROTO_PATH,
  REVIEW_PROTO_PATH,
  CUSTOMER_PROTO_PATH,
  PAYMENT_PROTO_PATH,
};
