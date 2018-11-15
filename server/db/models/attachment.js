'use strict'

module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
    path: { type: DataTypes.STRING, allowNull: false }
  }, {})

  Attachment.associate = function(models) {
    Attachment.belongsTo(models.ApplicationComment, {
      foreignKey: { name: 'applicationCommentId', allowNull: true },
    })

    Attachment.belongsTo(models.JobApplication, {
      foreignKey: { name: 'jobApplicationId', allowNull: true },
    })
  }
  return Attachment
}