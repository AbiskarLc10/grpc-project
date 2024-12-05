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
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authorId: { 
        type: DataTypes.UUID,
        allowNull: false,
      },
      publishedDate: { 
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "Book",  
      timestamps: true,   
    }
  );

  return Book;
};
