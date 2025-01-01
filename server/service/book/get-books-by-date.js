const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const sequelize = require("../../db/connection");

const GetBookByDate = async (call, callback) => {
    try {
      const { to, from } = call.request;
      const fromDate = new Date(from);
      const toDate = new Date(to);

      const books = await sequelize.query(
        "SELECT * FROM books WHERE createdAt > ? AND createdAt < ? ORDER BY createdAt DESC",
        {
          replacements: [fromDate, toDate],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (books.length === 0) {
        return callback({
          details: `Books not found between date ${from} and ${to}`,
          code: grpc.status.NOT_FOUND,
        });
      }

      console.log(books);
      return callback(null, { books: books });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to get books",
        code: grpc.status.INTERNAL,
      });
    }
  };

  module.exports = GetBookByDate;