'use strict'

module.exports = (sequelize, DataTypes) => {
  const JobPosting = sequelize.define('JobPosting', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {})
  JobPosting.associate = function (models) {
    //JobPosting has one recruiter who has created it
    JobPosting.hasMany(models.PostingStage, {
      foreignKey: 'jobPostingId',
      as: 'postingStages'
    })

    JobPosting.belongsTo(models.Recruiter, {
      foreignKey: 'recruiterId',
      onDelete: 'CASCADE'
    })
  }
  return JobPosting
}