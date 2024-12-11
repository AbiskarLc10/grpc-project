const grpc = require("@grpc/grpc-js");
const fs = require("fs/promises");
const path = require("path");
// const Books = require("../dummydata/news.json");
const { Book } = require("../db/models/index");
const sequelize = require("../db/connection");
// const filePath = path.resolve(__dirname, "../dummydata/news.json");

class BookService {
  AddBook = async (call, callback) => {
    try {
      const { bookName, published_date, genre, authorId } = call.request;

      if (!authorId || !bookName || !published_date || !genre) {
        return callback({
          details: "Please provide all book details",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const checkUniqueBookName = await Book.findOne({
        where: {
          bookName: bookName,
        },
      });

      if (checkUniqueBookName) {
        return callback({
          details: "Book with this name already exists",
          code: grpc.status.ALREADY_EXISTS,
        });
      }

      const newBook = await Book.create({
        bookName,
        genre,
        published_date: new Date(published_date).toISOString(),
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
      console.log(error);
      return callback({
        details: "Failed to add book",
        code: grpc.status.INTERNAL,
      });
    }
  };

  UpdateBook = async (call, callback) => {
    try {
      const { bookId, bookName, genre, published_date } = call.request;

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
      // const file = await fs.readFile(filePath, "utf-8");
      // let fileData = JSON.parse(file);

      // const bookToBeDeleted = Books.find((book) => book.bookId === bookId);

      const bookToBeDeleted = await Book.findByPk(bookId);

      if (!bookToBeDeleted) {
        return callback({
          details: "Book not found",
          code: grpc.status.NOT_FOUND,
        });
      }

      const deletedBook = await Book.destroy({
        where: {
          id: bookId,
        },
      });

      if (!deletedBook) {
        return callback({
          details: "Something went wrong",
          code: grpc.status.FAILED_PRECONDITION,
        });
      }

      // fileData = fileData.filter((book) => book.bookId !== bookId);

      // await fs.writeFile(filePath, JSON.stringify(fileData));

      return callback(null, { success: true });
    } catch (error) {
      return callback({
        details: "Failed to  delete book",
        code: grpc.status.INTERNAL,
      });
    }
  };

  GetAllBook = async (call, callback) => {
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

  GetBookByAuthor = async (call, callback) => {
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

      const foundBooks = await sequelize.query(
        `
        SELECT b.id, b.bookName, b.genre,b.published_date, b.authorId, a.name as authorName
        FROM books b
        JOIN authors a ON b.authorId = a.id
        WHERE a.name LIKE :author`,
        {
          replacements: {
            author: `%${author}%`,
          },
        }
      );

      if (foundBooks.length === 0) {
        return callback({
          details: "Book not found for the author name",
          code: grpc.status.NOT_FOUND,
        });
      }

      return callback(null, { books: foundBooks[0] });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to get author books",
        code: grpc.status.INTERNAL,
      });
    }
  };

  GetBookById = async (call, callback) => {
    try {
      const { bookId } = call.request;

      if (!bookId) {
        return callback({
          details: "Please provide book id",
          code: grpc.status.NOT_FOUND,
        });
      }

      const book = await Book.findByPk(bookId);

      if (!book) {
        return callback({
          details: "Book does not exists",
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
