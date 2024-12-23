const customErrorHandler = require("../errors/customError");
const bookClient = require("../grpc-client/booksclient");
const validate = require("../utils/validateData");
const {
  UpdateBookSchema,
  dateTimeSchema,
  addBookSchema,
} = require("../utils/validationSchema");

const getAllBooks = async (req, res, next) => {
  try {
    const response = await new Promise((resolve, reject) => {
      bookClient.GetAllBook({}, (err, response) => {
        if (err) {
          console.error("Error calling GetAllBook:", err);
          reject({
            details: err.details,
            code: err.code,
          });
        } else {
          resolve(response);
        }
      });
    });

    return res.status(201).json({
      message: "Books fetched successfully",
      books: response.books,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
};

const getbooksByAuthor = async (req, res, next) => {
  try {
    const { author } = req.query;

    console.log(author);
    if (!author) {
      return customErrorHandler(
        {
          details: "Please provide author name",
          code: 400,
        },
        next
      );
    }
    const response = await new Promise((resolve, reject) => {
      bookClient.GetBookByAuthor({ author }, (error, response) => {
        if (error) {
          console.log(error);
          reject({
            details: error.details,
            code: error.code,
          });
        } else {
          resolve(response);
        }
      });
    });

    const books = response.books.map((book, index) => {
      const { author_info, ...rest } = book;
      return rest;
    });
    return res.status(201).json({
      message: "Successfully fetched author books",
      books: books,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
};

const getBookById = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const response = await new Promise((resolve, reject) => {
      bookClient.GetBookById({ bookId }, (error, response) => {
        if (error) {
          console.log(error);
          reject(new Error(error.details || "An unknown error occurred"));
        }

        resolve(response);
      });
    });

    return res.status(201).json({
      message: "Results fetched by book Id",
      book: response.book,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
};

const addBook = async (req, res, next) => {
  try {
    let { bookName, genre, published_date, price } = req.body;
    const { id, isAuthor } = req.user;

    if (!isAuthor) {
      return res.status(401).json({
        message: "Action denied for user access",
        code: 401,
      });
    }
    validate({ ...req.body, genre: genre.toUpperCase() }, addBookSchema);

    const response = await new Promise((resolve, reject) => {
      bookClient.AddBook(
        { bookName, genre, authorId: id, published_date, price },
        (error, response) => {
          if (error) {
            console.log(error);
            reject({
              details: error.details,
              code: error.code,
            });
          }
          resolve(response);
        }
      );
    });

    return res.status(200).json({ message: response.message, success: true });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
};

const deleteBookById = async (req, res, next) => {
  try {
    const { bookId, authorId } = req.params;
    const { id } = req.user;

    if (id !== authorId) {
      return customErrorHandler(
        {
          details: "This action is not allowed",
          code: 403,
        },
        next
      );
    }

    const response = await new Promise((resolve, reject) => {
      bookClient.DeleteBook({ bookId }, (error, response) => {
        if (error) {
          console.log(error);
          reject({
            details: error.details,
            code: error.code,
          });
        }
        resolve(response);
      });
    });

    return res.status(200).json({
      message: "Book deleted Successfully",
      success: response.success,
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
};

const getBookByDate = async (req, res, next) => {
  try {
    let from = new Date(req.body.from);
    let to = req.body.to || new Date();

    validate({ from, to }, dateTimeSchema);

    const response = await new Promise((resolve, reject) => {
      bookClient.GetBookByDate({ from, to }, (error, response) => {
        if (error) {
          console.log(error);
          reject({
            details: error.details,
            code: error.code,
          });
        }
        resolve(response);
      });
    });

    return res.status(200).json({
      ...response,
      message: "Books fetched successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code || 500,
      },
      next
    );
  }
};
const updateBook = async (req, res, next) => {
  try {
    const { bookId, authorId } = req.params;
    const { id } = req.user;
    let { bookName, published_date, genre, price, stock } = req.body;

    if (id !== authorId) {
      return customErrorHandler(
        {
          details: "This action is not allowed",
          code: 403,
        },
        next
      );
    }
    if (genre) genre = genre.toUpperCase();

    validate({ ...req.body }, UpdateBookSchema);
    if (
      !bookName &&
      !authorId &&
      !genre &&
      !published_date &&
      !price &&
      !stock
    ) {
      return res
        .status(400)
        .json({ message: "Please provide field to update", success: false });
    }

    const response = await new Promise((resolve, reject) => {
      bookClient.UpdateBook({ bookId, ...req.body }, (error, response) => {
        if (error) {
          console.log(error);
          reject({
            details: error.details,
            code: error.code,
          });
        }
        resolve(response);
      });
    });

    return res.status(200).json({
      message: response.message,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code || 500,
      },
      next
    );
  }
};

const getBooksByPage = async (req, res, next) => {
  try {
    const { pageNo } = req.params;

    if (!pageNo) {
      return customErrorHandler(
        {
          details: "Page no not provided",
          code: 400,
        },
        next
      );
    }

    const response = await new Promise((resolve, reject) => {
      bookClient.GetBooksPerPage({ pageNo: pageNo }, (error, response) => {
        if (error) {
          console.log(error);
          reject({
            details: error.details,
            code: error.code,
          });
        }
        resolve(response);
      });
    });

    return res.status(201).json({
      ...response,
      success: true,
      message: "Books fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details,
        code: error.code,
      },
      next
    );
  }
};

module.exports = {
  getAllBooks,
  addBook,
  deleteBookById,
  getbooksByAuthor,
  updateBook,
  getBookById,
  getBookByDate,
  getBooksByPage,
};
