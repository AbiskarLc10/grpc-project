const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const {
  AddBooksToRedis,
  CheckDataInRedisDatabase,
} = require("../../redisClient/utils");
const logger = require("../../lib/logger");

const GetAllBook = async (call, callback) => {
  try {
    const booksInCache = await CheckDataInRedisDatabase("books:all");

    if (booksInCache) {
      return callback(null, { books: booksInCache });
    }
    const books = await Book.findAll();

    if (books.length === 0) {
      return callback({
        details: "No books found",
        code: grpc.status.NOT_FOUND,
      });
    }
    await AddBooksToRedis(books, "books:all");
    return callback(null, { books: books });
  } catch (error) {
    console.log(error);
    logger.error(error?.message)
    return callback({
      details: "Failed to get all books",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = GetAllBook;
