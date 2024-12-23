"use strict";

const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reviews", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: UUIDV4,
      },
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reviewerId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      ratings: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 3,
      },
      reviewerType: {
        type: Sequelize.ENUM("Author", "Customer"),
        allowNull: false,
        defaultValue: "Author",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("Reviews", {
      type: "foreign key",
      name: "FK_Book_review",
      fields: ["bookId"],
      references: {
        field: "id",
        table: "Books",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Reviews", {
      type: "check",
      name: "reviewer_type_check",
      fields: ["reviewerType"],
      where: {
        reviewerType: ["Author", "Customer"],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Reviews", "FK_Book_review");
    await queryInterface.removeConstraint("Reviews", "reviewer_type_check");

    await queryInterface.dropTable("Reviews");
  },
};
