const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");
const {
  CheckBooksInCache,
  AddBooksToRedis,
} = require("../../redisClient/utils");

const GetBookById = async (call, callback) => {
  try {
    const { bookId } = call.request;

    if (!bookId) {
      return callback({
        details: "Please provide book id",
        code: grpc.status.NOT_FOUND,
      });
    }

    const bookInCache = await CheckBooksInCache(`books:${bookId}`);
    if (bookInCache) {
      return callback(null, {
        book: bookInCache,
      });
    }
    // const book = await Book.findByPk(bookId);
    const book = await sequelize.query("CALL GetBookById(:bookId)", {
      replacements: {
        bookId: bookId,
      },
    });
    console.log(book);
    if (book.length === 0) {
      return callback({
        details: "Book does not exists",
        code: grpc.status.NOT_FOUND,
      });
    }

    await AddBooksToRedis(book, `books:${bookId}`);

    return callback(null, { book: book[0] });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to get book",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = GetBookById;
