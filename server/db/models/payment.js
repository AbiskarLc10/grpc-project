"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
    }
  }
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM("CreditCard", "BankTransfer", "PhonePay"),
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM("Pending", "Completed", "Failed", "Refunded"),
        allowNull: false,
        defaultValue: "Pending",
      },
    },
    {
      sequelize,
      modelName: "Payment",
      timestamps: true,
    }
  );
  return Payment;
};
