"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //   Customer.hasMany(models.Book, {
      //     foreignKey: "authorId",
      //     as: "books",
      //   });
    }
  }
  Customer.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: uuidv4,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address:{
        type: DataTypes.STRING,
        allowNull:false
      },
      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "SUSPENDED", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Customer",
      timestamps: true,
    }
  );
  return Customer;
};
