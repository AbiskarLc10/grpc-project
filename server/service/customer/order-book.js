const grpc = require("@grpc/grpc-js");
const sequelize = require("../../db/connection");
const {Book, Order,  } = require("../../db/models/index");

const OrderBook = async (call, callback) => {
  const data = call.metadata.get("decodedToken");

  const { id, isAuthor } = data[0];

  const { bookId, quantity } = call.request;

  if (isAuthor) {
    return callback({
      details: "Please create a customer account to purchase book",
      code: grpc.status.CANCELLED,
    });
  }
  const transaction = await sequelize.transaction();
  try {
    const checkBookExists = await Book.findOne({
      where: {
        id: bookId,
      },
    });

    if (!checkBookExists) {
      return callback({
        details: "Book does not exists",
        code: grpc.status.NOT_FOUND,
      });
    }

    let price = checkBookExists.price;

    if (checkBookExists.stock < quantity) {
      return callback({
        details: `${checkBookExists.stock} are avaiable on stock`,
        code: grpc.status.CANCELLED,
      });
    }
    const newOrder = await Order.create(
      {
        bookId,
        customerId: id,
        price: price,
        quantity: quantity,
      },
      {
        transaction: transaction,
      }
    );

    await Book.update(
      {
        stock: checkBookExists.stock - quantity,
      },

      {
        where: {
          id: bookId,
        },
        transaction: transaction,
      }
    );

    await transaction.commit();
    return callback(null, {
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return callback({
      details: "Failed to initiate book order",
      code: grpc.status.INTERNAL,
    });
  }
};

module.exports = OrderBook;
