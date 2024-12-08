const customErrorHandler = require("../errors/customError");
const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  try {
    const [_, token] = req.headers.authorization.split(" ");
    // const { token } = req.cookies;
    console.log(token);
    if (!token) {
      return customErrorHandler(
        { code: 401, details: "Token not found" },
        next
      );
    }

    jwt.verify(token, process.env.PRIVATE_KEY, (err, data) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return customErrorHandler(
            { code: 401, details: "Token has expired" },
            next
          );
        }
        return customErrorHandler(
          { code: 401, details: "Failed to decode token" },
          next
        );
      }

      console.log("Decoded Token Data:", data);
      req.user = data;
      next();
    });
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        code: 500,
        details: "Failed to verify User",
      },
      next
    );
  }
};

module.exports = verifyUser;
