const express = require("express");
const {
  cancelBookOrder,
  createBookOrder,
  getOrderDetails,
  signInCustomer,
  signUpCustomer,
} = require("../Controllers/customer-controllers");
const { SignInWithGoogle, GoogleCallbackFunction } = require("../Controllers/google-auth-controllers");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Customer-Routes
 *   description: Routes for customer authentication and order CRUD
 */

/**
 * @swagger
 * /api/customer/sign-up:
 *  post:
 *    tags: [Customer-Routes]
 *    summary: Sign Up customer account
 *    requestBody:
 *       required: true
 *       content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  fullName:
 *                     type: string
 *                  email:
 *                     type: string
 *                  password:
 *                     type: string
 *                  address:
 *                     type: string
 *                  dateOfBirth:
 *                     type: string
 *                     format: date
 *    responses:
 *        201:
 *          description: Customer sign up successful
 *        500:
 *          description: Internal server error
 */
router.route("/sign-up").post(signUpCustomer);

/**
 * @swagger
 * /api/customer/sign-in:
 *  post:
 *    tags: [Customer-Routes]
 *    summary: Sign In customer account
 *    requestBody:
 *        required: true
 *        content:
 *           application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      email:
 *                        type: string
 *                      password:
 *                        type: string
 *    responses:
 *        200:
 *          description: Customer sign in successful
 *        500:
 *          description: Internal server error
 */
router.route("/sign-in").post(signInCustomer);

router.route("/google/sign-in").get(SignInWithGoogle);

// router.route("/google/callback").get(GoogleCallbackFunction);

/**
 * @swagger
 * /api/customer/order-book/{bookId}:
 *  post:
 *    tags: [Customer-Routes]
 *    summary: Order your book of choice
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: bookId
 *        description: Id of the book you want to order
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  quantity:
 *                     type: integer
 *    responses:
 *        200:
 *         description: Order created successfully
 *        401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *        403:
 *         $ref: "#/components/responses/ForbiddenError"
 *        500:
 *         description: Internal Server Error
 */
router.route("/order-book/:bookId").post(createBookOrder);

/**
 * @swagger
 * /api/customer/cancel-order/{orderId}:
 *   delete:
 *     tags: [Customer-Routes]
 *     summary: Cancel the ordered book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Id of the order to be cancelled
 *         schema:
 *            type: string
 *     responses:
 *       200:
 *        description: Order cancelled successfully
 *       401:
 *        $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *        $ref: "#/components/responses/ForbiddenError"
 *       500:
 *        description: Internal Server Error
 */
router.route("/cancel-order/:orderId").delete(cancelBookOrder);

/**
 * @swagger
 * /api/customer/get-order/{orderId}:
 *  get:
 *   tags: [Customer-Routes]
 *   summary: Get the details about your order
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *     - in: path
 *       name: orderId
 *       required: true
 *       description: Id of the order
 *       schema:
 *        type: string
 *   responses:
 *     200:
 *      description: Order details fetched successfully
 *     401:
 *      $ref: "#/components/responses/UnauthorizedError"
 *     403:
 *      $ref: "#/components/responses/ForbiddenError"
 *     500:
 *      description: Internal server Error
 */
router.route("/get-order/:orderId").get(getOrderDetails);

module.exports = router;
