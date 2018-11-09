'use strict'
module.exports = (sequelize, DataTypes) => {

  const PostingStage = sequelize.define('PostingStage', {
    stageName: { type: DataTypes.STRING, allowNull: false },
    orderNumber: { type: DataTypes.INTEGER, allowNull: false }
  }, {})

  PostingStage.associate = function (models) {
    PostingStage.hasMany(models.JobApplication, {
      foreignKey: { name: 'postingStageId', allowNull: false },
      onDelete: 'CASCADE',
      hooks: true,
      as: 'jobApplications'
    })

    PostingStage.belongsTo(models.JobPosting, {
      foreignKey: { name: 'jobPostingId', allowNull: false },
      onDelete: 'CASCADE',
      hooks: true
    })
  }

  return PostingStage
}