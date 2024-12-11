const grpc = require("@grpc/grpc-js");

class ReviewService {
  AddReview = async (call, callback) => {
    try {
        const {reviewerId,bookId,description} = call.request.review;

        console.log(reviewerId,bookId,description);
        return callback(null,{
            message:"Hello",
            bookName:"dbjadj",
            description: description
        })
    } catch (error) {
        console.log(error);
        return callback({
            details:"Failed to add review to the book",
            code: grpc.status.INTERNAL
        })
    }
  };
}


module.exports = ReviewService;