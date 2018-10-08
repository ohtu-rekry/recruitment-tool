module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Recruiters', [{
      username: 'test',
      password: 'test',
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Recruiters', null, {});
  }
}
