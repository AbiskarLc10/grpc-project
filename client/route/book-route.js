const express = require("express");
const {
  getAllBooks,
  addBook,
  deleteBookById,
  getBookById,
  getbooksByAuthor,
  updateBook,
  getBookByDate,
  getBooksByPage,
} = require("../Controllers/book-controller");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();

router.route("/get-all-books").get(getAllBooks);
router.route("/getbooks").get(getbooksByAuthor);
router.route("/add").post(verifyUser,addBook);
router.route("/delete/:bookId/:authorId").delete(verifyUser,deleteBookById);
router.route("/update/:bookId/:authorId").patch(verifyUser,updateBook);
router.route("/getbook/:bookId").get(getBookById);
router.route("/get-books-by-date").get(getBookByDate);
router.route("/getbooks/:pageNo").get(getBooksByPage);

module.exports = router;
