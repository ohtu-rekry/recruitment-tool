const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const { JobPosting, sequelize, Recruiter } = require('../db/models')

beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})

describe('POST method', async () => {

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

  test('a valid job posting can be created if user is logged in', async () => {
    const newPosting = {
      title: 'Senior Java Developer',
      content: 'We are looking for someone with a minimum of 5 years of experience coding with Java'
    }

    await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid posting cannot be created if user is not logged in', async () => {
    const newPosting = {
      title: 'Junior Front End Developer',
      content: 'If you are interested in learning new technologies for front-end development, then this is the job for you'
    }

    await api
      .post('/api/jobposting')
      .send(newPosting)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('a posting cannot be created without a title', async () => {
    const newPosting = {
      content: 'Our development team is missing an experienced UI designer'
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'Title must be defined' })
  })

  test('a posting cannot be created without content', async () => {
    const newPosting = {
      title: 'UI designer'
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'Content must be defined' })
  })

  afterAll(async () => {
    await Recruiter.destroy({
      where: {
        username: testRecruiter.username
      }
    })
  })
})

describe('GET method', async () => {
  beforeAll(async () => {
    await JobPosting.create({
      title: 'frontend developer',
      content: '1 years of experience',
      recruiterId: 1
    })
    await JobPosting.create({
      title: 'backend developer',
      content: '102 years of experience',
      recruiterId: 1
    })
    await JobPosting.create({
      title: 'php developer',
      content: 'reconsider your life',
      recruiterId: 1
    })
  })
  test('can get jobpostings without being authentication', async () => {
    const response = await api
      .get('/api/jobposting')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length === 3)
  })
  afterAll(async () => {
    await JobPosting.destroy({
      where: {
        recruiterId: 1
      }
    })
  })
})

afterAll(async () => {
  await server.close()
  await sequelize.close()
})
