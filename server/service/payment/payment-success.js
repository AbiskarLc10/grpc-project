const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");
const { Order, Payment } = require("../../db/models/index");

const PaymentSuccess = async (call, callback) => {
  const { orderId, paymentId, paymentMethodId, paymentIntendId } = call.request;
  const paymentTransaction = await sequelize.transaction();
  try {
    if (!orderId || !paymentId) {
      return callback({
        details: "Failed to get the required parameters",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    const order = await Order.findOne({
      where: {
        id: orderId,
      },
      transaction: paymentTransaction,
    });

    if (!order) {
      return callback({
        details: "Order does not exists",
        code: grpc.status.NOT_FOUND,
      });
    }

    let payment = await Payment.findOne({
      where: {
        id: paymentId,
        orderId: orderId,
      },
      transaction: paymentTransaction,
    });

    if (!payment) {
      return callback({
        details: "Payment not found",
        code: grpc.status.NOT_FOUND,
      });
    }

    if (payment.paymentStatus === "Pending") {
      await sequelize.query(
        "UPDATE payments SET paymentStatus= :paymentStatus, paymentIntendId= :paymentIntendId, paymentMethodId= :paymentMethodId WHERE id = :id",
        {
          replacements: {
            paymentStatus: "Completed",
            paymentIntendId,
            paymentMethodId,
            id: paymentId,
          },
          transaction: paymentTransaction,
        }
      );

      await Order.update(
        {
          orderStatus: "DELIVERED",
        },
        {
          where: {
            id: orderId,
          },
          transaction: paymentTransaction,
        }
      );
    } else if (payment.paymentStatus === "Completed") {
      return callback({
        details: "Payment is already completed for the order",
        code: grpc.status.CANCELLED,
      });
    } else if (payment.paymentStatus === "Failed") {
      return callback({
        details: "Please initiate you payment again",
        code: grpc.status.FAILED_PRECONDITION,
      });
    }

    await paymentTransaction.commit();
    return callback(null, {
      success: true,
      message: "Payment completed",
    });
  } catch (error) {
    console.log(error);
    await paymentTransaction.rollback();
    return callback({
      details: "Failed to update payment status",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = PaymentSuccess;
