const grpc = require("@grpc/grpc-js");
const { Author } = require("../../db/models/index");

const DeleteProfile = async (call, callback) => {
  try {
    const { id } = call.request;

    if (!id) {
      return callback({
        details: "Invalid Author Id",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const findAndDeleteUser = await Author.destroy({
      where: {
        id: id,
      },
    });

    if (!findAndDeleteUser) {
      return callback({
        details: "Author not found",
        code: grpc.status.NOT_FOUND,
      });
    }

    return callback(null, {
      success: true,
    });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to delete user",
      code: grpc.status.INTERNAL,
    });
  }
};


module.exports = DeleteProfile;