const customErrorHandler = require("../errors/customError");
const AuthorClient = require("../grpc-client/authorClient");
const validate = require("../utils/validateData");
const { signUpSchema } = require("../utils/validationSchema");
const axios = require("axios");
require("dotenv").config();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = "http://localhost:8000/api/auth/google/callback";
const GOOGLE_OAUTH_SCOPES = [
  "https%3A//www.googleapis.com/auth/userinfo.email",
  "https%3A//www.googleapis.com/auth/userinfo.profile",
];
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

const SignInWithGoogle = (req, res, next) => {
  const googleSignInUrl = `${OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&access_type=offline&response_type=code&state=loginbookstore&scope=${GOOGLE_OAUTH_SCOPES.join(
    ", "
  )}`;

  return res.json({
    googleSignInUrl,
  });
};

const GoogleCallbackFunction = async (req, res, next) => {
  console.log(req.query);

  const { code } = req.query;
  const data = {
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URL,
    grant_type: "authorization_code",
  };

  const response = await axios.post(ACCESS_TOKEN_URL, data, data);

  console.log(response);
  return res.status(200).json({ message: "Hello" });
};


module.exports = { SignInAuthor, SignUpAuthor, SignInWithGoogle };
