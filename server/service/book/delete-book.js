const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const sequelize = require("../../db/connection");
const { Model } = require("sequelize");

const DeleteBook = async (call, callback) => {
  const transaction = await sequelize.transaction();
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

    const [deletedBook, _] = await sequelize.query(
      "DELETE FROM books WHERE id= :bookId",
      {
        replacements: {
          bookId: bookToBeDeleted.id,
        },
        transaction: transaction,
      }
    );

    if (deletedBook.affectedRows === 0) {
      return callback({
        details: "Failed to delete book",
        code: grpc.status.FAILED_PRECONDITION,
      });
    }

    await transaction.commit();
    return callback(null, { success: true });
  } catch (error) {
    await transaction.rollback();
    return callback({
      details: "Failed to  delete book",
      code: grpc.status.INTERNAL,
    });
  }
};


module.exports = DeleteBook;