const supertest = require('supertest')
const { app, server } = require('../src/server')
const api = supertest(app)
const { JobPosting, sequelize } = require('../db/models')


beforeAll(async () => {
  await sequelize.sync({ logging: false })
    .catch(err => {
      console.log(err)
    })
})

test('jobPostings are returned as json', async () => {
  await api
    .get('/api/jobpostings')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  server.close()
  sequelize.close()
})