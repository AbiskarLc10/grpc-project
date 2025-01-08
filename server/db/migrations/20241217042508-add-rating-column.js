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
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 3
    });

    await queryInterface.addColumn("Books","average_ratings",{
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 3.5
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
    await queryInterface.removeColumn("Books","average_ratings");
  },
};
