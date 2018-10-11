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
  let token = null
  const testRecruiter = {
    username: 'recruiteradmin',
    password: 'fsdGSDjugs22'
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })
    const response = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${response.body.token}`
  })

  test('jobApplicant can post new jobApplication', async () => {
    const newPosting = {
      title: 'Data scientist',
      content: 'Looking for data expert'
    }

    await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .catch(e => console.log(e))

    const posting = await JobPosting.findOne(newPosting)

    await PostingStage
      .create({
        stageName: 'TestStage',
        jobPostingId: posting.id
      })
      .catch(e => console.log(e))

    const newJobApplication = {
      applicantName: 'Mikko',
      applicantEmail: 'mikko@mallikas.fi',
      jobPostingId: posting.id
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
      stageName: 'TestStage'
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
