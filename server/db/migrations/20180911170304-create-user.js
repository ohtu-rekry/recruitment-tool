module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    })
  },
  down: (queryInterface) => { // function also takes Sequelizer as param (removed as was an unused var)
    return queryInterface.dropTable('Users')
  }
}