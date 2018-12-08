const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { JobPosting, sequelize, Recruiter, PostingStage, JobApplication } = require('../db/models')

beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})

describe('FETCH applicants for jobPosting', async () => {
  let token = null
  const newRecruiter = {
    username: 'admin',
    password: 'hunter2'
  }

  const showFromDate = moment().subtract(5, 'days').format('YYYY/MM/DD')
  const showToDate = moment().add(100, 'years').format('YYYY/MM/DD')

  const newPosting = {
    title: 'President',
    content: 'POTUS NEEDED',
    stages: [{ stageName: 'Applied' }, { stageName: 'Interview' }, { stageName: 'Accepted' }],
    showFrom: showFromDate,
    showTo: showToDate
  }

  const newApplicant = {
    applicantName: 'Donald Trump',
    applicantEmail: 'potus@whitehouse.com'
  }

  const newApplicant2 = {
    applicantName: 'Hillary Clinton',
    applicantEmail: 'runnerup@whitehouse.com'
  }

  const stages = [
    'stage1',
    'stage2',
    'stage3'
  ]

  let jobPosting = ''
  let jobPostingId = ''

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(newRecruiter.password, 10)
    await Recruiter.create({
      username: newRecruiter.username,
      password: passwordHash
    })

    const response = await api.post('/api/login').send(newRecruiter)
    token = `Bearer ${response.body.token}`

    jobPosting = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await stages.map((stage, index) => {
      PostingStage.create({
        stageName: stage,
        orderNumber: index,
        jobPostingId: jobPosting.body.id
      })
    })

    const firstPostingStage = await PostingStage.findOne({
      where: {
        jobPostingId: jobPosting.body.id,
        orderNumber: 0
      }
    })

    newApplicant.postingStageId = firstPostingStage.id
    newApplicant2.postingStageId = firstPostingStage.id

    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')
    console.log('JEE')


    console.log(newApplicant)


    await api
      .post('/api/jobapplication')
      .send(newApplicant)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/jobapplication')
      .send(newApplicant2)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('applicants can be fetched when logged in', async () => {
    const response = await api
      .get(`/api/jobposting/${jobPostingId}/applicants`)
      .set('authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length === 3)

  })

  test('applicants cannot be fetched when not logged in', async () => {
    const response = await api
      .get(`/api/jobposting/${jobPostingId}/applicants`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'No authorization token was found' })
  })

  afterAll(async () => {
    await JobApplication.destroy({
      where: { applicantName: newApplicant.applicantName }
    })

    await JobApplication.destroy({
      where: { applicantName: newApplicant2.applicantName }
    })

    await PostingStage.destroy({
      where: { jobPostingId: jobPostingId }
    })

    await JobPosting.destroy({
      where: { title: newPosting.title }
    })

    await JobPosting.destroy({
      where: { content: 'POTUS NEEDED' }
    })

    await Recruiter.destroy({
      where: { username: newRecruiter.username }
    })
  })
})

afterAll(async () => {
  await server.close()
  await sequelize.close()
})