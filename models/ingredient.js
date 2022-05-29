'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ingredient.belongsToMany(models.savedrecipe, {through: "savedrecipesIngredients"})
      models.ingredient.hasMany(models.incat)
    }
  }
  ingredient.init({
    name: DataTypes.STRING,
    protein: DataTypes.FLOAT,
    carb: DataTypes.FLOAT,
    calories: DataTypes.FLOAT,
    fat: DataTypes.FLOAT,
    incatId: DataTypes.INTEGER,
    gtinUpc: DataTypes.INTEGER,
    brandName: DataTypes.STRING,
    fdcId: DataTypes.INTEGER,
    servingsize: DataTypes.FLOAT,
    servingsizeunit: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ingredient',
  });
  return ingredient;
};