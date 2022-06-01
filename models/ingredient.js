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
      models.ingredient.hasOne(models.amount)
    }
  }
  ingredient.init({
    name: DataTypes.STRING,
    protein: DataTypes.STRING,
    carb: DataTypes.STRING,
    calories: DataTypes.STRING,
    fat: DataTypes.STRING,
    incatId: DataTypes.INTEGER,
    gtinUpc: DataTypes.STRING,
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