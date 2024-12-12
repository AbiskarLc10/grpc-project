const customErrorHandler = require("../errors/customError");
const ReviewClient = require("../grpc-client/bookreviewClient");
const z = require("zod");
const validate = require("../utils/validateData");
const { AddReviewSchema } = require("../utils/validationSchema");

const addBookReview = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { bookId } = req.params;
    const { description } = req.body;

    validate({ description }, AddReviewSchema);

    const response = await new Promise((resolve, reject) => {
      ReviewClient.AddBookReview(
        { review: { bookId: bookId, reviewerId: id, description } },
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
      return res
        .status(200)
        .json({
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

module.exports = { addBookReview,deleteReview };
