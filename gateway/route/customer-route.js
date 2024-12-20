const express = require("express");
const CustomerClient = require("../grpc-client/customerClient");
const grpc = require("@grpc/grpc-js");
const customErrorHandler = require("../errors/customError");
const router = express.Router();

router.route("/sign-up").post(async (req, res, next) => {
  // const {fullName,email,password,address,dateOfBirth} = req.body;

  try {
    const metadata = new grpc.Metadata();
    metadata.set(
      "token",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFiaXNrYXIgTGFtaWNoaGFuZSIsImlhdCI6MTUxNjIzOTAyMn0.SYApDMktSvZstR4vHmmPxYzZX0_q02amD81U-OTo7bc"
    );
    const response = await new Promise((resolve, reject) => {
      CustomerClient.SignUpCustomer(
        {
          fullName: "Abiskar",
          email: "abdjab",
          password: "dmakndad",
          address: "addresss",
          dateOfBirth: "dnaknd",
        },
        metadata,
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
    return customErrorHandler({
      details: error.details || error.message,
      code: error.code,
    });
  }
});

module.exports = router;
