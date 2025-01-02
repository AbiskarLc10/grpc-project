const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");
const { QueryTypes } = require("sequelize");

const GetStreamData = async (call) => {
  try {
    const results = await sequelize.query("SELECT * FROM books", {
      type: QueryTypes.SELECT,
    });

    results.forEach((book, index) => {
      setTimeout(() => {
        call.write({
          book,
        });

        if (index === results.length - 1) {
          call.end();
        }
      }, 1000 * index);
    });
  } catch (error) {
    return call.end();
  }
};

module.exports = GetStreamData;
