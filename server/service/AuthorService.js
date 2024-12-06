const grpc = require("@grpc/grpc-js");
const bcrypt = require("bcrypt");
const { Author } = require("../db/models/index");
// const { signUpSchema } = require("../../client/utils/validationSchema");
// const validate = require("../../client/utils/validateData");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../db/connection");
const { QueryTypes } = require("sequelize");

class AuthorService {
  SignUp = async (call, callback) => {
    try {
      const { name, email, password, genre, date_of_birth } = call.request;

      if (!name || !email || !password || !genre || !date_of_birth) {
        return callback({
          details: "Please provide all fields",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      // const checkAuthorExists = await Author.findOne({
      //   where: {
      //     email: email,
      //   },
      // });
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

      const newAuthor = await Author.create({
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10),
        genre: genre,
        date_of_birth: new Date(date_of_birth).toISOString(),
      });

      // const newAuthor = await sequelize.query(
      //   "INSERT INTO authors (id,name, email, password, genre, date_of_birth,createdAt,updatedAt) VALUES (:id,:name, :email, :password, :genre, :dob,:createdAt,:updatedAt)",
      //   {
      //     type: QueryTypes.INSERT,
      //     mapToModel: Author,
      //     replacements: {
      //       ...call.request,
      //       id: uuidv4(),
      //       password: hashedPassword,
      //       dob: new Date(date_of_birth).toISOString(),
      //       createdAt: new Date(),
      //       updatedAt: new Date()
      //     },
      //   }
      // );

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

  SignIn = async (call, callback) => {
    try {
      const { email, password } = call.request;

      if (!email || !password) {
        return callback({
          details: "Please provide credentials",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const findAuthor = await sequelize.query(
        "SELECT * FROM authors WHERE email=?",
        {
          replacements: [email],
          type: QueryTypes.SELECT,
        }
      );

      if (!findAuthor) {
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
}

module.exports = AuthorService;
