'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class savedrecipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.savedrecipe.belongsTo(models.user)
      models.savedrecipe.belongsToMany(models.ingredient, {through: "savedrecipesIngredients"})
      models.savedrecipe.belongsToMany(models.cuisine, {through: "savedrecipesCuisines"})
      models.ingredient.hasMany(models.amount)
    }
  }
  savedrecipe.init({
    title: DataTypes.STRING,
    summary: DataTypes.TEXT,
    imageurl: DataTypes.STRING,
    instructions: DataTypes.TEXT,
    osprecipeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'savedrecipe',
  });
  return savedrecipe;
};