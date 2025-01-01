const grpc = require("@grpc/grpc-js");
const { Review, Book } = require("../../db/models/index.js");

const DeleteBookReview = async (call, callback) => {
  try {
    const { bookId, reviewerId, reviewId } = call.request;

    if (!bookId || !reviewId || !reviewerId) {
      return callback({
        details: "Insufficient arguments",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const findBook = await Book.findOne({
      where: {
        id: bookId,
      },
    });

    if (!findBook) {
      return callback({
        details: "Book doesn't exists",
        code: 404,
      });
    }

    const deleteReview = await Review.destroy({
      where: {
        id: reviewId,
        reviewerId: reviewerId,
        bookId: bookId,
      },
    });

    if (!deleteReview) {
      return callback({
        details: "Failed to delete review",
        code: grpc.status.UNKNOWN,
      });
    }

    return callback(null, {
      success: true,
    });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to delete review",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = DeleteBookReview;
