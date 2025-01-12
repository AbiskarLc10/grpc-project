const oauth2Client = require("../google/client");
require("dotenv").config();
const axios = require("axios");
const { AxiosError } = require("axios");
const jwt = require("jsonwebtoken");
const customErrorHandler = require("../errors/customError");
const { getUserInfo } = require("../google/utils");
const AuthorClient = require("../grpc-client/authorClient");
const CustomerClient = require("../grpc-client/customerClient");

// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
// const ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
// const TOKEN_INFO_URL = process.env.GOOGLE_TOKEN_INFO_URL;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REDIRECT_URL = "http://localhost:8000/api/auth/google/callback";
// const GOOGLE_OAUTH_SCOPES = [
//   "https%3A//www.googleapis.com/auth/userinfo.email",
//   "https%3A//www.googleapis.com/auth/userinfo.profile",
// ];

const SignInWithGoogle = (req, res, next) => {
  // const googleSignInUrl = `${OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&access_type=offline&response_type=code&state=loginbookstore&scope=${GOOGLE_OAUTH_SCOPES.join(
  //   ", "
  // )}`;
  console.log(req.baseUrl);
  let state;
  if (req.baseUrl === "/api/customer") {
    state = "loginbookstore&type=customer";
  } else if (req.baseUrl === "/api/auth") {
    state = "loginbookstore&type=author";
  }

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    redirect_uri: "http://localhost:8000/api/auth/google/callback",
    state: state,
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
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    const params = new URLSearchParams(state);
    const userType = params.get("type");

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res
        .status(500)
        .json({ message: "Google Client ID is not configured" });
    }

    console.log("Google Client ID:", clientId);

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
    });
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });
    const user = ticket.getPayload();

    const userDetails = await getUserInfo(oauth2Client);

    console.log(userDetails);

    if (userType === "author") {
      const response = await new Promise((resolve, reject) => {
        AuthorClient.GoogleAuthentication(
          {
            name: user.name,
            email: user.email,
            date_of_birth: new Date(),
            profileImage: user.picture,
          },
          (error, response) => {
            if (error) {
              reject({
                details: error.details,
                code: error.code,
              });
            }
            resolve(response);
          }
        );
      });

      const token = jwt.sign(
        { id: response.author.id, isAuthor: true },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1hr",
        }
      );

      return res.status(201).json({
        message: "Sign in successfull",
        author: response.author,
        token: token,
      });
    } else if (userType === "customer") {
      const response = await new Promise((resolve, reject) => {
        CustomerClient.CustomerGoogleAuthentication(
          {
            fullName: user.name,
            email: user.email,
            profileImage: user.picture,
            address: user.address || "Nepal",
            dateOfBirth: new Date(),
          },
          (error, response) => {
            if (error) {
              reject({
                details: error.details,
                code: error.code,
              });
            }
            resolve(response);
          }
        );
      });

      return res
        .status(201)
        .json({ message: "Google Authentication successful", ...response });
    }
    // console.log("User Info:", user);
    // console.log(tokens.access_token);
    // const userDetails = await axios.get(
    //   "https://people.googleapis.com/v1/people/me",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${tokens.access_token}`,
    //     },
    //   }
    // );
    // console.log(userDetails.data);

    // return res.status(200).json({
    //   message: "Authentication successful",
    //   user,
    //   accessToken: tokens.access_token,
    //   refreshToken: tokens.refresh_token,
    // });
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);

    // if (error instanceof AxiosError) {
    //   return customErrorHandler(
    //     {
    //       details: error.message,
    //       code: error.response?.status,
    //     },
    //     next
    //   );
    // }
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
  SignInWithGoogle,
  GoogleCallbackFunction,
};
