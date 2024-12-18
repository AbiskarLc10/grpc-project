const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const {
  addBookReview,
  deleteReview,
  editBookReview,
  getBookReviewsById,
} = require("../Controllers/review-controllers");
const router = express.Router();

router.route("/add-book-review/:bookId").post(verifyUser, addBookReview);
router
  .route("/delete-review/:bookId/:reviewId")
  .delete(verifyUser, deleteReview);
router
  .route("/edit-review/:bookId/:reviewId")
  .patch(verifyUser, editBookReview);
router.route("/get-reviews/:bookId").get(verifyUser, getBookReviewsById);

module.exports = router;
