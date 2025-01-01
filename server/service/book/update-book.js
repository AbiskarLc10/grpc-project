const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const sequelize = require("../../db/connection");

const UpdateBook = async (call, callback) => {
  try {
    const { bookId, bookName, genre, published_date, price } = call.request;

    if (!bookId) {
      return callback({
        details: "Id not provided",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    let newBookData = {};
    if (bookName) newBookData.bookName = bookName;
    if (genre) newBookData.genre = genre;
    if (published_date) newBookData.published_date = published_date;
    if (price) newBookData.price = price;

    const bookExists = await Book.findOne({
      where: {
        id: bookId,
      },
    });

    if (!bookExists) {
      return callback({
        details: "Book not found",
        code: grpc.status.NOT_FOUND,
      });
    }

    const updateBook = await Book.update(newBookData, {
      where: {
        id: bookId,
      },
    });

    if (updateBook[0] === 0) {
      return callback({
        details: "Failed to update the book",
        code: grpc.status.UNKNOWN,
      });
    }

    return callback(null, { message: "Book updated successfully" });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to update book",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = UpdateBook;
