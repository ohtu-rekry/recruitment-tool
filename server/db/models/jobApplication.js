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
  }, {})
  JobApplication.associate = (models) => {
  }

  return JobApplication
}