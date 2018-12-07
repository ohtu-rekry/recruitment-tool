const { Recruiter, JobPosting, PostingStage, JobApplication } = require('../models')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface) => {
    const hashedPasswordTest = await bcrypt.hash('test', 10)
    const hashedPasswordRoslin = await bcrypt.hash('roslin', 10)
    await queryInterface.bulkInsert('Recruiters', [{
      username: 'test',
      password: hashedPasswordTest,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03'
    },{
      username: 'roslin',
      password: hashedPasswordRoslin,
      createdAt: '2018-10-02 15:34:13.125+03',
      updatedAt: '2018-10-02 15:34:13.125+03'
    }], {})

    const test = await Recruiter.findOne({ where: { username: 'test' } })
    const roslin = await Recruiter.findOne({ where: { username: 'roslin' } })

    await queryInterface.bulkInsert('JobPostings', [{
      title: 'Full-Stack Developer',
      content: 'We are looking for Node and React talent!',
      recruiterId: test.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03',
      showFrom: '2018-09-12 21:00:00.100+03',
      showTo: '2018-12-24 23:59:59.999+03'
    },
    {
      title: 'Data scientist',
      content: 'Are you a bit hungrier than the average coder? We offer you a unique chance to grow as a top-tier professional instead of doing the basic nine-to-five programming job. If you are looking for something different, hear us out!',
      recruiterId: test.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03',
      showFrom: '2018-11-12 21:00:00.100+03',
      showTo: '2019-01-24 23:59:59.999+03'
    },], {})

    const fullStackPosting = await JobPosting.findOne({ where: { title: 'Full-Stack Developer' } })
    const dataScientistPosting = await JobPosting.findOne({ where: { title: 'Data scientist' } })

    await queryInterface.bulkInsert('PostingStages', [{
      stageName: 'Applied',
      jobPostingId: fullStackPosting.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03',
      orderNumber: 0
    },
    {
      stageName: 'Homework',
      jobPostingId: fullStackPosting.id,
      createdAt: '2018-09-12 21:57:30.176+03',
      updatedAt: '2018-09-12 21:57:30.176+03',
      orderNumber: 1
    },
    {
      stageName: 'Interview',
      jobPostingId: fullStackPosting.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03',
      orderNumber: 2
    },
    {
      stageName: 'Accepted',
      jobPostingId: fullStackPosting.id,
      createdAt: '2018-09-12 21:57:30.176+03',
      updatedAt: '2018-09-12 21:57:30.176+03',
      orderNumber: 3
    },
    {
      stageName: 'Rejected',
      jobPostingId: fullStackPosting.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03',
      orderNumber: 4
    },
    {
      stageName: 'Applied',
      jobPostingId: dataScientistPosting.id,
      createdAt: '2018-09-12 21:57:30.176+03',
      updatedAt: '2018-09-12 21:57:30.176+03',
      orderNumber: 0
    },
    {
      stageName: 'Accepted',
      jobPostingId: dataScientistPosting.id,
      createdAt: '2018-09-12 21:57:29.176+03',
      updatedAt: '2018-09-12 21:57:29.176+03',
      orderNumber: 1
    },
    {
      stageName: 'Rejected',
      jobPostingId: dataScientistPosting.id,
      createdAt: '2018-09-12 21:57:30.176+03',
      updatedAt: '2018-09-12 21:57:30.176+03',
      orderNumber: 2
    }], {})

    const interview = await PostingStage.findOne({ where: { stageName: 'Interview' } })
    const homework = await PostingStage.findOne({ where: { stageName: 'Homework' } })
    const dataScientistApplied = await PostingStage.findOne({
      where: {
        stageName: 'Applied',
        jobPostingId: dataScientistPosting.id
      }
    })

    await queryInterface.bulkInsert('JobApplications', [{
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
    },
    {
      applicantName: 'Pocahontas',
      applicantEmail: 'poca@colorofwind.com',
      postingStageId: dataScientistApplied.id,
      createdAt: '2018-11-02 08:23:29.176+03',
      updatedAt: '2018-11-05 11:47:38.085+03'
    }], {})

    const trump = await JobApplication.findOne({
      where: { applicantName: 'Donald Trump' }
    })
    const pocahontas = await JobApplication.findOne({
      where: { applicantName: 'Pocahontas' }
    })

    return queryInterface.bulkInsert('ApplicationComments', [
      {
        comment: 'Has loads of experience',
        recruiterId: test.id,
        recruiterUsername: test.username,
        jobApplicationId: pocahontas.id,
        createdAt: '2018-12-02 08:23:29.176+03',
        updatedAt: '2018-12-02 08:23:29.176+03'
      },{
        comment: 'Prefers working in frontend development',
        recruiterId: roslin.id,
        recruiterUsername: roslin.username,
        jobApplicationId: pocahontas.id,
        createdAt: '2018-12-05 08:23:29.176+03',
        updatedAt: '2018-12-05 08:23:29.176+03'
      },{
        comment: 'English skills are lacking',
        recruiterId: roslin.id,
        recruiterUsername: roslin.username,
        jobApplicationId: trump.id,
        createdAt: '2018-12-04 13:48:29.176+03',
        updatedAt: '2018-12-04 13:48:29.176+03'
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ApplicationComments', null, {})
    await queryInterface.bulkDelete('JobApplications', null, {})
    await queryInterface.bulkDelete('PostingStages', null, {})
    await queryInterface.bulkDelete('JobPostings', null, {})
    return queryInterface.bulkDelete('Recruiters', null, {
      where: { username: { [Sequelize.Op.in]: ['test', 'roslin'] } }
    })
  }
}
