const grpc = require("@grpc/grpc-js");
const Books = require("../dummydata/news.json");

class BookService {
  GetAllBook = (call, callback) => {
    try {
      return callback(null, { books: Books });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to get all users",
        code: grpc.status.INTERNAL,
      });
    }
  };

  GetBookByAuthor = (call, callback) => {
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

      const foundBooks = Books.filter((book) => {
        return book.author.replace(/\s/g, "").toLowerCase() === author;
      });

      if (foundBooks.length === 0) {
        return callback({
          details: "Book not found for the author",
          code: grpc.status.NOT_FOUND,
        });
      }

      return callback(null, { books: foundBooks });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to get author books",
        code: grpc.status.INTERNAL,
      });
    }
  };

  GetBookById = (call, callback) => {
    try {
      const { bookId } = call.request;

      if (!bookId) {
        return callback({
          details: "Please provide book id",
          code: grpc.status.NOT_FOUND,
        });
      }

      const book = Books.find((book) => book.bookId === bookId);

      if (!book) {
        return callback({
          details: "Book not found",
          code: grpc.status.NOT_FOUND,
        });
      }

      return callback(null, { book });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to get book",
        code: grpc.status.INTERNAL,
      });
    }
  };
}

module.exports = BookService;
