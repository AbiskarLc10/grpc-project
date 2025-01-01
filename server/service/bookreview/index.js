const AddBookReview = require("./add-book-review");
const DeleteBookReview = require("./delete-book-review");
const EditBookReview = require("./edit-book-review");
const GetAllReviews = require("./get-all-reviews");

class ReviewService {}

ReviewService.prototype.AddBookReview = AddBookReview;
ReviewService.prototype.DeleteBookReview = DeleteBookReview;
ReviewService.prototype.EditBookReview = EditBookReview;
ReviewService.prototype.GetAllReviews = GetAllReviews;

module.exports = ReviewService;
