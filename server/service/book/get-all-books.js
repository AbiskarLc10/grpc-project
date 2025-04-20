const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const {
  AddBooksToRedis,
  CheckBooksInCache,
} = require("../../redisClient/utils");

const GetAllBook = async (call, callback) => {
  try {
    const booksInCache = await CheckBooksInCache("books:all");

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
    return callback({
      details: "Failed to get all books",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = GetAllBook;
