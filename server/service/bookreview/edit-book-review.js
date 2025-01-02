const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection.js");

const EditBookReview = async (call, callback) => {
  try {
    const { reviewerId, bookId, reviewId, description, ratings } = call.request;

    const updateAbleFields = {
      description,
      ratings,
    };

    let fieldToUpdate = Object.keys(updateAbleFields);

    let setClause = fieldToUpdate
      .map((field) => {
        if (!updateAbleFields[field]) {
          return "";
        } else {
          return `${field}= :${field}`;
        }
      })
      .join(", ");

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

    // const [__, updateBookResult] = await sequelize.query(
    //   `UPDATE reviews SET ${
    //     call.request.description ? "description = :description," : ""
    //   }${
    //     call.request.ratings ? "ratings= :ratings" : ""
    //   }, updatedAt = NOW() WHERE id = :reviewId AND reviewerId = :reviewerId AND bookId = :bookId`,
    //   {
    //     replacements: call.request,
    //     type: sequelize.QueryTypes.UPDATE,
    //   }
    // );

    const [__, updateBookResult] = await sequelize.query(
      `UPDATE reviews SET ${setClause}, updatedAt = NOW() WHERE id = :reviewId AND reviewerId = :reviewerId AND bookId = :bookId`,
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

module.exports = EditBookReview;
