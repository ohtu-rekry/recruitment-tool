const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    freezeTableName: true,
    intanceMethods: {
      generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
      },
      validPassword(password) {
        return bcrypt.compareSync(password, this.local.password)
      }
    }
  }, {})
  User.associate = (models) => {
    // associations can be defined here
  }
  return User
}