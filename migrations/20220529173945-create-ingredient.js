'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ingredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      protein: {
        type: Sequelize.STRING
      },
      carb: {
        type: Sequelize.STRING
      },
      calories: {
        type: Sequelize.STRING
      },
      fat: {
        type: Sequelize.STRING
      },
      incatId: {
        type: Sequelize.INTEGER
      },
      gtinUpc: {
        type: Sequelize.STRING
      },
      brandName: {
        type: Sequelize.STRING
      },
      fdcId: {
        type: Sequelize.INTEGER
      },
      servingsize: {
        type: Sequelize.FLOAT
      },
      servingsizeunit: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ingredients');
  }
};