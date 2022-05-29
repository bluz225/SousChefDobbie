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