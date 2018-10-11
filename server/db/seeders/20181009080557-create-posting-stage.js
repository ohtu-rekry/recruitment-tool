'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('PostingStages', [{
      stageName: 'Interview',
      jobPostingId: 1,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    },
    {
      stageName: 'Homework',
      jobPostingId: 1,
      createdAt: '2018-09-12 21:57:30.176+03',
      updatedAt: '2018-09-12 21:57:30.176+03'
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('PostingStages', null, {})
  }
}