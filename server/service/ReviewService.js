const grpc = require("@grpc/grpc-js");
const { Review, Book } = require("../db/models/index.js");
const sequelize = require("../db/connection.js");
class ReviewService {
  AddBookReview = async (call, callback) => {
    try {
      const { reviewerId, bookId, description, ratings } = call.request.review;

      if (!reviewerId || !bookId || !description) {
        return callback({
          details: "Argument missing",
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
          details: "Book does not exists",
          code: grpc.status.NOT_FOUND,
        });
      }

      const newBookReview = await Review.create({
        reviewerId: reviewerId,
        bookId: bookId,
        description: description,
        ratings: ratings,
      });

      console.log(newBookReview);
      if (!newBookReview) {
        return callback({
          details: "Something went wrong",
          code: grpc.status.UNKNOWN,
        });
      }

      return callback(null, {
        message: "Added Review Successfully",
        bookName: checkBookExists.bookName,
        description: description,
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to add review to the book",
        code: grpc.status.INTERNAL,
      });
    }
  };

  DeleteBookReview = async (call, callback) => {
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

  EditBookReview = async (call, callback) => {
    try {
      const { reviewerId, bookId, reviewId, description, ratings } =
        call.request;

      if (!reviewerId || !bookId || !reviewId) {
        return callback({
          details: "Insufficient data received",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const [findBook, _] = await sequelize.query(
        "SELECT * FROM books WHERE id= ?",
        {
          replacements: [bookId],
          raw: true,
        }
      );

      if (findBook.length !== 1) {
        return callback({
          details: "Book not found",
          code: grpc.status.NOT_FOUND,
        });
      }

      if (!description || !ratings) {
        return callback({
          details: "None of the data to update",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const [__, updateBookResult] = await sequelize.query(
        `UPDATE reviews SET ${
          call.request.description ? "description = :description" : ""
        }${
          call.request.ratings ? "ratings= :ratings" : ""
        }, updatedAt = NOW() WHERE id = :reviewId AND reviewerId = :reviewerId AND bookId = :bookId`,
        {
          replacements: call.request,
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      console.log(updateBookResult);

      return callback(null, {
        message: "Book edited successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to edit book review",
        code: grpc.status.INTERNAL,
      });
    }
  };

  GetAllReviews = async (call, callback) => {
    try {
      const { bookId } = call.request;

      if (!bookId) {
        return callback({
          details: "Insufficient data to fetch review",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const bookReviews = await sequelize.query(
        "SELECT r.id, r.reviewerId, b.bookName, r.ratings,r.description, r.bookId FROM reviews r JOIN books b ON r.bookId = b.id WHERE b.id = :bookId",
        {
          replacements: {
            bookId: bookId,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      console.log(bookReviews);

      return callback(null, {
        reviews: bookReviews,
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to get book reviews",
        code: grpc.status.INTERNAL,
      });
    }
  };
}

module.exports = ReviewService;
