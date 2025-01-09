const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");
const { Book, Order } = require("../../db/models/index");

const CancelBookOrder = async (call, callback) => {
  const decodedData = call.metadata.get("decodedToken");
  const { id } = decodedData[0];
  const { orderId } = call.request;
  const cancelOrderTransaction = await sequelize.transaction();
  try {
    const checkOrder = await Order.findOne({
      where: {
        id: orderId,
        customerId: id,
      },
    });

    if (!checkOrder) {
      return callback({
        details: "Order does not exists",
        code: grpc.status.NOT_FOUND,
      });
    }
    if (checkOrder.orderStatus === "DELIVERED") {
      return callback({
        details: "Order payment has already been done in delivery stage",
        code: grpc.status.PERMISSION_DENIED,
      });
    }

    const findBook = await Book.findOne({
      where: {
        id: checkOrder.bookId,
      },
    });

    let { stock } = findBook;

    stock = stock + checkOrder.quantity;
    await Order.destroy({
      where: {
        id: orderId,
        customerId: id,
      },
      transaction: cancelOrderTransaction,
    });

    const [affectedCount] = await Book.update(
      {
        stock: stock,
      },
      {
        where: {
          id: findBook.id,
        },
        transaction: cancelOrderTransaction,
      }
    );

    if (affectedCount === 0) {
      throw {
        details: "Failed to update table",
        code: grpc.status.UNKNOWN,
      };
    }

    await cancelOrderTransaction.commit();

    return callback(null, {
      message: "Order cancelled successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    await cancelOrderTransaction.rollback();
    return callback({
      details: "Failed to cancel your order",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = CancelBookOrder;
