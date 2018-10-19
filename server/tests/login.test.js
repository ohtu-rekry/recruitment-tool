const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const { Recruiter, sequelize } = require('../db/models')

beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(() => {
      console.log('Another model synchronizing process has already started')
    })
})

describe('LOGIN AS RECRUITER', async () => {
  const newRecruiter = {
    username: 'adminlogin',
    password: 'hunter2'
  }

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(newRecruiter.password, 10)
    await Recruiter.create({
      username: newRecruiter.username,
      password: hashedPassword
    })
  })

  test('recruiter can login with existing user account', async () => {
    const result = await api
      .post('/api/login')
      .send(newRecruiter)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toMatchObject({ username: newRecruiter.username })
  })

  test('recruiter cannot login without existing user account', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'recruiter', password: 'hunter2' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'Username does not exist.' })
  })

  test('recruiter cannot login with wrong password', async () => {
    newRecruiter.password = 'hunter'

    const result = await api
      .post('/api/login')
      .send(newRecruiter)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'Wrong username or password.' })
  })

  afterAll(async () => {
    await Recruiter.destroy({
      where: {
        username: newRecruiter.username
      }
    })
    await server.close()
    await sequelize.close()
  })
})
