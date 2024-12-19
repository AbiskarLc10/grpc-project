const grpc = require("@grpc/grpc-js");
const bcrypt = require("bcrypt");
const { Author, Book } = require("../db/models/index");
const sequelize = require("../db/connection");
const { QueryTypes, Sequelize } = require("sequelize");
const transporter = require("../transport/mailer");

class AuthorService {
  SignUp = async (call, callback) => {
    try {
      const { name, email, password, address, date_of_birth } = call.request;

      if (!name || !email || !password || !address || !date_of_birth) {
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

  SignIn = async (call, callback) => {
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

  UpdateProfile = async (call, callback) => {
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

      // await Author.update(dataToUpdate, {
      //   where: {
      //     id: id,
      //   },
      //   transaction: updateTransaction,
      // });

      // if (dataToUpdate.genre) {
      //   await Book.update(
      //     {
      //       genre: genre,
      //     },
      //     {
      //       where: {
      //         authorId: id,
      //       },
      //       transaction: updateTransaction,
      //     }
      //   );
      // }

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

  GetAuthorById = async (call, callback) => {
    try {
      const { authorId } = call.request;

      console.log(authorId);
      if (!authorId) {
        return callback({
          details: "Failed to get Id from user",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const authorData = await Author.findByPk(authorId);

      if (!authorData) {
        return callback({
          details: "User does not exists",
          code: grpc.status.NOT_FOUND,
        });
      }

      return callback(null, {
        author: authorData,
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to get user data",
        code: grpc.status.INTERNAL,
      });
    }
  };
  DeleteProfile = async (call, callback) => {
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
}

module.exports = AuthorService;
