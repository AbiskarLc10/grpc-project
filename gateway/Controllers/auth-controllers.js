const customErrorHandler = require("../errors/customError");
const AuthorClient = require("../grpc-client/authorClient");
const validate = require("../utils/validateData");
const { signUpSchema } = require("../utils/validationSchema");
const jwt = require("jsonwebtoken");

const SignUpAuthor = async (req, res, next) => {
  try {
    validate(req.body, signUpSchema);

    const response = await new Promise((resolve, reject) => {
      AuthorClient.SignUp(req.body, (error, response) => {
        if (error) {
          reject({
            code: error.code,
            details: error.details,
          });
        }
        resolve(response);
      });
    });

    return res.status(201).json({ message: "Sign Up Successful", ...response });
  } catch (error) {
    console.log(error.message);
    return customErrorHandler(error, next);
  }
};

const SignInAuthor = async (req, res, next) => {
  try {
    const response = await new Promise((resolve, reject) => {
      AuthorClient.SignIn(req.body, (error, response) => {
        if (error) {
          reject({
            code: error.code,
            details: error.details,
          });
        }
        resolve(response);
      });
    });

    if (response.success) {
      const token = jwt.sign(
        { id: response.author.id, isAuthor: true },
        process.env.PRIVATE_KEY,
        { expiresIn: "1hr" }
      );
      const { _profileImage, ...rest } = response.author;
      return res
        .status(201)
        .json({ message: "Sign In Successful", author: rest, token: token });
    }
  } catch (error) {
    return customErrorHandler(error, next);
  }
};

module.exports = { SignInAuthor, SignUpAuthor };
