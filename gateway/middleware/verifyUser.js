const customErrorHandler = require("../errors/customError");
const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  try {

    if(!req.headers.authorization){
      return customErrorHandler({
        details:"Token not found.Please login!",
        code:404
      }, next)
    }
    const [_, token] = req.headers.authorization.split(" ");
    console.log(token);
    if (!token) {
      return customErrorHandler(
        { code: 401, details: "Token not found" },
        next
      );
    }

    jwt.verify(token, process.env.PRIVATE_KEY, (err, data) => {
      if (err) {
        if (err instanceof jwt.JsonWebTokenError) {
        
          return customErrorHandler(
            { code: 401, details: err.message},
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
