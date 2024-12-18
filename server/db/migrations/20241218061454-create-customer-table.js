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

    await queryInterface.createTable("Customers",{
        id: {
          type: Sequelize.UUID,
          primaryKey:true,
          defaultValue: Sequelize.UUIDV4,
          allowNull:false
        },
        email:{
          type: Sequelize.STRING,
          allowNull:false,
          unique:true
        },
        password:{
          type: Sequelize.STRING,
          allowNull:false
        },
        address:{
          type: Sequelize.STRING,
          allowNull:false
        },
        profileImage:{
          type:Sequelize.STRING,
          allowNull:true
        },
        
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
