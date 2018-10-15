'use strict'

module.exports = (sequelize, DataTypes) => {
  const Recruiter = sequelize.define('Recruiter', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {})
  Recruiter.associate = models => {
    //Recruiter has many jobpostings
    Recruiter.hasMany(models.JobPosting, {
      foreignKey: 'recruiterId',
      as: 'jobPostings'
    })
  }
  return Recruiter
}