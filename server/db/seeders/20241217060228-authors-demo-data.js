"use strict";
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert("Authors", [
      {
        id: uuidv4(),
        name: "J.K. Rowling",
        email: "jk.rowling@example.com",
        password: await bcrypt.hash("HashedPassword@123",10), // you should hash passwords in production
        genre: "FANTASY",
        date_of_birth: "1965-07-31",
        profileImage: "https://example.com/images/jk_rowling.jpg",
      },
      {
        id: uuidv4(),
        name: "George R.R. Martin",
        email: "george.martin@example.com",
        password: await bcrypt.hash("HashedPassword@123",10),
        genre: "FANTASY",
        date_of_birth: "1948-09-20",
        profileImage: "https://example.com/images/george_rr_martin.jpg",
      },
      {
        id: uuidv4(),
        name: "Agatha Christie",
        email: "agatha.christie@example.com",
        password: await bcrypt.hash("HashedPassword@123",10),
        genre: "MYSTERY",
        date_of_birth: "1890-09-15",
        profileImage: "https://example.com/images/agatha_christie.jpg",
      },
      {
        id: uuidv4(),
        name: "J.R.R. Tolkien",
        email: "jrr.tolkien@example.com",
        password: await bcrypt.hash("HashedPassword@123",10),
        genre: "FANTASY",
        date_of_birth: "1892-01-03",
        profileImage: "https://example.com/images/jrr_tolkien.jpg",
      },
      {
        id: uuidv4(),
        name: "Isaac Asimov",
        email: "isaac.asimov@example.com",
        password: await bcrypt.hash("HashedPassword@123",10),
        genre: "Fiction",
        date_of_birth: "1920-01-02",
        profileImage: "https://example.com/images/isaac_asimov.jpg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
