module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define('JobApplication', {
    applicantName: DataTypes.STRING,
    applicantEmail: DataTypes.STRING,
    jobPostingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {})
  JobApplication.associate = function (models) {
    // associations can be defined here
    JobApplication.belongsTo(models.JobPosting, {
      foreignKey: 'jobPostingId',
      onDelete: 'CASCADE'
    })
  }
  return JobApplication
}