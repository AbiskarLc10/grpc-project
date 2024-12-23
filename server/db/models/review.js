"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      if (this.reviewerType === "Author") {
        Review.belongsTo(models.Author, {
          foreignKey: "reviewerId",
          as: "reviewer",
        });
      } else if (this.reviewerType === "Customer") {
        Review.belongsTo(models.Customer, {
          foreignKey: "reviewerId",
          as: "reviewer",
        });
      }
      Review.belongsTo(models.Book, {
        foreignKey: "bookId",
        as: "book",
      });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: uuidv4,
      },
      bookId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reviewerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reviewerType: {
        type: DataTypes.ENUM("Author", "Customer"),
        defaultValue: "Author",
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ratings: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 3,
      },
    },
    {
      sequelize,
      modelName: "Review",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ["reviewerId", "bookId"],
        },
      ],
    }
  );
  return Review;
};
