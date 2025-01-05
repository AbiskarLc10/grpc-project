const express = require("express");
const {
  SignUpAuthor,
  SignInAuthor,
} = require("../Controllers/auth-controllers");
const router = express.Router();
  /**
    * @swagger
    * tags:
    *   name: Author-Authorization
    *   description: Api endpoints for authorization
    */
/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     tags: [Author-Authorization]
 *     summary: Sign up author
 *     description: Sign up a new author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               genre:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date  # Added format for date_of_birth
 *     responses:
 *       201:
 *         description: Author successfully signed up
 *       400:
 *         description: Invalid input or missing fields
 */
router.route("/sign-up").post(SignUpAuthor);

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     tags: [Author-Authorization]
 *     summary: Sign in author
 *     description: This route allows you to receive a token for valid credentials and perform all the author actions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author logged in successfully and token received.
 *       400:
 *         description: Invalid input or missing fields.
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 */
router.route("/sign-in").post(SignInAuthor);

module.exports = router;
