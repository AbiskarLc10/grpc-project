const bcrypt = require("bcrypt");
const grpc = require("@grpc/grpc-js");
const sequelize = require("../db/connection");
const { Sequelize } = require("../db/models");
const { Customer } = require("../db/models/index");
const jwt = require("jsonwebtoken");
class CustomerService {
  SignUpCustomer = async (call, callback) => {
    try {
      const { fullName, email, password, address, dateOfBirth } = call.request;

      if (!fullName || !email || !password || !address || !dateOfBirth) {
        return callback({
          details: "Please provide all fields",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const [checkUserExists] = await sequelize.query(
        "SELECT * FROM customers WHERE email= :email",
        {
          replacements: {
            email,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (checkUserExists.length === 1) {
        return callback({
          details: "Customer with this email already exists",
          code: grpc.status.ALREADY_EXISTS,
        });
      }

      const newCustomer = await Customer.create({
        fullName,
        email,
        password: await bcrypt.hash(password, 10),
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        address,
      });
      if (!newCustomer) {
        return callback({
          details: "Failed to create user",
          code: grpc.status.FAILED_PRECONDITION,
        });
      }

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

  SignInCustomer = async (call, callback) => {
    try {
      const { email, password } = call.request;

      if (!email || !password) {
        return callback({
          details: "Please provide credentials",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const [checkCustomerExists] = await sequelize.query(
        "SELECT * FROM customers WHERE email = :email",
        {
          replacements: {
            email,
          },
        }
      );

      if (checkCustomerExists.length === 0) {
        return callback({
          details: "User with this email does not exists",
          code: grpc.status.NOT_FOUND,
        });
      }

      console.log(checkCustomerExists[0].password);
      const isValidPassword = await bcrypt.compare(
        password,
        checkCustomerExists[0].password
      );

      if (!isValidPassword) {
        return callback({
          details: "Invalid credentials",
          code: grpc.status.UNAUTHENTICATED,
        });
      }

      const token = jwt.sign(
        {
          id: checkCustomerExists[0].id,
          isAuthor: false,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1hr",
        }
      );

      return callback(null, {
        customer: checkCustomerExists[0],
        success: isValidPassword,
        token: token,
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to sign in customer",
        code: grpc.status.INTERNAL,
      });
    }
  };
}

module.exports = CustomerService;
