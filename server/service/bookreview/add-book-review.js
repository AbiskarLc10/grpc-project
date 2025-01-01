const grpc = require("@grpc/grpc-js");
const { Review, Book } = require("../../db/models/index.js");
const sequelize = require("../../db/connection.js");

const AddBookReview = async (call, callback) => {
  const transaction = await sequelize.transaction();
  try {
    const { reviewerId, bookId, description, ratings, reviewerType } =
      call.request.review;

    if (!reviewerId || !bookId || !description || !ratings) {
      return callback({
        details: "Argument missing",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    if (ratings < 1 || ratings > 5) {
      return callback({
        details: "Ratings must be between 1 and 5",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const checkBookExists = await Book.findOne({
      where: {
        id: bookId,
      },
    });

    if (!checkBookExists) {
      return callback({
        details: "Book does not exist",
        code: grpc.status.NOT_FOUND,
      });
    }

    const newBookReview = await Review.create(
      {
        reviewerId: reviewerId,
        bookId: bookId,
        description: description,
        ratings: ratings,
        reviewerType,
      },
      {
        transaction: transaction,
      }
    );

    if (!newBookReview) {
      return callback({
        details: "Something went wrong",
        code: grpc.status.UNKNOWN,
      });
    }

    await sequelize.query(
      `UPDATE books
        SET average_ratings = (
          SELECT AVG(ratings) 
          FROM reviews 
          WHERE bookId = :bookId
        )
        WHERE id = :bookId`,
      {
        replacements: { bookId: bookId },
        transaction: transaction,
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    await transaction.commit();

    return callback(null, {
      message: "Added review successfully",
      bookName: checkBookExists.bookName,
      description: description,
      ratings: ratings,
      reviewerType,
    });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return callback({
      details: error.errors[0]?.message || "Failed to add review to the book",
      code: grpc.status.INTERNAL,
    });
  }
};


module.exports = AddBookReview;