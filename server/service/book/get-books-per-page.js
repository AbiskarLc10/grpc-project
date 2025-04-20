const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const sequelize = require("../../db/connection");
const {
  AddBooksToRedis,
  CheckDataInRedisDatabase,
} = require("../../redisClient/utils");

const GetBooksPerPage = async (call, callback) => {
  try {
    const { pageNo } = call.request;

    if (!pageNo) {
      return callback({
        details: "Please provide the page number",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const booksInCache = await CheckDataInRedisDatabase(`books:page:${pageNo}`);
    if (booksInCache) {
      return callback(null, {
        books: booksInCache,
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

    await AddBooksToRedis(books, `books:page:${pageNo}`);
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
