const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");

const GetPaymentDetailsById = async (call, callback) => {
  try {
    const { paymentId } = call.request;

    const metadata = call.metadata;
    const { id } = metadata.get("decodedToken")[0];

    if (!paymentId) {
      return callback({
        details: "Failed to get the payment Id",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const [payment, _] = await sequelize.query(
      "SELECT * FROM payments WHERE id= :paymentId",
      {
        replacements: {
          paymentId: paymentId,
        },
      }
    );

    if (payment.length === 0) {
      return callback({
        details: "Payment not found",
        code: grpc.status.NOT_FOUND,
      });
    }

    const [paymentDetails] = await sequelize.query(
      "SELECT c.fullName as customerName,b.bookName as bookName FROM orders o INNER JOIN books b on o.bookId = b.id INNER JOIN customers c ON c.id = o.customerId WHERE o.id = :orderId AND c.id = :customerId",
      {
        replacements: {
          orderId: payment[0].orderId,
          customerId: id,
        },
      }
    );

    if (paymentDetails.length === 0) {
      return callback({
        details: "Details not found",
        code: grpc.status.NOT_FOUND,
      });
    }
    return callback(null, {
      payment: {
        [payment[0].id]: payment[0],
      },
      bookName: paymentDetails[0].bookName,
      customerName: paymentDetails[0].customerName,
    });
  } catch (error) {
    console.log(error);
    return callback({
      details: "Failed to get payment details",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = GetPaymentDetailsById;
