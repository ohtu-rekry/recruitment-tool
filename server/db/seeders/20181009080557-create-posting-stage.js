'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('PostingStages', [{
      stageName: 'Applied',
      jobPostingId: 1,
      orderNumber: 0,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    },
    {
      stageName: 'Interview',
      jobPostingId: 1,
      orderNumber: 1,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    },
    {
      stageName: 'Homework',
      jobPostingId: 1,
      orderNumber: 2,
      createdAt: '2018-09-12 21:57:30.176+03',
      updatedAt: '2018-09-12 21:57:30.176+03'
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('PostingStages', null, {})
  }
}