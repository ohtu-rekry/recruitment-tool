module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define('JobApplication', {
    applicantName: DataTypes.STRING,
    applicantEmail: DataTypes.STRING,
    jobPostingId: DataTypes.INTEGER
  }, {})
  JobApplication.associate = function (models) {
    JobApplication.belongsTo(models.JobPosting, {
      foreignKey: 'jobPostingId',
      targeKey: 'id',
      onDelete: 'CASCADE'
    })
  }
  return JobApplication
}