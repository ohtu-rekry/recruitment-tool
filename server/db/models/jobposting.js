module.exports = (sequelize, DataTypes) => {
  const JobPosting = sequelize.define('JobPosting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    content: {
      type: DataTypes.STRING(4000),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
  }, {})

  JobPosting.associate = (models) => {

  }

  return JobPosting
}