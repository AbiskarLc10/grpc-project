const grpc = require("@grpc/grpc-js");
const sequelize = require("../db/connection");
const { Sequelize } = require("../db/models");
const { Order, Payment } = require("../db/models/index");

class PaymentService {
  InitiateOrderPayment = async (call, callback) => {
    const paymentTransaction = await sequelize.transaction();
    const decodedData = call.metadata.get("decodedToken");
    const { id } = decodedData[0];
    const { orderId } = call.request;
    let newPayment;

    if (!orderId) {
      return callback({
        details: "Required argument missing",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }

    try {
      const orderDetails = await Order.findOne({
        where: {
          id: orderId,
          customerId: id,
        },
        transaction: paymentTransaction,
      });

      if (!orderDetails) {
        return callback({
          details: "Order not found",
          code: grpc.status.NOT_FOUND,
        });
      }
      if (orderDetails.orderStatus === "DELIVERED") {
        return callback({
          details: "You order has already delivered",
          code: grpc.status.ALREADY_EXISTS,
        });
      }

      let payment = await Payment.findOne({
        where: {
          orderId: orderId,
        },
        transaction: paymentTransaction,
      });

      if (payment) {
        if (payment.paymentStatus === "Failed") {
          await Payment.update(
            { paymentStatus: "Pending" },
            { where: { orderId: orderId }, transaction: paymentTransaction}
          );
          console.log(
            `Payment status for order ${orderId} updated to Pending.`
          );
        } else if (payment.paymentStatus === "Completed") {
          return callback({
            details: "Payment already initiated or in a different state",
            code: grpc.status.ALREADY_EXISTS,
          });
        }
      } else {
        newPayment = await Payment.create(
          {
            orderId: orderId,
            totalAmount: orderDetails.price * orderDetails.quantity,
          },
          { transaction: paymentTransaction }
        );

        if (!newPayment) {
          return callback({
            details: "Failed to resolve payment initiation",
            code: grpc.status.ABORTED,
          });
        }
      }

      const bookExtraDetails = await sequelize.query(
        `SELECT b.bookname AS bookName, b.price AS price, o.quantity AS quantity
             FROM payments p
             INNER JOIN orders o ON p.orderId = o.id
             INNER JOIN books b ON o.bookId = b.id
             WHERE p.orderId = :orderId`,
        {
          replacements: { orderId },
          type: Sequelize.QueryTypes.SELECT,
          transaction: paymentTransaction,
        }
      );

      await paymentTransaction.commit();

      return callback(null, {
        paymentDetails: newPayment || payment,
        success: true,
        price: bookExtraDetails[0].price,
        quantity: bookExtraDetails[0].quantity,
        bookName: bookExtraDetails[0].bookName,
      });
    } catch (error) {
      await paymentTransaction.rollback();
      console.log(error);
      return callback({
        details: "Failed to initiate payment",
        code: grpc.status.INTERNAL,
      });
    }
  };

  PaymentSuccess = async (call, callback) => {
    const { orderId, paymentId, paymentMethodId, paymentIntendId } =
      call.request;
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

  PaymentCancel = async (call, callback) => {
    const { orderId, paymentId } = call.request;
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
        await Payment.update(
          {
            paymentStatus: "Failed",
          },
          {
            where: {
              id: paymentId,
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
        message: "Payment Failed",
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
}

module.exports = PaymentService;
