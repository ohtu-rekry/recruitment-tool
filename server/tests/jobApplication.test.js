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

describe('CREATE OR CHANGE JOBAPPLICATION', async () => {
  let jobPostingId = null
  let token = null
  let firstPostingStage, secondPostingStage

  const testRecruiter = {
    username: 'recruiteradminjobapplicationtest',
    password: 'fsdGSDjugs22'
  }
  const testJobPosting = {
    title: 'Data scientist',
    content: 'Looking for data expert',
    stages: [{ stageName: 'application-test-stage1' }, { stageName: 'application-test-stage2' }]
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testRecruiter.password, 10)
    await Recruiter.create({
      username: testRecruiter.username,
      password: passwordHash
    })

    const loginResponse = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${loginResponse.body.token}`

    const jobpostingResponse = await api.post('/api/jobposting').send(testJobPosting).set('authorization', token)
    jobPostingId = jobpostingResponse.body.id

    firstPostingStage = await PostingStage.findOne({
      where: {
        jobPostingId,
        orderNumber: 0
      }
    })

    secondPostingStage = await PostingStage.findOne({
      where: {
        jobPostingId,
        orderNumber: 1
      }
    })

  })

  describe('POST', () => {

    test('jobApplicant can post new jobApplication', async () => {

      const newJobApplication = {
        applicantName: 'Mikko',
        applicantEmail: 'mikko@mallikas.fi',
        jobPostingId: jobPostingId
      }

      const response = await api
        .post('/api/jobapplication')
        .send(newJobApplication)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.postingStageId).toEqual(firstPostingStage.id)
    })
  })

  describe('PATCH', () => {
    let jobApplicationId

    beforeEach(async () => {
      const newJobApplication = {
        applicantName: 'Roope Ankka',
        applicantEmail: 'roope@ankka.fi',
        jobPostingId: jobPostingId
      }

      const jobApplicationResponse = await api.post('/api/jobapplication').send(newJobApplication)
      jobApplicationId = jobApplicationResponse.body.id
    })

    test('logged in user can move a jobApplication to another posting stage', async () => {
      const jobApplicationChange = {
        jobApplicationId,
        postingStageId: secondPostingStage.id
      }

      const response = await api
        .patch('/api/jobapplication')
        .send(jobApplicationChange)
        .set('authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.postingStageId).toEqual(secondPostingStage.id)
    })

    describe('cannot change posting stage of job application', async () => {

      test('if user is not logged in', async () => {
        const jobApplicationChange = {
          jobApplicationId,
          postingStageId: secondPostingStage.id
        }

        await api
          .patch('/api/jobapplication')
          .send(jobApplicationChange)
          .expect(401)
          .expect('Content-Type', /application\/json/)
      })

      test('without jobApplicationID', async () => {
        const jobApplicationChange = {
          postingStageId: secondPostingStage.id
        }

        const response = await api
          .patch('/api/jobapplication')
          .send(jobApplicationChange)
          .set('authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'Job application must be defined' })
      })

      test('without postingStageId', async () => {
        const jobApplicationChange = {
          jobApplicationId
        }

        const response = await api
          .patch('/api/jobapplication')
          .send(jobApplicationChange)
          .set('authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'Posting stage must be defined' })
      })

      test('if posting stage does not exist in database', async () => {
        const jobApplicationChange = {
          jobApplicationId,
          postingStageId: -1
        }

        const response = await api
          .patch('/api/jobapplication')
          .send(jobApplicationChange)
          .set('authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'Could not find posting stage' })
      })
    })

    afterEach(async () => {
      await JobApplication.destroy({
        where: {
          id: jobApplicationId
        }
      })
    })
  })

  afterAll(async () => {
    await Recruiter.destroy({
      where: {
        username: 'recruiteradminjobapplicationtest'
      }
    })

    await JobApplication.destroy({
      where: {
        applicantName: 'Mikko'
      }
    })

    await PostingStage.destroy({
      where: {
        stageName: 'application-test-stage1'
      }
    })

    await PostingStage.destroy({
      where: {
        stageName: 'application-test-stage2'
      }
    })

    await JobPosting.destroy({
      where: {
        title: 'Data scientist'
      }
    })
  })
})

  await JobPosting.destroy({
    where: {
      content: 'POTUS NEEDED'
    }
  })

afterAll(async () => {
  await server.close()
  await sequelize.close()
})
