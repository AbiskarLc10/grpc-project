const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const path = require('path')
const { AUTHOR_PROTO_PATH, PROTO_LOADER_OPTION,HOST_URL } = require('../config');

const authorProtoPath = path.resolve(AUTHOR_PROTO_PATH);
const authorPackageDefination = protoloader.loadSync(authorProtoPath,PROTO_LOADER_OPTION);
const authorProto = grpc.loadPackageDefinition(authorPackageDefination);

const AuthorService = authorProto.author.AuthorService;
const AuthorClient = new AuthorService(HOST_URL, grpc.credentials.createInsecure());



module.exports = AuthorClient;