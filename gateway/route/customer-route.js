const express = require("express");
const CustomerClient = require("../grpc-client/customerClient");
const grpc = require("@grpc/grpc-js");
const customErrorHandler = require("../errors/customError");
const validate = require("../utils/validateData");
const { signUpCustomerSchema } = require("../utils/validationSchema");
const router = express.Router();

router.route("/sign-up").post(async (req, res, next) => {
  const { fullName, email, password, address, dateOfBirth } = req.body;

  try {
    validate(req.body, signUpCustomerSchema);
    const response = await new Promise((resolve, reject) => {
      CustomerClient.SignUpCustomer(
        {
          fullName,
          email,
          password,
          address,
          dateOfBirth,
        },
        (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    });

    return res.status(201).json(response);
  } catch (error) {
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
});

router.route("/sign-in").post(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const response = await new Promise((resolve, reject) => {
      CustomerClient.SignInCustomer({ email, password }, (error, response) => {
        if (error) {
          reject({
            details: error.details,
            code: error.code,
          });
        }
        resolve(response);
      });
    });

    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code || 500,
      },
      next
    );
  }
});

router.route("/order-book/:bookId").post(async (req, res, next) => {
  if (!req.headers.authorization) {
    return customErrorHandler(
      {
        details: "Token not found.Please login!",
        code: 404,
      },
      next
    );
  }
  const metadata = new grpc.Metadata();
  metadata.add("token", req.headers.authorization);
  const { bookId } = req.params;
  let { quantity } = req.body;
  if (!bookId) {
    return customErrorHandler(
      {
        details: "Failed to get url params",
        code: 400,
      },
      next
    );
  }
  try {
    const response = await new Promise((resolve, reject) => {
      CustomerClient.OrderBook(
        { bookId, quantity },
        metadata,
        (error, response) => {
          if (error) {
            reject(error);
          }
          resolve(response);
        }
      );
    });

    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
    return customErrorHandler({
      details: error.details || error.message,
      code: error.code || 500,
    },next);
  }
});

module.exports = router;
