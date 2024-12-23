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

    await queryInterface.addIndex("Reviews", {
      name: "Unique_review_index",
      unique: true,
      fields: ["bookId", "reviewerId"],
    });

    await queryInterface.addColumn("Books", "stock", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex("Reviews", "Unique_review_index");
  },
};
