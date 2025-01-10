const customErrorHandler = require("../errors/customError");
const oauth2Client = require("../google/client");
const AuthorClient = require("../grpc-client/authorClient");
const validate = require("../utils/validateData");
const { signUpSchema } = require("../utils/validationSchema");
const axios = require("axios");
require("dotenv").config();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
const TOKEN_INFO_URL = process.env.GOOGLE_TOKEN_INFO_URL;
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
  // const googleSignInUrl = `${OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&access_type=offline&response_type=code&state=loginbookstore&scope=${GOOGLE_OAUTH_SCOPES.join(
  //   ", "
  // )}`;

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    redirect_uri: "http://localhost:8000/api/auth/google/callback",
    state: "loginbookstore",
  });

  return res.status(200).json({
    authorizationUrl,
  });
};

// const GoogleCallbackFunction = async (req, res, next) => {
//   console.log(req.query);

//   try {
//     const { code } = req.query;
//     const data = {
//       code,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uri: REDIRECT_URL,
//       grant_type: "authorization_code",
//     };

//     const response = await axios.post(ACCESS_TOKEN_URL, data, data);

//     const { id_token } = response.data;

//     const tokenInfoResponse = await axios.get(
//       `${TOKEN_INFO_URL}?id_token=${id_token}`
//     );

//     return res.status(200).json(tokenInfoResponse.data);
//   } catch (error) {
//     console.log(error);
//     return next({
//       details: "Something went wrong",
//       code: 500,
//     });
//   }
// };

const GoogleCallbackFunction = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res
        .status(500)
        .json({ message: "Google Client ID is not configured" });
    }

    console.log("Google Client ID:", clientId);

    const { tokens } = await oauth2Client.getToken(code);

    const ticket = oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });
    const user = ticket.getPayload();

    console.log("User Info:", user);

    const userDetails = await axios.get(
      "https://people.googleapis.com/v1/people/me",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    console.log(userDetails.data);
    return res.status(200).json({
      message: "Authentication successful",
      user,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);

    return customErrorHandler(
      {
        details: error.details || error.message || "Unknown error",
        code: error.code || 500,
      },
      next
    );
  }
};
module.exports = {
  SignInAuthor,
  SignUpAuthor,
  SignInWithGoogle,
  GoogleCallbackFunction,
};
