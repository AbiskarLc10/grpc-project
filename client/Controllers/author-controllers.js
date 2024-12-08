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

    // const {token} = req.cookies
    
    // if(token){
    //   return customErrorHandler({
    //     code:400,
    //     message:"Author is already logged in"
    //   },next)
    // }
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
        { id: response.author.id },
        process.env.PRIVATE_KEY,
        { expiresIn: "1hr" }
      );
      return res
        .cookie("token", token)
        .status(201)
        .json({ message: "Sign In Successful", ...response });
    }
  } catch (error) {
    return customErrorHandler(error, next);
  }
};

const UpdateAuthor = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { authorId } = req.params;
    if (id !== authorId) {
      return customErrorHandler(
        {
          details: "Invalid token",
          code: 403,
        },
        next
      );
    }

    const response = await new Promise((resolve, reject) => {
      AuthorClient.UpdateProfile(
        { ...req.body, id: authorId },
        (error, response) => {
          if (error) {
            console.log(error);
            reject({
              code: error.code,
              details: error.details,
            });
          }
          resolve(response);
        }
      );
    });

    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
    return customErrorHandler(error, next);
  }
};

const DeleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { authorId } = req.params;

    if (id !== authorId) {
      return customErrorHandler(
        {
          details: "Invalid token",
          code: 403,
        },
        next
      );
    }

    const response = await new Promise((resolve, reject) => {
      AuthorClient.DeleteProfile({ id: authorId }, (error, response) => {
        if (error) {
          console.log(error);
          reject({
            code: error.code,
            details: error.details,
          });
        }
        resolve(response);
      });
    });

    if(!response.success){
       throw new Error("An unknown error occurred")
    }
    return res.clearCookie('token').status(200).json({message:"Author deleted successfully",success: response.success});
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        code: error.code,
        details: error.details || error.message,
      },
      next
    );
  }
};
module.exports = { SignUpAuthor, SignInAuthor, UpdateAuthor, DeleteAuthor };
