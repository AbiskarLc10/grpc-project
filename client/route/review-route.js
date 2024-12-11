const express = require('express');
const verifyUser = require('../middleware/verifyUser');
const { addBookReview } = require('../Controllers/review-controllers');
const router = express.Router();


router.route("/add-book-review/:bookId").post(verifyUser,addBookReview);

module.exports = router;