const customErrorHandler = require("../errors/customError");
const AuthorClient = require("../grpc-client/authorClient");

const UpdateAuthor = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { authorId } = req.params;
    if (id !== authorId) {
      return next({
        details: "Invalid token",
        code: 403,
      });
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

    if (!response.success) {
      throw new Error("An unknown error occurred");
    }
    return res.status(200).json({
      message: "Author deleted successfully",
      success: response.success,
    });
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

const SignOutAuthor = async (req, res, next) => {
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

    return res
      .status(200)
      .json({ message: "User sign out successful", success: true });
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

const getAuthorById = async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const {id} = req.user;
    if(authorId!==id){
      return customErrorHandler({
        details:"Unauthorized Access, action not allowed",
        code: 403
      })
    }
    const response = await new Promise((resolve, reject) => {
      AuthorClient.GetAuthorById({ authorId }, (error, response) => {
        if (error) {
          console.log(error);
          reject({
            details: error.details,
            code: error.code,
          });
        }
        resolve(response);
      });
    });
    
    return res.status(201).json({message:"User Fetched Successfully",...response,success:true});
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
module.exports = { UpdateAuthor, DeleteAuthor, SignOutAuthor, getAuthorById };
