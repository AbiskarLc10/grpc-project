const grpc = require("@grpc/grpc-js");
const { Author } = require("../../db/models/index");
const bcrypt = require("bcrypt");


const GoogleAuthentication = async (call, callback) => {
  try {
    const { name, email, genre, date_of_birth } = call.request;

    if (!name || !email) {
      return callback({
        details: "Insufficient arguments for authentication",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const checkAuthorExists = await Author.findOne({
      where: {
        email: email,
      },
    });

    if (checkAuthorExists) {
      return callback(null, {
        author: checkAuthorExists,
        success: true,
      });
    } else {
      const password = `${name.toLowerCase()}-${Date.now()}`;

      const newAuthor = await Author.create({
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10),
        genre: genre,
        date_of_birth: date_of_birth || new Date(),
      });

      if (!newAuthor) {
        return callback({
          details: "Failed to create user",
          code: grpc.status.FAILED_PRECONDITION,
        });
      }

      return callback(null, { success: true, author: newAuthor });
    }
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to Sign in with google",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = GoogleAuthentication;
