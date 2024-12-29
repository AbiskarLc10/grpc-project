const bcrypt = require("bcrypt");
const grpc = require("@grpc/grpc-js");
const sequelize = require("../db/connection");
const { Sequelize } = require("../db/models");
const { Customer, Book, Order, Payment } = require("../db/models/index");
const jwt = require("jsonwebtoken");
class CustomerService {
  SignUpCustomer = async (call, callback) => {
    try {
      const { fullName, email, password, address, dateOfBirth } = call.request;

      if (!fullName || !email || !password || !address || !dateOfBirth) {
        return callback({
          details: "Please provide all fields",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const [checkUserExists] = await sequelize.query(
        "SELECT * FROM customers WHERE email= :email",
        {
          replacements: {
            email,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (checkUserExists && checkUserExists.length === 1) {
        return callback({
          details: "Customer with this email already exists",
          code: grpc.status.ALREADY_EXISTS,
        });
      }

      const newCustomer = await Customer.create({
        fullName,
        email,
        password: await bcrypt.hash(password, 10),
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        address,
      });
      if (!newCustomer) {
        return callback({
          details: "Failed to create user",
          code: grpc.status.FAILED_PRECONDITION,
        });
      }

      return callback(null, {
        message: "Customer created successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to sign up customer",
        code: grpc.status.INTERNAL,
      });
    }
  };

  SignInCustomer = async (call, callback) => {
    try {
      const { email, password } = call.request;

      if (!email || !password) {
        return callback({
          details: "Please provide credentials",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const [checkCustomerExists] = await sequelize.query(
        "SELECT * FROM customers WHERE email = :email",
        {
          replacements: {
            email,
          },
        }
      );

      if (checkCustomerExists.length === 0) {
        return callback({
          details: "User with this email does not exists",
          code: grpc.status.NOT_FOUND,
        });
      }

      console.log(checkCustomerExists[0].password);
      const isValidPassword = await bcrypt.compare(
        password,
        checkCustomerExists[0].password
      );

      if (!isValidPassword) {
        return callback({
          details: "Invalid credentials",
          code: grpc.status.UNAUTHENTICATED,
        });
      }

      const token = jwt.sign(
        {
          id: checkCustomerExists[0].id,
          isAuthor: false,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1hr",
        }
      );

      return callback(null, {
        customer: checkCustomerExists[0],
        success: isValidPassword,
        token: token,
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to sign in customer",
        code: grpc.status.INTERNAL,
      });
    }
  };

  OrderBook = async (call, callback) => {
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

  CancelBookOrder = async (call, callback) => {
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

  GetOrderDetails = async (call, callback) => {
    try {
      const decodedData = call.metadata.get("decodedToken");
      const { id } = decodedData[0];
      const { orderId } = call.request;
      if (!orderId) {
        return callback({
          details: "Required argument missing",
          code: grpc.status.INVALID_ARGUMENT,
        });
      }

      const orderDetails = await Order.findOne({
        where: {
          id: orderId,
          customerId: id,
        },
      });

      if (!orderDetails) {
        return callback({
          details: "Order not found",
          code: grpc.status.NOT_FOUND,
        });
      }

      return callback(null, {
        order: { ...orderDetails.dataValues, status: orderDetails.orderStatus },
      });
    } catch (error) {
      console.log(error);
      return callback({
        details: "Failed to fetch details",
        code: grpc.status.INTERNAL,
      });
    }
  };
}

module.exports = CustomerService;
