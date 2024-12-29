'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("Payments","paymentIntendId",{
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Payments","paymentMethodId",{
        type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("Payments","paymentIntendId");
    await queryInterface.removeColumn("Payments","paymentMethodId");
  }
};
