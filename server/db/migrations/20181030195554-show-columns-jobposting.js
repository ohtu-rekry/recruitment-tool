'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const jobPostings = 'JobPostings'
    const showFrom = 'showFrom'
    const showTo = 'showTo'

    await queryInterface.addColumn(
      jobPostings,
      showFrom,
      Sequelize.DATE,
    )

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