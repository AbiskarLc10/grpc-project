const grpc = require("@grpc/grpc-js");
const bcrypt = require("bcrypt");
const sequelize = require("../../db/connection");
const { QueryTypes } = require("sequelize");

const SignIn = async (call, callback) => {
  try {
    const { email, password } = call.request;

    if (!email || !password) {
      //Error sent back to client incase of missing arguments for login
      return callback({
        details: "Please provide credentials",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    //Check for author existence
    const findAuthor = await sequelize.query(
      "SELECT * FROM authors WHERE email=?",
      {
        replacements: [email],
        type: QueryTypes.SELECT,
      }
    );

    if (findAuthor.length === 0) {
      return callback({
        details: "User not found",
        code: grpc.status.NOT_FOUND,
      });
    }

    const checkPassword = await bcrypt.compare(
      password,
      findAuthor[0].password
    );

    if (!checkPassword) {
      return callback({
        details: "Invalid Credentials",
        code: grpc.status.PERMISSION_DENIED,
      });
    }

    return callback(null, { author: findAuthor[0], success: checkPassword });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to signup user",
      code: grpc.status.INTERNAL,
    });
  }
};


module.exports = SignIn;