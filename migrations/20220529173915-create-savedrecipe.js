'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savedrecipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      summary: {
        type: Sequelize.TEXT
      },
      imageurl: {
        type: Sequelize.STRING
      },
      instructions: {
        type: Sequelize.TEXT
      },
      osprecipeId: {
        type: Sequelize.INTEGER
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('savedrecipes');
  }
};