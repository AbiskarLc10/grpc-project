const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const sequelize = require("../../db/connection");

const GetBooksPerPage = async (call, callback) => {
  try {
    const { pageNo } = call.request;

    if (!pageNo) {
      return callback({
        details: "Please provide the page number",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const books = await sequelize.query("CALL GetBookPerPage(:pageno)", {
      replacements: {
        pageno: pageNo,
      },
    });

    if (books.length === 0) {
      return callback({
        details: `No books found for page no ${pageNo}`,
        code: grpc.status.NOT_FOUND,
      });
    }

    return callback(null, {
      books: books,
    });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to get books ",
      code: grpc.status.INTERNAL,
    });
  }
};


module.exports = GetBooksPerPage;