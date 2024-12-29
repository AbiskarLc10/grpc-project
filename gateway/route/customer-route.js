const express = require("express");
const {
  cancelBookOrder,
  createBookOrder,
  getOrderDetails,
  signInCustomer,
  signUpCustomer,
} = require("../Controllers/customer-controllers");
const router = express.Router();

router.route("/sign-up").post(signUpCustomer);
router.route("/sign-in").post(signInCustomer);
router.route("/order-book/:bookId").post(createBookOrder);
router.route("/cancel-order/:orderId").delete(cancelBookOrder);
router.route("/get-order/:orderId").get(getOrderDetails);


module.exports = router;
