module.exports = (sequelize, DataTypes) => {
  const Recruiter = sequelize.define('Recruiter', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {})
  Recruiter.associate = function (models) {

  }
  return Recruiter
}