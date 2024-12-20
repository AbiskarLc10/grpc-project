const bcrypt = require("bcrypt");
const grpc = require("@grpc/grpc-js");
const sequelize = require("../db/connection");
const { Sequelize } = require("../db/models");
const { Customer } = require("../db/models/index");
class CustomerService {
  SignUpCustomer = async (call, callback) => {
    try {

      console.log(call.metadata);
      console.log("Hello")
      // const { fullName, email, password, address, dateOfBirth } = call.request;

      // if (!fullName || !email || !password || !address || !dateOfBirth) {
      //   return callback({
      //     details: "Please provide all fields",
      //     code: grpc.status.INVALID_ARGUMENT,
      //   });
      // }

      // const checkUserExists = await sequelize.query(
      //   "SELECT * FROM customers WHERE email= :email",
      //   {
      //     replacements: {
      //       email,
      //     },
      //     type: Sequelize.QueryTypes.SELECT,
      //   }
      // );

      // if (checkUserExists.length === 1) {
      //   return callback({
      //     details: "Customer with this email already exists",
      //     code: grpc.status.ALREADY_EXISTS,
      //   });
      // }

      // const newCustomer = await Customer.create({
      //   fullName,
      //   email,
      //   password: await bcrypt.hash(password, 10),
      //   dateOfBirth: new Date(dateOfBirth).toISOString(),
      //   address,W
      // });
      // if (!newCustomer) {
      //   return callback({
      //     details: "Failed to create user",
      //     code: grpc.status.FAILED_PRECONDITION,
      //   });
      // }

      return callback(null, {
        message: "Customer created successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to sign up customer",
        code: grpc.status.INTERNAL,
      });
    }
  };
}

module.exports = CustomerService;
