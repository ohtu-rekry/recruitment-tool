'use strict'

module.exports = (sequelize, DataTypes) => {

  const JobApplication = sequelize.define('JobApplication', {
    applicantName: {type: DataTypes.STRING, allowNull: false},
    applicantEmail: {type: DataTypes.STRING, allowNull: false}
  }, {})

  JobApplication.associate = function(models) {
    JobApplication.belongsTo(models.PostingStage, {
      foreignKey: { name: 'postingStageId', allowNull: false },
      onDelete: 'CASCADE',
      hooks: true
    })
  }

  return JobApplication
}