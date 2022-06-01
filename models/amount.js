'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class amount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.amount.belongsTo(models.ingredient)
      models.amount.belongsTo(models.savedrecipe)
    }
  }
  amount.init({
    value: DataTypes.FLOAT,
    uom: DataTypes.STRING,
    savedrecipeId: DataTypes.INTEGER,
    ingredientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'amount',
  });
  return amount;
};