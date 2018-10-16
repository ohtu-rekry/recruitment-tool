'use strict'

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('JobApplications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicantName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      applicantEmail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      postingStageId: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('JobApplications')
  }
}