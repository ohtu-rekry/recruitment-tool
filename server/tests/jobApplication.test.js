const supertest = require('supertest')
const bcrypt = require('bcryptjs')

const { app, server } = require('../src/server')
const api = supertest(app)
const { Recruiter, JobPosting, JobApplication, PostingStage, sequelize } = require('../db/models')

beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})

describe('POST jobApplication', async () => {
  let jobPostingId = null
  const testRecruiter = {
    username: 'recruiteradmin',
    password: 'fsdGSDjugs22'
  }
  const testJobPosting = {
    title: 'Data scientist',
    content: 'Looking for data expert',
    stages: ['application-test-example-stage1','application-test-example-stage2']
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    const createdRecruiter = await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })
    const recruiterId = createdRecruiter.dataValues.id

    const createdJobPosting = await JobPosting.create({
      title: testJobPosting.title,
      content: testJobPosting.content,
      recruiterId: recruiterId
    })
    jobPostingId = createdJobPosting.dataValues.id

    await Promise.all(testJobPosting.stages.map(stage => {PostingStage.create({
      stageName: stage,
      jobPostingId
    })}))
  })

  test('jobApplicant can post new jobApplication', async () => {

    const newJobApplication = {
      applicantName: 'Mikko',
      applicantEmail: 'mikko@mallikas.fi',
      jobPostingId: jobPostingId
    }

    await api
      .post('/api/jobapplication')
      .send(newJobApplication)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .catch(e => console.log(e))
  })
})

afterAll(async () => {
  await Recruiter.destroy({
    where: {
      username: 'recruiteradmin'
    }
  })

  await JobApplication.destroy({
    where: {
      applicantName: 'Mikko'
    }
  })

  await PostingStage.destroy({
    where: {
      stageName: 'application-test-example-stage1'
    }
  })

  await PostingStage.destroy({
    where: {
      stageName: 'application-test-example-stage2'
    }
  })

  await JobPosting.destroy({
    where: {
      title: 'Data scientist'
    }
  })

  await server.close()
  await sequelize.close()
})
