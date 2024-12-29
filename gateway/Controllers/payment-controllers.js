const grpc = require("@grpc/grpc-js");
require("dotenv").config();
const customErrorHandler = require("../errors/customError");
const PaymentClient = require("../grpc-client/paymentClient");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const initiateOrderPayment = async (req, res, next) => {
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
};

const paymentSuccess = async (req, res, next) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const { orderId, paymentId } = session.metadata;

    let paymentMethodId;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );
    paymentMethodId = paymentIntent.payment_method;
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    console.log(paymentMethod);

    const response = await new Promise((resolve, reject) => {
      PaymentClient.PaymentSuccess(
        {
          orderId,
          paymentId,
          paymentIntendId: paymentIntent.id,
          paymentMethodId,
        },
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
};

const paymentCancel = async (req, res, next) => {
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
};

module.exports = { paymentCancel, initiateOrderPayment, paymentSuccess };
