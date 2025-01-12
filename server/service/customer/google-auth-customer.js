const bcrypt = require("bcrypt");
const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");
const { Sequelize } = require("../../db/models");
const jwt = require("jsonwebtoken");
const { Customer } = require("../../db/models/index");

const CustomerGoogleAuthentication = async (call, callback) => {
  try {
    const { fullName, email, address, profileImage, dateOfBirth } =
      call.request;

    if (!fullName || !email) {
      return callback({
        details: "Insufficient arguments for authentication",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const [checkCustomerExists] = await sequelize.query(
      "SELECT * FROM customers WHERE email= :email",
      {
        replacements: { email },
      }
    );

    if (checkCustomerExists.length === 1) {
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
        success: true,
        token: token,
      });
    } else {
      const newCustomer = await Customer.create({
        fullName,
        email,
        password: await bcrypt.hash(password, 10),
        profileImage: profileImage,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth).toISOString()
          : new Date().toISOString(),
        address,
      });

      if (!newCustomer) {
        return callback({
          details: "Failed to create user",
          code: grpc.status.FAILED_PRECONDITION,
        });
      }

      const token = jwt.sign(
        { id: newCustomer.id, isAuthor: false },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1hr",
        }
      );
      return callback(null, {
        customer: newCustomer,
        success: true,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed for google oauth login",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = CustomerGoogleAuthentication;
