"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      //defining association
      Order.belongsTo(models.Book, {
        foreignKey: "bookId",
        as: "book",
      });
      Order.belongsTo(models.Customer, {
        foreignKey: "customerId",
        as: "customer",
      });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4,
      },
      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      bookId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      orderStatus: {
        type: DataTypes.ENUM("PENDING", "FAILED", "DELIVERED"),
        defaultValue: "PENDING",
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Order",
    }
  );

  return Order
};
