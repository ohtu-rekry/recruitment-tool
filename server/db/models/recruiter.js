'use strict'

module.exports = (sequelize, DataTypes) => {
  const Recruiter = sequelize.define('Recruiter', {
    username: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
  }, {})
  Recruiter.associate = models => {
    //Recruiter has many jobpostings
    Recruiter.hasMany(models.JobPosting, {
      foreignKey: { name: 'recruiterId', allowNull: false },
      onDelete: 'CASCADE',
      hooks: true,
      as: 'jobPostings'
    })
    Recruiter.hasMany(models.ApplicationComment, {
      foreignKey: { name: 'recruiterId', allowNull: false },
      onDelete: 'CASCADE',
      hooks: true,
      as: 'applicationComments'
    })
  }
  return Recruiter
}