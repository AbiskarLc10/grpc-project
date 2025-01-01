const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");
const { Sequelize } = require("../../db/models");
const { Order, Payment } = require("../../db/models/index");

const InitiateOrderPayment = async (call, callback) => {
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
        details: "You order was already delivered",
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
          { where: { orderId: orderId }, transaction: paymentTransaction }
        );
        console.log(`Payment status for order ${orderId} updated to Pending.`);
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

module.exports = InitiateOrderPayment;
