const express = require("express");
const {
  getAllBooks,
  addBook,
  deleteBookById,
  getBookById,
  getbooksByAuthor,
  updateBook,
} = require("../Controllers/book-controller");
const router = express.Router();

router.route("/get-all-books").get(getAllBooks);
router.route("/getbooks/:author").get(getbooksByAuthor);
router.route("/add").post(addBook);
router.route("/delete/:bookId").delete(deleteBookById);
router.route("/update/:bookId").patch(updateBook);
router.route("/getbook/:bookId").get(getBookById);

module.exports = router;
