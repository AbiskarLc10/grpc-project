const grpc = require("@grpc/grpc-js");
const { Author } = require("../../db/models/index");
const {
  CheckDataInRedisDatabase,
  AddUserToRedis,
  CheckDataInRedisDatabase,
} = require("../../redisClient/utils");

const GetAuthorById = async (call, callback) => {
  try {
    const { authorId } = call.request;

    console.log(authorId);
    if (!authorId) {
      return callback({
        details: "Failed to get Id from user",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const userInCache = await CheckDataInRedisDatabase(`user:${authorId}`);

    if (userInCache) {
      return callback(null, {
        author: userInCache,
      });
    }
    const authorData = await Author.findByPk(authorId);

    if (!authorData) {
      return callback({
        details: "User does not exists",
        code: grpc.status.NOT_FOUND,
      });
    }

    await AddUserToRedis(authorData, authorId);

    return callback(null, {
      author: authorData,
    });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to get user data",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = GetAuthorById;
