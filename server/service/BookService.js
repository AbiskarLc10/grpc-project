const grpc = require("@grpc/grpc-js");
const fs = require("fs/promises");
const path = require("path");
const Books = require("../dummydata/news.json");
const { Book } = require("../db/models/index");
const filePath = path.resolve(__dirname, "../dummydata/news.json");
class BookService {
  AddBook = async (call, callback) => {
    try {
      const { book, authorId } = call.request;

      if (!book) {
        return callback({
          details: "Please provide book details",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const newBook = await Book.create({
        ...book,
        authorId: authorId,
      });

      if (!newBook) {
        return callback({
          details: "Failed to create book",
          code: grpc.status.RESOURCE_EXHAUSTED,
        });
      }

      return callback(null, {
        message: "Book Added successfully",
      });

      // const data = await fs.readFile(filePath, "utf-8");

      // let fileData = JSON.parse(data);

      // fileData = [...fileData, book];

      // await fs.writeFile(filePath, JSON.stringify(fileData), "utf-8");

      // return callback(null, { message: "Book Added successfully" });
    } catch (error) {
      return callback({
        details: "Failed to add book",
        code: grpc.status.INTERNAL,
      });
    }
  };

  UpdateBook = async (call, callback) => {
    try {
      const { bookId, bookName, genre, author } = call.request;

      if (!bookId) {
        return callback({
          details: "Id not provided",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      let newBookData = {};
      if (bookName) newBookData.bookName = bookName;
      if (genre) newBookData.genre = genre;
      if (author) newBookData.author = author;

      const file = await fs.readFile(filePath, "utf-8");
      let fileData = JSON.parse(file);

      let bookFound = false;
      fileData = fileData.map((book) => {
        if (book.bookId === bookId) {
          bookFound = true;
          return { ...book, ...newBookData };
        }
        return book;
      });

      if (!bookFound) {
        return callback({
          details: "Book not found",
          code: grpc.status.NOT_FOUND,
        });
      }

      await fs.writeFile(filePath, JSON.stringify(fileData, null, 2));

      callback(null, { message: "Book updated successfully" });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to update book",
        code: grpc.status.INTERNAL,
      });
    }
  };

  DeleteBook = async (call, callback) => {
    try {
      const { bookId } = call.request;

      console.log(bookId);
      if (!bookId) {
        return callback({
          details: "Please provide book id to delete",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const file = await fs.readFile(filePath, "utf-8");
      let fileData = JSON.parse(file);

      const bookToBeDeleted = Books.find((book) => book.bookId === bookId);

      if (!bookToBeDeleted) {
        return callback({
          details: "Book not found",
          code: grpc.status.NOT_FOUND,
        });
      }

      fileData = fileData.filter((book) => book.bookId !== bookId);

      await fs.writeFile(filePath, JSON.stringify(fileData));

      return callback(null, { success: true });
    } catch (error) {
      return callback({
        details: "Failed to add delete",
        code: grpc.status.INTERNAL,
      });
    }
  };
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
