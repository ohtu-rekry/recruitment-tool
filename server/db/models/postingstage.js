'use strict'
module.exports = (sequelize, DataTypes) => {

  const PostingStage = sequelize.define('PostingStage', {
    stageName: DataTypes.STRING,
    orderNumber: {type: DataTypes.INTEGER, allowNull: false}
  }, {})

  PostingStage.associate = function (models) {
    PostingStage.hasMany(models.JobApplication, {
      foreignKey: 'postingStageId',
      as: 'jobApplications'
    })

    PostingStage.belongsTo(models.JobPosting, {
      foreignKey: 'jobPostingId',
      onDelete: 'CASCADE',
      hooks: true
    })
  }

  return PostingStage
}