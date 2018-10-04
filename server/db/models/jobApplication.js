module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define('JobApplication', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicantEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobPostingId: {
      type: DataTypes.INTEGER
    }
  }, {})
  JobApplication.associate = (models) => {
    JobApplication.belongsTo(models.JobPosting, {
      foreignKey: 'jobPostingId',
      targeKey: 'id',
      onDelete: 'CASCADE'
    })
  }

  return JobApplication
}