const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const { Recruiter, sequelize } = require('../db/models')

beforeAll(async () => {
  await sequelize.sync({ force: true, logging: false })
    .catch(err => {
      console.log(err)
    })
})

test('example test to run', async () => {
  await api
    .get('/')
    .expect(200)
    .expect('Hello world! \n')
})

test('Travis configuration for postgresql works', async () => {
  const newUser = await Recruiter.create({
    username: 'testuser',
    password: 'verybadpassword'
  }).catch(err => {
    console.log(err)
  })

  expect(newUser.username).toEqual('testuser')
  expect(newUser.password).toEqual('verybadpassword')

  await Recruiter.destroy({
    where: {
      username: 'testuser'
    }
  })

  const foundUser = await Recruiter.findOne({
    where: {
      username: 'testuser'
    }
  })

  expect(foundUser).toBe(null)
})

afterAll(async() => {
  await server.close()
  await sequelize.close()
})