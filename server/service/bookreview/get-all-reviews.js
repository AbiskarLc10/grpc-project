const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection.js");
const {
  CheckDataInRedisDatabase,
  AddReviewsToRedis,
} = require("../../redisClient/utils.js");

const GetAllReviews = async (call, callback) => {
  try {
    const { bookId } = call.request;

    if (!bookId) {
      return callback({
        details: "Insufficient data to fetch review",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const reviewsInCache = await CheckDataInRedisDatabase(`reviews:${bookId}`);
    if (reviewsInCache) {
      return callback(null, {
        reviews: reviewsInCache,
      });
    }

    // const bookReviews = await sequelize.query(
    //   "SELECT r.id, r.reviewerId, b.bookName, r.ratings,r.description, r.bookId FROM reviews r JOIN books b ON r.bookId = b.id WHERE b.id = :bookId",
    //   {
    //     replacements: {
    //       bookId: bookId,
    //     },
    //     type: sequelize.QueryTypes.SELECT,
    //   }
    // );

    const bookReviews = await sequelize.query(
      "CALL GetAllBookReviews(:bookId)",
      {
        replacements: {
          bookId: bookId,
        },
      }
    );
    // const bookReviews = await Review.findAll({
    //   where: {
    //     bookId: bookId,
    //   },
    //   include: [
    //     {
    //       model: Book,
    //       attributes: ["bookName"],
    //       as: "book",
    //     },
    //   ],
    // });

    if (bookReviews.length === 0) {
      return callback({
        details: "No reviews found for the book",
        code: grpc.status.NOT_FOUND,
      });
    }

    await AddReviewsToRedis(bookReviews, `reviews:${bookId}`);
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

module.exports = GetAllReviews;
