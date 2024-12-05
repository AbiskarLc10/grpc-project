"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Books", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      bookName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      authorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      published_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint("Books", {
      type: "foreign key",
      fields: ["authorId"],
      references: {
        field: 'id',
        table: "Authors"
      },
      name: "FK_author_book",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Books", "FK_author_book");
    await queryInterface.dropTable("Books");
  },
};
