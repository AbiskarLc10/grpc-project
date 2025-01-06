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
  getAllData,
} = require("../Controllers/book-controller");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Book-Routes
 *   description: User can get the book details
 */

/**
 * @swagger
 * /api/books/get-all-books:
 *   get:
 *     tags: [Book-Routes]
 *     summary: Get all book details
 *     responses:
 *       200:
 *         description: Book details fetched successfully
 *       500:
 *         description: Internal server error
 */
router.route("/get-all-books").get(getAllBooks);

/**
 * @swagger
 * /api/books/getbooks?author=authorName:
 *   get:
 *     tags: [Book-Routes]
 *     summary: Get the books by name of author
 *     parameters:
 *       - in: query
 *         name: authorName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the author
 *     responses:
 *       200:
 *         description: Book fetched successfully
 *       500:
 *         description: Failed to fetch book by Author Name.
 */
router.route("/getbooks").get(getbooksByAuthor);

/**
 * @swagger
 * /api/books/add:
 *   tags: [Book-Routes]
 *   summary: Add a book
 *   security:
 *     - bearerAuth: []
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             bookName:
 *               type: string
 *             genre:
 *               type: string
 *               enum:
 *                 - FANTASY
 *                 - CLASSICS
 *                 - DYSTOPIAN
 *                 - HISTORICAL_FICTION
 *                 - MYSTERY
 *                 - CONTEMPORARY_FICTION
 *                 - ADVENTURE
 *                 - FICTION
 *               example: "FANTASY"
 *             published_date:
 *               type: string
 *               format: date
 *             price:
 *               type: number
 *             stock:
 *               type: integer
 *   responses:
 *     201:
 *       description: Book added successfully
 *     401:
 *       $ref: "#/components/responses/UnauthorizedError"
 *     403:
 *       $ref: "#/components/responses/ForbiddenError"
 *     500:
 *       description: Internal server error
 */
router.route("/add").post(verifyUser, addBook);

/**
 * @swagger
 * /api/books/{bookId}/{authorId}:
 *   delete:
 *     tags: [Book-Routes]
 *     summary: Delete a book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: Id of the book to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted Successfully
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         $ref: "#/components/responses/ForbiddenError"
 *       500:
 *         description: Internal server error
 */
router.route("/delete/:bookId/:authorId").delete(verifyUser, deleteBookById);

/**
 * @swagger
 * /api/book/update/{bookId}/{authorId}:
 *   patch:
 *     tags: [Book-Routes]
 *     summary: Update the book details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: Id of the book to be updated
 *         schema:
 *           type: string
 *       - in: path
 *         name: authorId
 *         required: true
 *         description: Id of the author who added the book
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookName:
 *                 type: string
 *               genre:
 *                 type: string
 *                 enum:
 *                   - FANTASY
 *                   - CLASSICS
 *                   - DYSTOPIAN
 *                   - HISTORICAL_FICTION
 *                   - MYSTERY
 *                   - CONTEMPORARY_FICTION
 *                   - ADVENTURE
 *                   - FICTION
 *               published_date:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully updated book details
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         $ref: "#/components/responses/ForbiddenError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.route("/update/:bookId/:authorId").patch(verifyUser, updateBook);

/**
 * @swagger
 * /api/book/getbook/{bookId}:
 *   get:
 *     tags: [Book-Routes]
 *     summary: Get Book details by unique book Id
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: Id of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details fetched successfully
 *       500:
 *         description: Internal server error
 */
router.route("/getbook/:bookId").get(getBookById);

/**
 * @swagger
 * /api/book/get-books-by-date:
 *   get:
 *     tags: [Book-Routes]
 *     summary: Get the book posted between certain dates
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         description: from a date when book was added
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         description: to a date before when book was added
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Book fetched successfully
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         description: Internal server error
 */
router.route("/get-books-by-date").get(getBookByDate);

router.route("/getbooks/:pageNo").get(getBooksByPage);
router.route("/get-data").get(getAllData);

module.exports = router;
