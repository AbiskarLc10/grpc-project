const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const {
  UpdateAuthor,
  DeleteAuthor,
  SignOutAuthor,
  getAuthorById,
} = require("../Controllers/author-controllers");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Author-Actions
 *   description: Author can now use these endpoints if they are authenticated
 */

/**
 * @swagger
 * /api/author/update/{authorId}:
 *   patch:
 *     tags: [Author-Actions]
 *     summary: Update author details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         description: Id of the author
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               genre:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date  # Ensuring date format
 *     responses:
 *       200:
 *         description: Author details updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 */

router.route("/update/:authorId").patch(verifyUser, UpdateAuthor);

/**
 * @swagger
 * /api/author/delete/{authorId}:
 *   delete:
 *     tags: [Author-Actions]
 *     summary: Delete Author Account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         description: Id of the author to be deleted
 *         type: string
 *     responses:
 *       200:
 *         description: Author account deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 */

router.route("/delete/:authorId").delete(verifyUser, DeleteAuthor);

/**
 * @swagger
 * /api/author/sign-out/{authorId}:
 *   delete:
 *     tags: [Author-Actions]
 *     summary: Sign out account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         description: Id of the author to be signed out
 *         type: string
 *     responses:
 *       200:
 *         description: Author signed out successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 */

router.route("/sign-out/:authorId").delete(verifyUser, SignOutAuthor);

/**
 * @swagger
 * /api/author/{authorId}:
 *   get:
 *     tags: [Author-Actions]
 *     summary: Get author details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         description: Id of the author whose details are to be fetched
 *         type: string
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author details fetched successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: "#/components/responses/ForbiddenError"
 *       500:
 *         description: Internal server error
 */

router.route("/:authorId").get(verifyUser, getAuthorById);

module.exports = router;
