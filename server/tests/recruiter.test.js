const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const { Recruiter, sequelize, Sequelize } = require('../db/models')
const bcrypt = require('bcryptjs')

beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})

describe('CREATE RECRUITER USER', async () => {
  const newRecruiter = {
    username: 'testi',
    password: 'hunter2'
  }
  const testRecruiter = {
    username: 'recruiter-test-username',
    password: 'recruiter-test-password'
  }
  let token

  beforeAll(async () => {
    await Recruiter.create({
      username: testRecruiter.username,
      password: await bcrypt.hash(testRecruiter.password, 10)
    })

    const response = await api.post('/api/login').send(testRecruiter)
    token = `Bearer ${response.body.token}`
  })

  beforeEach(async () => {
    await Recruiter.destroy({
      where: {
        username: newRecruiter.username
      }
    })
  })

  test('a recruiter user can be created', async () => {
    await api
      .post('/api/recruiter')
      .set('authorization', token)
      .send(newRecruiter)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('two identical usernames can not be created', async () => {
    await api
      .post('/api/recruiter')
      .set('authorization', token)
      .send(newRecruiter)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .post('/api/recruiter')
      .set('authorization', token)
      .send(newRecruiter)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'This username already exists.' })
  })

  test('a recruiter user with password less than 3 cannot be created', async () => {
    newRecruiter.password = 'hu'

    const result = await api
      .post('/api/recruiter')
      .set('authorization', token)
      .send(newRecruiter)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'password length must be at least 3 characters long' })
  })

  afterAll(async () => {
    await Recruiter.destroy({
      where: {
        username: {
          [Sequelize.Op.in]: [
            newRecruiter.username,
            testRecruiter.username
          ]
        }
      }
    })
    await server.close()
    await sequelize.close()
  })
})

