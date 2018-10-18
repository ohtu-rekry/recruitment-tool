const { Recruiter, JobPosting, PostingStage } = require('../models')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Recruiters', [{
      username: 'test',
      password: 'test',
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    }], {})

    const admin = await Recruiter.findOne({ where: { username: 'test' } })

    await queryInterface.bulkInsert('JobPostings', [{
      title: 'Full-Stack Developer',
      content: 'We are looking for Node and React talent!',
      recruiterId: admin.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    },
    {
      title: 'Data scientist',
      content: 'Are you a bit hungrier than the average coder? We offer you a unique chance to grow as a top-tier professional instead of doing the basic nine-to-five programming job. If you are looking for something different, hear us out!',
      recruiterId: admin.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    }], {})

    const jobPosting = await JobPosting.findOne({ where: { title: 'Full-Stack Developer' } })

    await queryInterface.bulkInsert('PostingStages', [{
      stageName: 'Interview',
      jobPostingId: jobPosting.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03',
      orderNumber: 0
    },
    {
      stageName: 'Homework',
      jobPostingId: jobPosting.id,
      createdAt: '2018-09-12 21:57:30.176+03',
      updatedAt: '2018-09-12 21:57:30.176+03',
      orderNumber: 1
    }], {})

    const interview = await PostingStage.findOne({ where: { stageName: 'Interview' } })
    const homework = await PostingStage.findOne({ where: { stageName: 'Homework' } })

    return queryInterface.bulkInsert('JobApplications', [{
      applicantName: 'Donald Trump',
      applicantEmail: 'president@whitehouse.com',
      postingStageId: interview.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    },
    {
      applicantName: 'Mickey Mouse',
      applicantEmail: 'mickey@housemouse.org',
      postingStageId: homework.id,
      createdAt: '2018-09-13 21:57:29.176+03',
      updatedAt: '2018-09-13 21:57:29.176+03'
    }], {})
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('JobApplications', null, {})
    await queryInterface.bulkDelete('PostingStages', null, {})
    await queryInterface.bulkDelete('JobPostings', null, {})
    return queryInterface.bulkDelete('Recruiters', null, {})
  }
}
