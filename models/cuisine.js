'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.cuisine.belongsToMany(models.savedrecipe, {through: "savedrecipesCuisines"})
    }
  }
  cuisine.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cuisine',
  });
  return cuisine;
};