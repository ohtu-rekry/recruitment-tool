'use strict'

module.exports = (sequelize, DataTypes) => {
  const JobPosting = sequelize.define('JobPosting', {
    title: {type: DataTypes.STRING, allowNull: false},
    content: {type: DataTypes.TEXT, allowNull: false}
  }, {})
  JobPosting.associate = function (models) {
    //JobPosting has one recruiter who has created it
    JobPosting.hasMany(models.PostingStage, {
      foreignKey: { name: 'jobPostingId' , allowNull: false},
      onDelete: 'CASCADE',
      hooks: true,
      as: 'postingStages'
    })

    JobPosting.belongsTo(models.Recruiter, {
      foreignKey: { name: 'recruiterId', allowNull: false },
      onDelete: 'CASCADE',
      hooks: true
    })
  }
  return JobPosting
}