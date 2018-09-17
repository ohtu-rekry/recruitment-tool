module.exports = (sequelize, type) => {
  const Recruiter = sequelize.define('Recruiter', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: type.STRING,
    password: type.STRING,
  }, {})
  Recruiter.associate = () => {
    // associations can be defined here
  }
  return Recruiter
}