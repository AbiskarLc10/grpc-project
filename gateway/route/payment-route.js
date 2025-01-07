const express = require("express");
const router = express.Router();
const {
  initiateOrderPayment,
  paymentCancel,
  paymentSuccess,
  getPaymentDetails,
} = require("../Controllers/payment-controllers");

/**
 * @swagger
 *  tags:
 *   name: Payment-Routes
 *   description: Routes for book payment initiation
 */

/**
 * @swagger
 * /api/payment/initiate-payment/{orderId}:
 *  post:
 *    tags: [Payment-Routes]
 *    summary: Initiate your book payment with stripe
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: orderId
 *        description: Id of the order whose payment is to be done
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *       description: Payment initiated successfully
 *      401:
 *       $ref: "#/components/responses/UnauthorizedError"
 *      403:
 *       $ref: "#/components/responses/ForbiddenError"
 *      500:
 *       description: Internal server error
 */
router.route("/initiate-payment/:orderId").post(initiateOrderPayment);
router.route("/success").get(paymentSuccess);
router.route("/cancel").get(paymentCancel);
/**
 * @swagger
 * /api/payment/get-payment-details/{paymentId}:
 *  get:
 *   tags: [Payment-Routes]
 *   summary: Get the details about your payment
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *     - in: path
 *       name: paymentId
 *       description: Id of the payment
 *       required: true
 *       schema:
 *        type: string
 *   responses:
 *    200:
 *     description: Order details fetched successfully
 *    401:
 *     $ref: "#/components/responses/UnauthorizedError"
 *    403:
 *     $ref: "#/components/responses/ForbiddenError"
 *    500:
 *     description: Internal server error
 */

router.route("/get-payment-details/:paymentId").get(getPaymentDetails);

module.exports = router;
