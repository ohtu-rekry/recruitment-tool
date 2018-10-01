module.exports = (sequelize, DataTypes) => {
  const JobPosting = sequelize.define('JobPosting', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    recruiterId: DataTypes.INTEGER
  }, {})
  JobPosting.associate = (models) => {
    JobPosting.belongsTo(models.Recruiter)
    JobPosting.hasMany(models.JobApplication, {
      foreignKey: 'jobPostingId',
      sourceKey: 'id'
    })
  }
  return JobPosting
}