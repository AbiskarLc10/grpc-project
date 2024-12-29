const express = require("express");
const router = express.Router();
const {
  initiateOrderPayment,
  paymentCancel,
  paymentSuccess,
} = require("../Controllers/payment-controllers");

router.route("/initiate-payment/:orderId").post(initiateOrderPayment);
router.route("/success").get(paymentSuccess);
router.route("/cancel").get(paymentCancel);

module.exports = router;
