const customErrorHandler = require("../errors/customError");
const ReviewClient = require("../grpc-client/bookreviewClient");
const z = require("zod");
const validate = require("../utils/validateData");
const { reviewSchema } = require("../utils/validationSchema");

const addBookReview = async (req, res, next) => {
  try {
    const { id, isAuthor } = req.user;
    const { bookId } = req.params;
    const { description, ratings } = req.body;

    validate({ description, ratings }, reviewSchema);

    const response = await new Promise((resolve, reject) => {
      ReviewClient.AddBookReview(
        {
          review: {
            bookId: bookId,
            reviewerId: id,
            description,
            ratings,
            reviewerType: isAuthor ? 1 : 0,
          },
        },
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

    console.log(response);

    return res.status(201).json({ success: true, ...response });
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

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { bookId, reviewId } = req.params;

    if (!bookId || !reviewId) {
      return customErrorHandler({
        details: "Ids not provided",
        code: 400,
      });
    }

    const response = await new Promise((resolve, reject) => {
      ReviewClient.DeleteBookReview(
        { bookId: bookId, reviewerId: id, reviewId },
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

    if (response.success) {
      return res.status(200).json({
        message: "Review deleted Successfully",
        success: response.success,
      });
    }
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

const editBookReview = async (req, res, next) => {
  try {
    const { bookId, reviewId } = req.params;
    const { id } = req.user;
    const { description } = req.body;
    validate({ description }, reviewSchema);

    const response = await new Promise((resolve, reject) => {
      ReviewClient.EditBookReview(
        { bookId, reviewId, reviewerId: id, description },
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

    return res.status(200).json(response);
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

const getBookReviewsById = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const response = await new Promise((resolve, reject) => {
      ReviewClient.GetAllReviews({ bookId }, (error, response) => {
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

    console.log(response);
    return res.status(201).json({
      ...response,
      message: "Book reviews fetched successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler({
      details: error.details || error.message,
      code: error.code,
    });
  }
};

module.exports = {
  addBookReview,
  deleteReview,
  editBookReview,
  getBookReviewsById,
};
