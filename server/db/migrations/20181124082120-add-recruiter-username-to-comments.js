'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const applicationsComments = 'ApplicationComments'
    const recruiterUsername = 'recruiterUsername'

    return queryInterface.addColumn(
      applicationsComments,
      recruiterUsername,
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn(
      'ApplicationComments', 'recruiterUsername'
    )
  }
}