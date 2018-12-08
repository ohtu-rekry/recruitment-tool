'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const jobPostings = 'JobPostings'
    const showFrom = 'showFrom'
    const showTo = 'showTo'
    const tableDefinition = await queryInterface.describeTable(jobPostings)

    if (!tableDefinition[showFrom])
      await queryInterface.addColumn(
        jobPostings,
        showFrom,
        Sequelize.DATE,
      )

    if (tableDefinition[showTo])
      return Promise.resolve()

    return queryInterface.addColumn(
      jobPostings,
      showTo,
      Sequelize.DATE,
    )
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'JobPostings',
      'showFrom'
    )
    return queryInterface.removeColumn(
      'JobPostings',
      'showTo',
    )
  }
}