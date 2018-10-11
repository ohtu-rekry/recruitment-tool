'use strict'
module.exports = (sequelize, DataTypes) => {

  const PostingStage = sequelize.define('PostingStage', {
    stageName: DataTypes.STRING
  }, {})

  PostingStage.associate = function (models) {
    PostingStage.hasMany(models.JobApplication, {
      foreignKey: 'postingStageId',
      as: 'jobApplications'
    })

    PostingStage.belongsTo(models.JobPosting, {
      foreignKey: 'jobPostingId',
      onDelete: 'CASCADE'
    })
  }

  return PostingStage
}