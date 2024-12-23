const grpc = require("@grpc/grpc-js");
const { Book } = require("../db/models/index");
const sequelize = require("../db/connection");
const AuthorClient = require("../grpc-client/author");

class BookService {
  AddBook = async (call, callback) => {
    try {
      const { bookName, published_date, genre, authorId, price, stock } =
        call.request;

      if (!authorId || !bookName || !published_date || !genre || !price) {
        return callback({
          details: "Please provide all book details",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      // const authorData = await new Promise((resolve, reject) => {
      //   AuthorClient.GetAuthorById({ authorId }, (error, response) => {
      //     if (response) {
      //       resolve(response);
      //     }
      //   });
      // });
      // console.log(authorData);
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
        price,
        stock
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

      const foundBooks = await sequelize.query(
        "CALL GetBookByAuthor(:author)",
        {
          replacements: {
            author: author,
          },
        }
      );

      if (foundBooks.length === 0) {
        return callback({
          details: `Books not found for the author`,
          code: grpc.status.NOT_FOUND,
        });
      }

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

  GetBookById = async (call, callback) => {
    try {
      const { bookId } = call.request;

      if (!bookId) {
        return callback({
          details: "Please provide book id",
          code: grpc.status.NOT_FOUND,
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

      return callback(null, { book: book[0] });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to get book",
        code: grpc.status.INTERNAL,
      });
    }
  };

  GetBookByDate = async (call, callback) => {
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

  GetBooksPerPage = async (call, callback) => {
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
}

module.exports = BookService;
