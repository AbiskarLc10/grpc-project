const customErrorHandler = require("../errors/customError");
const ReviewClient = require("../grpc-client/bookreviewClient");

const addBookReview = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { bookId } = req.params;
    const { description } = req.body;
    const response = await new Promise((resolve, reject) => {
      ReviewClient.AddBookReview(
        { review: { bookId: bookId, reviewerId: id, description } },
        (error, response) => {
          if (error) {
            console.log(error);
            reject({
              details: error.details,
              code: error.code,
            });
          }
          resolve(response);
        }
      );
    });

    console.log(response);

    return res.status(201).json({success:true, ...response});
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
};


module.exports = {addBookReview}