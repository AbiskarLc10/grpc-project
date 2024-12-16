const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { HOST_URL, AUTHOR_PROTO_PATH, PROTO_LOADER_OPTION } = require('../config');
const path = require('path');

const authorProtoPath=  path.resolve(AUTHOR_PROTO_PATH);

const authorPackageDefinations = protoLoader.loadSync(authorProtoPath,PROTO_LOADER_OPTION);
const authorProto = grpc.loadPackageDefinition(authorPackageDefinations);


const AuthorService = authorProto.author.AuthorService;

const AuthorClient = new AuthorService(HOST_URL,grpc.credentials.createInsecure());


module.exports  = AuthorClient;