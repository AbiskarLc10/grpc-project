const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const sequelize = require("../../db/connection");

const GetAllBook = async (call, callback) => {
  try {
    const books = await Book.findAll();

    if (books.length === 0) {
      return callback({
        details: "No books found",
        code: grpc.status.NOT_FOUND,
      });
    }
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