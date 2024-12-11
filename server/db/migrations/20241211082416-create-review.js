'use strict';

const { UUIDV4 } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: UUIDV4
      },
      bookId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reviewerId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint("Reviews", {
      type:'foreign key',
      name: "FK_Book_review",
      fields: ['bookId'],
      references: {
        field: 'id',
        table: 'Books'
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });

    await queryInterface.addConstraint("Reviews", {
      type:'foreign key',
      name: "FK_Author_review",
      fields: ['reviewerId'],
      references: {
        field: 'id',
        table: 'Authors'
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Reviews', 'FK_Book_review');
    await queryInterface.removeConstraint('Reviews', 'FK_Author_review');

    await queryInterface.dropTable('Reviews');
  }
};
