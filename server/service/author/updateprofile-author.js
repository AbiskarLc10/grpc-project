const grpc = require("@grpc/grpc-js");
const { Author, Book } = require("../../db/models/index");
const sequelize = require("../../db/connection");
const { Sequelize } = require("sequelize");

const UpdateProfile = async (call, callback) => {
  const updateTransaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_READ_COMMITTED,
  });
  try {
    console.log(call.request);
    const { id, name, genre, date_of_birth } = call.request;

    let dataToUpdate = {};

    if (name) {
      dataToUpdate.name = name;
    }
    if (genre) {
      dataToUpdate.genre = genre;
    }
    if (date_of_birth) {
      dataToUpdate.date_of_birth = new Date(date_of_birth).toISOString();
    }
    if (!id) {
      return callback({
        details: "Invalid user ID.",
        code: grpc.status.PERMISSION_DENIED,
      });
    }

    const author = await Author.findByPk(id, {
      transaction: updateTransaction,
      paranoid: false,
    });
    if (!author) {
      return callback({
        details: "User does not exist.",
        code: grpc.status.NOT_FOUND,
      });
    }

    const [affectedCount] = await Author.update(dataToUpdate, {
      where: {
        id: id,
      },
      transaction: updateTransaction,
    });

    if (affectedCount !== 1) {
      return callback({
        details: "Something went wrong.",
        code: grpc.status.UNKNOWN,
      });
    }

    await Author.update(dataToUpdate, {
      where: {
        id: id,
      },
      transaction: updateTransaction,
    });

    if (dataToUpdate.genre) {
      await Book.update(
        {
          genre: genre,
        },
        {
          where: {
            authorId: id,
          },
          transaction: updateTransaction,
        }
      );
    }

    await updateTransaction.commit();

    return callback(null, {
      message: "Updated user successfully",
      success: true,
    });
  } catch (error) {
    await updateTransaction.rollback();
    console.error("Error in UpdateProfile:", error);
    return callback({
      details: "Failed to update user",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = UpdateProfile;
