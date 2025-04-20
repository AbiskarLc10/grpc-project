const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");
const {
  AddBooksToRedis,
  CheckDataInRedisDatabase,
} = require("../../redisClient/utils");

const GetBookByAuthor = async (call, callback) => {
  try {
    let { author } = call.request;

    console.log(author);
    if (!author) {
      return callback({
        details: "Author name not provided",
        code: grpc.status.NOT_FOUND,
      });
    }

    author = author.replace(/\s/g, "").toLowerCase();

    // const foundBooks = await sequelize.query(
    //   `
    //   SELECT b.id, b.bookName, b.genre,b.published_date, b.authorId, a.name as authorName
    //   FROM books b
    //   JOIN authors a ON b.authorId = a.id
    //   WHERE a.name LIKE :author`,
    //   {
    //     replacements: {
    //       author: `%${author}%`,
    //     },
    //   }
    // );
    const booksInCache = await CheckDataInRedisDatabase(`books:author:${author}`);

    if (booksInCache) {
      return callback(null, { books: booksInCache });
    }

    const foundBooks = await sequelize.query("CALL GetBookByAuthor(:author)", {
      replacements: {
        author: author,
      },
    });

    if (foundBooks.length === 0) {
      return callback({
        details: `Books not found for the author`,
        code: grpc.status.NOT_FOUND,
      });
    }

    await AddBooksToRedis(foundBooks, `books:author:${author}`);

    return callback(null, { books: foundBooks });
    // if (foundBooks[0].length === 0) {
    //   return callback({
    //     details: "Book not found for the author name",
    //     code: grpc.status.NOT_FOUND,
    //   });
    // }

    // return callback(null, { books: foundBooks[0] });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to get author books",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = GetBookByAuthor;
