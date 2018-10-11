module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('JobPostings', [{
      title: 'Full-Stack Developer',
      content: 'We are looking for Node and React talent!',
      recruiterId: 1,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    },
    {
      title: 'Data scientist',
      content: 'Are you a bit hungrier than the average coder? We offer you a unique chance to grow as a top-tier professional instead of doing the basic nine-to-five programming job. If you are looking for something different, hear us out!',
      recruiterId: 1,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    }], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('JobPostings', null, {})
  }
}
