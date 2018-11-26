'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'JobPostings',
      'showFrom',
      Sequelize.DATE,
    );
    queryInterface.addColumn(
      'JobPostings',
      'showTo',
      Sequelize.DATE,
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'JobPostings',
      'showFrom',
      Sequelize.DATE
    );
    queryInterface.removeColumn(
      'JobPostings',
      'showTo',
      Sequelize.DATE,
    )
  }
};
