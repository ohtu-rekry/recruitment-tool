const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const { Recruiter, JobPosting, JobApplication, sequelize } = require('../db/models')
const { tooLongContent, tooLongTitle } = require('../utils/jobpostingTestUtils')

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

  test('a posting cannot be created with a title longer than 255 chars', async () => {
    const newPosting = {
      title: tooLongTitle,
      content: 'We need you'
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({
      error: `Title is too long, ${tooLongTitle.length} chars, when max is 255`
    })
  })

  test('a posting cannot be created with a content longer than 4000 chars', async () => {
    const newPosting = {
      title: 'Senior React developer',
      content: tooLongContent
    }

    const response = await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({
      error: `Content is too long, ${tooLongContent.length} chars, when max is 4000`
    })
  })

  afterAll(async () => {
    await Recruiter.destroy({
      where: {
        username: testRecruiter.username
      }
    })
    await JobPosting.destroy({
      where: {
        title: 'Senior Java Developer'
      }
    })
    await JobPosting.destroy({
      where: {
        title: 'Junior Front End Developer'
      }
    })
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
    content: 'POTUS NEEDED'
  }

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(newRecruiter.password, 10)
    await Recruiter.create({
      username: newRecruiter.username,
      password: hashedPassword
    })

    const loginResponse = await api.post('/api/login').send(newRecruiter)
    token = `Bearer ${loginResponse.body.token}`

    await api
      .post('/api/jobposting')
      .send(newPosting)
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const jobPosting = await JobPosting.findOne({ where: { title: 'President' } })
    const jobPostingId = jobPosting.id

    await JobApplication.create({
      applicantName: 'Donald Trump',
      applicantEmail: 'president@whitehouse.gov',
      jobPostingId: jobPostingId
    })

    await JobApplication.create({
      applicantName: 'Hillary Clinton',
      applicantEmail: 'Hillary@Clinton.com',
      jobPostingId: jobPostingId
    })
  })

  test('applicants can be fetched when logged in', async () => {
    const jobPosting = await JobPosting.findOne({ where: { title: 'President' } })
    const jobPostingId = jobPosting.id

    const response = await api
      .get(`/api/jobposting/${jobPostingId}/applicants`)
      .set('authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length === 2)
  })

  test('applicants cannot be fetched when not logged in', async () => {
    const jobPosting = await JobPosting.findOne({ where: { title: 'President' } })
    const jobPostingId = jobPosting.id

    const response = await api
      .get(`/api/jobposting/${jobPostingId}/applicants`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual({ error: 'Operation unauthorized' })
  })

  afterAll(async () => {
    await JobPosting.destroy({
      where: {
        title: 'President'
      }
    })

    await JobApplication.destroy({
      where: {
        applicantName: 'Hillary Clinton'
      }
    })

    await JobApplication.destroy({
      where: {
        applicantName: 'Donald Trump'
      }
    })

    await Recruiter.destroy({
      where: {
        username: newRecruiter.username
      }
    })
  })
})

afterAll(async () => {
  await server.close()
  await sequelize.close()
})
