'use strict'
module.exports = (sequelize, DataTypes) => {

  const ApplicationComment = sequelize.define('ApplicationComment', {
    comment: { type: DataTypes.TEXT, allowNull: false },
    recruiterUsername: { type: DataTypes.STRING, allowNull: false },
  }, {})

  ApplicationComment.associate = function(models) {
    /* Comment has a recruiter who created it
    Not sure if comments should be deleted when recruiter is for transparencys sake*/
    ApplicationComment.belongsTo(models.Recruiter, {
      foreignKey: { name: 'recruiterId', allowNull: false },
    })

    ApplicationComment.belongsTo(models.JobApplication, {
      foreignKey: { name: 'jobApplicationId', allowNull: false },
      onDelete: 'CASCADE',
      hooks: true
    })

    ApplicationComment.hasMany(models.Attachment, {
      foreignKey: { name: 'applicationCommentId' , allowNull: true },
      onDelete: 'CASCADE',
      hooks: true,
      as: 'attachments'
    })
  }

  return ApplicationComment
}