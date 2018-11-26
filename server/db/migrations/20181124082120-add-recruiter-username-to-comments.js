'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'ApplicationComments',
      'recruiterUsername',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('ApplicationComments', 'recruiterUsername')
  }
}
