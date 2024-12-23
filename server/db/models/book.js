"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.belongsTo(models.Author, {
        foreignKey: "authorId",
        as: "author",
      });
    }
  }

  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: uuidv4,
      },
      bookName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: false,
      },
      average_ratings: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 3.5,
      },
      published_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
    },
    {
      sequelize,
      modelName: "Book",
      timestamps: true,
      paranoid: true,
    }
  );

  return Book;
};
