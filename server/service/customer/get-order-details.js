const grpc = require("@grpc/grpc-js");
const { Order } = require("../../db/models/index");

const GetOrderDetails = async (call, callback) => {
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


module.exports = GetOrderDetails;