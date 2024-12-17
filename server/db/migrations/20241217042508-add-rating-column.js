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

    await queryInterface.addColumn("Reviews", "ratings", {
      type: Sequelize.ENUM([
        "EXTREMLY_BAD",
        "POOR",
        "AVERAGE",
        "GOOD",
        "EXCELLENT",
      ]),
      allowNull: false,
      defaultValue: "AVERAGE"
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("Reviews","ratings");
  },
};
