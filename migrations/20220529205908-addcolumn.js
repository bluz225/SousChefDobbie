'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'savedrecipes',
        'userId',
        {
          type: Sequelize.INTEGER
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('savedrecipes', 'userId'),
    ]);
  }
};
