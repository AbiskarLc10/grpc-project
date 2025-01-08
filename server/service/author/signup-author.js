const grpc = require("@grpc/grpc-js");
const bcrypt = require("bcrypt");
const { Author } = require("../../db/models/index");
const sequelize = require("../../db/connection");
const { QueryTypes } = require("sequelize");

const SignUp = async (call, callback) => {
  try {
    const { name, email, password, genre, date_of_birth } = call.request;

    if (!name || !email || !password || !genre || !date_of_birth) {
      return callback({
        details: "Please provide all fields",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    //Check for existence of user with the same email addresss
    const checkAuthorExists = await sequelize.query(
      "SELECT * FROM authors where email = :email",
      {
        replacements: {
          email,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (checkAuthorExists.length === 1) {
      return callback({
        details: "Author account already exists",
        code: grpc.status.ALREADY_EXISTS,
      });
    }

    //New author creation
    const newAuthor = await Author.create({
      name: name,
      email: email,
      password: await bcrypt.hash(password, 10),
      genre: genre,
      date_of_birth: new Date(date_of_birth).toISOString(),
    });

    if (!newAuthor) {
      return callback({
        details: "Failed to create user",
        code: grpc.status.FAILED_PRECONDITION,
      });
    }

    return callback(null, { success: true, author: newAuthor });
  } catch (error) {
    return callback({
      details: error.message || "Failed to signup user",
      code: grpc.status.INTERNAL,
    });
  }
};


module.exports = SignUp;