const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const {
  addBookReview,
  deleteReview,
  editBookReview,
  getBookReviewsById,
} = require("../Controllers/review-controllers");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Review-Routes
 *   description: CRUD operation for book review
 */

/**
 * @swagger
 * /api/review/add-book-review/{bookId}:
 *   post:
 *     tags: [Review-Routes]
 *     summary: Add review to a particular book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: Id of the book being reviewed
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               ratings:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Review added to book successfully
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         $ref: "#/components/responses/ForbiddenError"
 *       500:
 *         description: Internal server error
 */
router.route("/add-book-review/:bookId").post(verifyUser, addBookReview);

/**
 * @swagger
 * /api/review/delete-review/{bookId}/{reviewId}:
 *   delete:
 *     tags: [Review-Routes]
 *     summary: Delete review to a book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: Id of the book which has been reviewed
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         description: Id of the review to be deleted
 *         schema:
 *           type: string
 *     requestBody:
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         $ref: "#/components/responses/ForbiddenError"
 *       500:
 *         description: Internal Server Error
 */
router
  .route("/delete-review/:bookId/:reviewId")
  .delete(verifyUser, deleteReview);

/**
 * @swagger
 * /api/edit-review/{bookId}/{reviewId}:
 *   patch:
 *     tags: [Book-Routes]
 *     summary: Edit the posted review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: Id of the reviewed book
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         description: Id of the review to be edited
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               ratings:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Review edited successfully
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         $ref: "#/components/responses/ForbiddenError"
 *       500:
 *         description: Internal server error
 */

router
  .route("/edit-review/:bookId/:reviewId")
  .patch(verifyUser, editBookReview);
router.route("/get-reviews/:bookId").get(verifyUser, getBookReviewsById);

module.exports = router;
