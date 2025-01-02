const grpc = require("@grpc/grpc-js");
const { Book } = require("../../db/models/index");
const sequelize = require("../../db/connection");

const AddBook = async (call, callback) => {
    try {
      const { bookName, published_date, genre, authorId, price, stock } =
        call.request;

        
      if (!authorId || !bookName || !published_date || !genre || !price) {
        return callback({
          details: "Please provide all book details",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      // const authorData = await new Promise((resolve, reject) => {
      //   AuthorClient.GetAuthorById({ authorId }, (error, response) => {
      //     if (response) {
      //       resolve(response);
      //     }
      //   });
      // });
      // console.log(authorData);
      const checkUniqueBookName = await Book.findOne({
        where: {
          bookName: bookName,
        },
      });

      if (checkUniqueBookName) {
        return callback({
          details: "Book with this name already exists",
          code: grpc.status.ALREADY_EXISTS,
        });
      }

      const newBook = await Book.create({
        bookName,
        genre,
        published_date: new Date(published_date).toISOString(),
        authorId: authorId,
        price,
        stock,
      });

      if (!newBook) {
        return callback({
          details: "Failed to create book",
          code: grpc.status.RESOURCE_EXHAUSTED,
        });
      }

      return callback(null, {
        message: "Book Added successfully",
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to add book",
        code: grpc.status.INTERNAL,
      });
    }
  };


  module.exports = AddBook;