const express = require("express");
require("dotenv").config();
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const grpc = require("@grpc/grpc-js");
const customErrorHandler = require("../errors/customError");
const PaymentClient = require("../grpc-client/paymentClient");

router.route("/initiate-payment/:orderId").post(async (req, res, next) => {
  const { orderId } = req.params;
  const token = req.headers.authorization;
  if (!token) {
    return customErrorHandler(
      {
        details: "Token not found.Please login!",
        code: 401,
      },
      next
    );
  }

  if (!orderId) {
    return customErrorHandler(
      {
        details: "Failed to get the parameters",
        code: 404,
      },
      next
    );
  }
  const metadata = new grpc.Metadata();
  metadata.add("token", token);
  try {
    const response = await new Promise((resolve, reject) => {
      PaymentClient.InitiateOrderPayment(
        { orderId },
        metadata,
        (error, response) => {
          if (error) {
            reject({
              details: error.details,
              code: error.code,
            });
          }
          resolve(response);
        }
      );
    });

    if (response.success) {
      console.log(response);
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: response.bookName,
              },
              unit_amount: response.price * 100,
            },
            quantity: response.quantity,
          },
        ],
        mode: "payment",
        success_url: `${process.env.BASE_URL}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/api/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          orderId: response.paymentDetails.orderId,
          paymentId: response.paymentDetails.id,
        },
      });

      return res.status(200).json({
        paymentUrl: session.url,
      });
    }
  } catch (error) {
    console.log(error);
    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
});
router.route("/success").get(async (req, res, next) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const { orderId, paymentId } = session.metadata;

    const response = await new Promise((resolve, reject) => {
      PaymentClient.PaymentSuccess(
        { orderId, paymentId },
        (error, response) => {
          if (error) {
            reject({
              details: error.details,
              code: error.code,
            });
          }
          resolve(response);
        }
      );
    });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
});

router.route("/cancel").get(async (req, res, next) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const { orderId, paymentId } = session.metadata;

    const response = await new Promise((resolve, reject) => {
      PaymentClient.PaymentCancel({ orderId, paymentId }, (error, response) => {
        if (error) {
          reject({
            details: error.details,
            code: error.code,
          });
        }
        resolve(response);
      });
    });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    return customErrorHandler(
      {
        details: error.details || error.message,
        code: error.code,
      },
      next
    );
  }
});

module.exports = router;
