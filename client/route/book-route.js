const express = require("express");
const {
  getAllBooks,
  addBook,
  deleteBookById,
  getBookById,
  getbooksByAuthor,
  updateBook,
} = require("../Controllers/book-controller");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();

router.route("/get-all-books").get(getAllBooks);
router.route("/getbooks/:author").get(getbooksByAuthor);
router.route("/add").post(verifyUser,addBook);
router.route("/delete/:bookId").delete(verifyUser,deleteBookById);
router.route("/update/:bookId").patch(verifyUser,updateBook);
router.route("/getbook/:bookId").get(getBookById);

module.exports = router;
