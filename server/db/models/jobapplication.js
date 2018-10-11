'use strict'

module.exports = (sequelize, DataTypes) => {

  const JobApplication = sequelize.define('JobApplication', {
    applicantName: DataTypes.STRING,
    applicantEmail: DataTypes.STRING
  }, {})

  JobApplication.associate = function(models) {
    JobApplication.belongsTo(models.PostingStage, {
      foreignKey: 'postingStageId',
      onDelete: 'CASCADE'
    })
  }

  return JobApplication
}