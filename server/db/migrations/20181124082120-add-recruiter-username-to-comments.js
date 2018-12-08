'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const applicationsComments = 'ApplicationComments'
    const recruiterUsername = 'recruiterUsername'
    const tableDefinition
      = await queryInterface.describeTable(applicationsComments)

    if (tableDefinition[recruiterUsername])
      return Promise.resolve()

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