'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'JobPostings',
      'showFrom',
      Sequelize.DATE,
    )
    return queryInterface.addColumn(
      'JobPostings',
      'showTo',
      Sequelize.DATE,
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'JobPostings',
      'showFrom',
      Sequelize.DATE
    )
    return queryInterface.removeColumn(
      'JobPostings',
      'showTo',
      Sequelize.DATE,
    )
  }
}
