'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savedrecipesIngredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      savedrecipeId: {
        type: Sequelize.INTEGER
      },
      ingredientId: {
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
    await queryInterface.dropTable('savedrecipesIngredients');
  }
};