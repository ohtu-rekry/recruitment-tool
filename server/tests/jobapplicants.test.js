const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
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

  const newPosting = {
    title: 'President',
    content: 'POTUS NEEDED',
    stages: [{ stageName: 'Applied' }, { stageName: 'Interview' }]
  }

  const newApplicant = {
    applicantName: 'Donald Trump',
    applicantEmail: 'potus@whitehouse.com'
  }

  const newApplicant2 = {
    applicantName: 'Hillary Clinton',
    applicantEmail: 'runnerup@whitehouse.com'
  }

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

    jobPostingId = jobPosting.body.id
    newApplicant.jobPostingId = jobPostingId
    newApplicant2.jobPostingId = jobPostingId

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

    expect(response.body.length === 2)
    expect(response.body[0].length === 1)
    expect(response.body[1].length === 0)
  })

  test('applicants cannot be fetched when not logged in', async () => {
    const response = await api
      .get(`/api/jobposting/${jobPostingId}/applicants`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'Operation unauthorized' })
  })

  afterAll(async () => {
    await JobApplication.destroy({
      where: {},
      truncate: true
    })

    await PostingStage.destroy({
      where: {},
      truncate: true
    })

    await JobPosting.destroy({
      where: {},
      truncate: true
    })

    await Recruiter.destroy({
      where: {},
      truncate: true
    })
  })
})

afterAll(async () => {
  await server.close()
  await sequelize.close()
})