"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("Orders", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      orderStatus: {
        type: Sequelize.ENUM("PENDING", "FAILED", "DELIVERED"),
        defaultValue: "PENDING",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addConstraint("Orders", {
      type: "foreign key",
      fields: ["customerId"],
      references: {
        field: "id",
        table: "Customers",
      },
      name: "fk_orders_customers",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Orders", {
      type: "foreign key",
      fields: ["bookId"],
      references: {
        field: "id",
        table: "Books",
      },
      name: "fk_orders_books",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("Orders","fk_orders_customers");
    await queryInterface.removeConstraint("Orders","fk_orders_books");
    await queryInterface.dropTable("Orders");

  },
};
