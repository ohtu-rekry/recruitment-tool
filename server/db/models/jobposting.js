module.exports = (sequelize, DataTypes) => {
  const JobPosting = sequelize.define('JobPosting', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    recruiterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {})
  JobPosting.associate = function (models) {
    //JobPosting has one recruiter who has created it
    JobPosting.hasMany(models.JobApplication, {
      foreignKey: 'jobPostingId',
      as: 'jobApplications'
    })

    JobPosting.belongsTo(models.Recruiter, {
      foreignKey: 'recruiterId',
      onDelete: 'CASCADE'
    })
  }
  return JobPosting
}