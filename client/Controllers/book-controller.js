const customErrorHandler = require("../errors/customError");
const bookClient = require("../grpc-client/booksclient");

const getAllBooks = async (req, res) => {
  try {
    const response = await new Promise((resolve, reject) => {
      bookClient.GetAllBook({}, (err, response) => {
        if (err) {
          console.error("Error calling GetAllBook:", err);
          reject(new Error(err.details || "An unknown error occurred"));
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
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getbooksByAuthor = async (req, res) => {
  try {
    const { author } = req.params;

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
            code: error.code
          });
        } else {
          resolve(response);
        }
      });
    });

    return res.status(201).json({
      message: "Successfully fetched author books",
      books: response.books,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getBookById = async (req, res) => {
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
    return res.status(500).json({ message: error.message, success: false });
  }
};

const addBook = async (req, res, next) => {
  try {
    const { bookName, genre, published_date } = req.body;
    const { id } = req.user;

    if (!bookName || !genre || !published_date) {
      return res.status(400).json({
        message: "Please provide book name, genre and published date",
        success: false,
      });
    }

    const response = await new Promise((resolve, reject) => {
      bookClient.AddBook(
        { bookName, genre, authorId: id, published_date },
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

const deleteBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    const response = await new Promise((resolve, reject) => {
      bookClient.DeleteBook({ bookId }, (error, response) => {
        if (error) {
          console.log(error);
          reject(new Error(error.details || " An unknown error occurred"));
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
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const { bookName, author, genre } = req.body;

    if (!bookName && !author && !genre) {
      return res
        .status(400)
        .json({ message: "Please provide field to update", success: false });
    }

    const response = await new Promise((resolve, reject) => {
      bookClient.UpdateBook({ bookId, ...req.body }, (error, response) => {
        if (error) {
          console.log(error);
          reject(new Error(error.details || "An unknown error occurred"));
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
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  getAllBooks,
  addBook,
  deleteBookById,
  getbooksByAuthor,
  updateBook,
  getBookById,
};
