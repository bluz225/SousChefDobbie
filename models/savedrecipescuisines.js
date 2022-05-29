'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class savedrecipesCuisines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  savedrecipesCuisines.init({
    savedrecipeId: DataTypes.INTEGER,
    cuisineId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'savedrecipesCuisines',
  });
  return savedrecipesCuisines;
};