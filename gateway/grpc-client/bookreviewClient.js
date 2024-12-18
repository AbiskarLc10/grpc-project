const grpc = require('@grpc/grpc-js');
const protoloader = require("@grpc/proto-loader");
const path = require('path')
const { REVIEW_PROTO_PATH, PROTO_LOADER_OPTION, HOST_URL } = require('../config');

const bookreviewProtoPath = path.resolve(REVIEW_PROTO_PATH)

const bookreviewPackageDefinations = protoloader.loadSync(bookreviewProtoPath,PROTO_LOADER_OPTION);
const bookreviewProto = grpc.loadPackageDefinition(bookreviewPackageDefinations);


const BookReviewService = bookreviewProto.review.ReviewService;
const ReviewClient = new BookReviewService(HOST_URL,grpc.credentials.createInsecure());


module.exports = ReviewClient;
