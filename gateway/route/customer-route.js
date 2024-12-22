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
    return customErrorHandler({
      details: error.details || error.message,
      code: error.code || 500,
    },next);
  }
});


module.exports = router;
